// Copyright 2024, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen which includes people, cookies, visual mean snackType, and a numerical
 * mean snackType.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import Apple from './Apple.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import SnackStacker from '../../common/SnackStacker.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import Plate from '../../common/model/Plate.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

// constants
const APPLES_PER_COLLECTION_GROUP = 10;
const VERTICAL_SPACE_BETWEEN_APPLES_COLLECTION = 4; // in screen coords, empirically determined
const HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION = 5; // in screen coords, empirically determined
const INTER_STACKED_GROUP_SPACING = 20;
const COLLECTION_BOTTOM_Y = 10; // in screen coords, empirically determined
const APPLE_FRACTION_DISTRIBUTION_DELAY = 0.75; // in seconds

// Size of the collection area, empirically determined. Could be derived from other constants, but didn't seem worth it.
const COLLECTION_AREA_SIZE = new Dimension2( 410, 120 );

export class NotepadMode extends EnumerationValue {

  // The information is displayed such that it is in sync with what is on the plates on the table.
  public static readonly SYNC = new NotepadMode( MeanShareAndBalanceStrings.syncStringProperty );

  // The snacks are collected into a single display that doesn't show the plates.
  public static readonly COLLECT = new NotepadMode( MeanShareAndBalanceStrings.collectStringProperty );

  // The total amount of snacks on the table are shared evenly between the plates in the notepad.
  public static readonly SHARE = new NotepadMode( MeanShareAndBalanceStrings.shareStringProperty );

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( NotepadMode, {
    phetioDocumentation: 'Describes the way in which the information in the notepad is displayed.'
  } );

  public constructor( public readonly stringProperty: LocalizedStringProperty ) {
    super();
  }
}

export default class FairShareModel extends SharingModel<Apple> {

  // An enumeration property that controls the way in which the quantity of snacks on the table are displayed on the
  // notepad.  See the enumeration for more information on the possible modes.
  public readonly notepadModeProperty: EnumerationProperty<NotepadMode>;

  // The area in coordinate space where the Apple instances will be placed and organized when in Collection mode.
  public readonly collectionArea: Bounds2;

  // Apples that were placed at the top of the collection area when transitioning from Collect to Share mode and that
  // need to be turned into fractional apples and sent to a plate.
  private readonly applesAwaitingFractionalization: Apple[] = [];

  // A timer listener for the 2nd phase of the animation that distributes apples from the collection area to the plates
  // when there are fractional apples involved (Share mode).
  private collectToShareAnimationTimerListener: TimerListener | null = null;

  public constructor( providedOptions: FairShareModelOptions ) {

    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {
      numberOfSnacksOnFirstPlate: 2
    }, providedOptions );
    super( options );

    this.notepadModeProperty = new EnumerationProperty( NotepadMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadModeProperty' ),
      phetioFeatured: true
    } );

    this.plates.forEach( plate => {

      // Move the apples on the plates when the plates themselves move except when the notepad is in Collect mode.
      plate.xPositionProperty.lazyLink( () => {
        if ( this.notepadModeProperty.value !== NotepadMode.COLLECT ) {
          const sortedApples = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          sortedApples.forEach( ( apple, i ) => {
            apple.moveTo( SnackStacker.getStackedApplePosition( plate, i ) );
          } );
        }
      } );

      plate.isActiveProperty.lazyLink( isActive => {
        if ( !isActive ) {
          plate.tableSnackNumberProperty.set( 0 );
        }
        else {
          plate.tableSnackNumberProperty.reset();
        }
      } );
    } );

    // Define the area where the apples will be collected when in Collection mode.
    this.collectionArea = new Bounds2(
      0,
      MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y - 100,
      100,
      MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 100
    );

    const applesParentTandem = options.tandem.createTandem( 'notepadApples' );
    let totalApplesCount = 1; // start at 1 for more user friendly phet-io IDs

    // Handle a change in the mode setting for the notepad.  This is a complex process that can trigger animations and
    // moves the apples around between plates and the collection area.
    const handleModeChange = ( notepadMode: NotepadMode, previousNotepadMode: NotepadMode | null ): void => {

      // Make sure any leftover animations from previous mode changes are cleared.
      this.finishInProgressAnimations();

      if ( previousNotepadMode === NotepadMode.COLLECT && notepadMode === NotepadMode.SYNC ) {

        this.redistributeUnparentedApples();
        const activeApples = this.getActiveSnacks();
        const inactiveApples = this.getInactiveSnacks();

        this.plates.forEach( plate => {
          _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, stackPosition => {
            if ( plate.isActiveProperty.value && stackPosition < plate.tableSnackNumberProperty.value ) {

              // Animate the apple traveling to the plate.  This apple will be visible on the plate.
              const apple = activeApples.shift();
              assert && assert( apple, 'an active apple should be available' );
              if ( apple ) {
                apple.parentPlateProperty.value = plate;
                apple.moveTo( SnackStacker.getStackedApplePosition( plate, stackPosition ), true );
              }
            }
            else {

              // Move the inactive apple instantly to the plate.  This will be invisible on the plate.
              const apple = inactiveApples.shift();
              assert && assert( apple, 'an inactive apple should be available' );
              if ( apple ) {
                apple.parentPlateProperty.value = plate;
                apple.moveTo( SnackStacker.getStackedApplePosition( plate, stackPosition ) );
              }
            }
          } );
        } );
      }
      else if ( previousNotepadMode === NotepadMode.SYNC && notepadMode === NotepadMode.COLLECT ) {

        // Animate the movement of the whole apples from the individual plates to the collection area.
        let collectionIndex = 0;
        this.plates.forEach( plate => {
          const sortedApples = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );
          sortedApples.forEach( apple => {
            if ( apple.isActiveProperty.value ) {
              apple.moveTo( this.getCollectionPosition( collectionIndex++ ), true );
            }
            apple.parentPlateProperty.value = null;
          } );
        } );
      }
      else if ( previousNotepadMode === NotepadMode.COLLECT && notepadMode === NotepadMode.SHARE ) {

        // This change is animated, and the animation happens in two phases.  First, all the whole apples go from their
        // position in the collection to the appropriate position on the plate while the whole pieces that will become
        // fractional move to the top. After that, the whole ones at the top become fractional and move to where they
        // need to go.

        this.redistributeUnparentedApples();
        const numberOfWholeApplesPerPlate = Math.floor( this.meanProperty.value );

        const availableActiveApples = this.getActiveSnacks();
        assert && assert(
          availableActiveApples.length === this.totalSnacksProperty.value,
          'these values should be in sync'
        );
        this.plates.forEach( plate => {
          if ( plate.isActiveProperty.value ) {

            // Move the correct number of whole apples to the plate.
            _.times( numberOfWholeApplesPerPlate, i => {
              const destination = SnackStacker.getStackedApplePosition( plate, i );
              const apple = availableActiveApples.shift();
              assert && assert( apple, 'there should be at least one apple available' );
              if ( apple ) {
                apple.parentPlateProperty.value = plate;
                apple.moveTo( destination, true );
              }
            } );
          }
        } );

        assert && assert(
          availableActiveApples.length === this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
          'unexpected number of apples to be fractionalized'
        );

        // The remaining active apples are moved to the top of the screen prior to being made fractional and distributed.
        availableActiveApples.forEach( ( apple, i ) => {
          apple.parentPlateProperty.value = null;
          apple.moveTo(
            new Vector2(
              i * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
              -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y )
            ),
            true
          );
          this.applesAwaitingFractionalization.push( apple );
        } );

        if ( this.applesAwaitingFractionalization.length > 0 ) {

          // Calculate the fractional amount that will be set for the apples being distributed to the plates.
          const fractionAmount = new Fraction(
            this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
            this.numberOfPlatesProperty.value
          );

          // Set a timer for the 2nd phase of the animation, which is when the whole apples that were moved to the top of
          // the screen are turned into fractions, any additional fractional apples are added, and then they are
          // distributed to each of the active plates.
          this.collectToShareAnimationTimerListener = stepTimer.setTimeout( () => {

            // Verify the state is consistent.
            assert && assert( fractionAmount.value > 0 && this.applesAwaitingFractionalization.length > 0,
              'invalid state: there must be apples available for fractionalization if the fraction is > zero'
            );

            // Get the position of the rightmost apple that's currently waiting for positioning the new ones.
            const rightmostWaitingApplePosition = this.applesAwaitingFractionalization.reduce(
              ( previousPosition, apple ) => apple.positionProperty.value.x > previousPosition.x ?
                                             apple.positionProperty.value :
                                             previousPosition,
              new Vector2( Number.NEGATIVE_INFINITY, 0 )
            );

            // Add the number of additional apples needed for fractionalization and distribution.
            const inactiveApples = this.getInactiveSnacks();
            const numberOfAdditionalApplesNeeded = this.numberOfPlatesProperty.value -
                                                   this.applesAwaitingFractionalization.length;
            _.times( numberOfAdditionalApplesNeeded, i => {
              const appleToAdd = inactiveApples.pop();
              if ( appleToAdd ) {
                appleToAdd.isActiveProperty.value = true;
                appleToAdd.fractionProperty.value = fractionAmount;
                appleToAdd.moveTo( new Vector2(
                  rightmostWaitingApplePosition.x + ( i + 1 ) * MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION,
                  rightmostWaitingApplePosition.y
                ) );
                this.applesAwaitingFractionalization.push( appleToAdd );
              }
            } );

            // Distribute the fractionalized apples to the plates.
            this.applesAwaitingFractionalization.forEach( ( apple, i ) => {
              apple.fractionProperty.value = fractionAmount;
              const plate = this.plates[ i ];
              apple.parentPlateProperty.value = plate;
              const destination = SnackStacker.getStackedApplePosition( plate, numberOfWholeApplesPerPlate );
              apple.moveTo( destination, true );
            } );
            this.applesAwaitingFractionalization.length = 0;

            // Clear the timer.
            this.collectToShareAnimationTimerListener = null;

          }, APPLE_FRACTION_DISTRIBUTION_DELAY * 1000 );
        }
      }
      else if ( previousNotepadMode === NotepadMode.SHARE && notepadMode === NotepadMode.COLLECT ) {

        // Make sure all apples are whole.
        this.snacks.forEach( snack => { snack.fractionProperty.reset(); } );

        // Animate the movement of the apples from the individual plates to the collection area.
        let collectionIndex = 0;
        this.plates.forEach( plate => {
          if ( plate.isActiveProperty.value ) {
            const activeApplesOnPlate = this.getSnacksAssignedToPlate( plate ).filter( apple => apple.isActiveProperty.value );
            activeApplesOnPlate.forEach( apple => {
              if ( collectionIndex < this.totalSnacksProperty.value ) {
                apple.moveTo( this.getCollectionPosition( collectionIndex ), true );
                apple.parentPlateProperty.value = null;
                collectionIndex++;
              }
              else {
                apple.isActiveProperty.value = false;
              }
            } );
          }
        } );
      }
      else if ( ( previousNotepadMode === NotepadMode.SHARE || previousNotepadMode === null ) &&
                notepadMode === NotepadMode.SYNC ) {

        // In the Sync mode the number of apples on the notepad plates match those shown on the table plates. There is
        // no animation needed for this mode change, so a simple way to make this happen is to set all snacks to have
        // their default parent plates and then activate the appropriate number of apples on each plate.

        this.snacks.forEach( snack => {
          snack.fractionProperty.reset();
          snack.parentPlateProperty.reset();
        } );

        // Position all snacks and activate them according to the number on each plate.
        this.plates.forEach( plate => {

          const apples = this.getSnacksAssignedToPlate( plate );
          apples.forEach( ( apple, index ) => {
            apple.moveTo( SnackStacker.getStackedApplePosition( plate, index ) );
            apple.isActiveProperty.value = plate.isActiveProperty.value && index < plate.tableSnackNumberProperty.value;
          } );
        } );
      }
      else if ( previousNotepadMode === NotepadMode.SYNC && notepadMode === NotepadMode.SHARE ) {

        // In the Share mode the total number of apples is split up evenly over all active plates, so each one ends up
        // with the mean value, which could include a fractional part.  There is no animation for this transition.

        const numberOfWholeApplesPerActivePlate = Math.floor( this.meanProperty.value );
        const fractionalAmount = numberOfWholeApplesPerActivePlate === this.meanProperty.value ?
                                 Fraction.ZERO :
                                 new Fraction(
                                   this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
                                   this.numberOfPlatesProperty.value
                                 );
        const totalActiveApplesPerActivePlate = numberOfWholeApplesPerActivePlate + ( fractionalAmount.value > 0 ? 1 : 0 );

        this.plates.forEach( plate => {

          const allApplesOnPlate = sortApplesByStackingOrder( this.getSnacksAssignedToPlate( plate ) );

          allApplesOnPlate.forEach( ( apple, i ) => {

            // Activate the whole apples for this plate as well as potentially one fractional one.
            apple.isActiveProperty.value = plate.isActiveProperty.value && i < totalActiveApplesPerActivePlate;

            // Set the apple to a whole or fractional value.
            if ( i === numberOfWholeApplesPerActivePlate && fractionalAmount.value > 0 ) {
              apple.fractionProperty.value = fractionalAmount;
            }
            else {
              apple.fractionProperty.value = Fraction.ONE;
            }
          } );
        } );
      }
      else {
        assert && assert( false, `Unhandled state transition - from ${previousNotepadMode} to ${notepadMode}` );
      }
    };

    // Handler function that is invoked when the total number of active apples changes.  This will activate and position
    // apples based on the current mode.
    const handleNumberOfSnacksChanged = ( totalSnacks: number ) => {

      // Force any in-progress animations to finish before doing anything so that the model doesn't end up in a wierd
      // state.  These animations, if present, would have been instigated by changes to the notebook mode.
      this.finishInProgressAnimations();

      const notepadMode = this.notepadModeProperty.value;
      if ( notepadMode === NotepadMode.SYNC ) {

        // Make sure the appropriate number of snacks is active on each plate.
        this.plates.forEach( plate => {
          const apples = this.getSnacksAssignedToPlate( plate );
          apples.forEach( ( apple, index ) => {
            apple.isActiveProperty.value = plate.isActiveProperty.value && index < plate.tableSnackNumberProperty.value;
          } );
        } );
      }
      else if ( notepadMode === NotepadMode.SHARE ) {

        // Calculate the whole and fractional apples per plate.  Don't use derived values here since that could
        // introduce an order dependency.
        const wholeApplesPerPlate = Math.floor( this.totalSnacksProperty.value / this.numberOfPlatesProperty.value );
        const fractionalAppleAmount = new Fraction(
          this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
          this.numberOfPlatesProperty.value
        );
        this.plates.forEach( plate => {

          const applesOnPlate = this.getSnacksAssignedToPlate( plate );

          if ( plate.isActiveProperty.value ) {

            applesOnPlate.forEach( ( apple, i ) => {
              if ( i < wholeApplesPerPlate ) {
                apple.isActiveProperty.value = true;
                apple.fractionProperty.value = Fraction.ONE;
              }
              else if ( i === wholeApplesPerPlate && fractionalAppleAmount.value > 0 ) {
                apple.isActiveProperty.value = true;
                apple.fractionProperty.value = fractionalAppleAmount;
              }
              else {
                apple.isActiveProperty.value = false;
              }
            } );

            this.reorganizeSnacks( plate );
          }
          else {

            // This plate is inactive, so deactivate all apples associated with it.
            applesOnPlate.forEach( apple => { apple.isActiveProperty.value = false; } );
          }
        } );
      }
      else if ( notepadMode === NotepadMode.COLLECT ) {

        //  Make sure the appropriate apples are active and in the right places within the collection.
        const activeApples = this.getActiveSnacks();
        const inactiveApples = this.getInactiveSnacks();
        const delta = totalSnacks - activeApples.length;
        if ( delta > 0 ) {

          // Activate the needed apples.
          _.times( delta, () => {
            const apple = inactiveApples.shift();
            assert && assert( apple, 'there should be an inactive apple available' );
            apple!.isActiveProperty.value = true;
            activeApples.push( apple! );
          } );
        }
        else if ( delta < 0 ) {

          _.times( -delta, () => {

            // Deactivate apples that are no longer needed.
            const apple = activeApples.pop();
            assert && assert( apple, 'there should be an active apple available' );
            apple!.isActiveProperty.value = false;
            inactiveApples.push( apple! );
          } );
        }

        activeApples.forEach( ( activeApple, i ) => {
          activeApple.positionProperty.set( this.getCollectionPosition( i ) );
        } );
      }
      else {
        assert && assert( false, `unhandled notepad mode: ${notepadMode}` );
      }
    };

    // Set up the initial states for the plates and the apples that go on them.
    this.plates.forEach( plate => {

      // Create and initialize all the apples.
      _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, appleIndex => {
        const isActive = plate.isActiveProperty.value && appleIndex < plate.tableSnackNumberProperty.value;

        const apple = new Apple( {
          isActive: isActive,
          plate: plate,
          position: SnackStacker.getStackedApplePosition( plate, appleIndex ),

          // phet-io
          tandem: applesParentTandem.createTandem( `notepadApple${totalApplesCount++}` )
        } );

        this.snacks.push( apple );
      } );
    } );

    // Update the view when the presentation mode changes.
    this.notepadModeProperty.link( handleModeChange );

    // Update the view when the number of active apples changes.
    this.totalSnacksProperty.link( handleNumberOfSnacksChanged );
  }

  /**
   * Finish any in-progress animations of snacks moving on the notepad.  This puts the model into a stable state where
   * it is ready for changes to the notepad mode, number of snacks, number of plates, etc.  If there are no animations
   * in progress when this is called it will have no effect.
   */
  private finishInProgressAnimations(): void {
    if ( this.collectToShareAnimationTimerListener ) {

      // Invoke the timer callback now.  This will initiate any movement of the apples, which will then be forced to
      // finish at the end of this method.
      this.collectToShareAnimationTimerListener( APPLE_FRACTION_DISTRIBUTION_DELAY );
      stepTimer.clearTimeout( this.collectToShareAnimationTimerListener );

      assert && assert( this.applesAwaitingFractionalization.length === 0,
        'there should be no apples waiting to be fractionalized any more'
      );
    }
    this.snacks.forEach( snack => snack.forceAnimationToFinish() );
  }

  /**
   * Assign any apples that don't have a parent plate to one that has space.  This is generally used when switching
   * from Collect mode to any of the other Notebook modes.
   */
  private redistributeUnparentedApples(): void {
    const unparentedApples = this.snacks.filter( apple => apple.parentPlateProperty.value === null );
    this.plates.forEach( plate => {
      const applesOnPlate = this.getSnacksAssignedToPlate( plate );
      _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE - applesOnPlate.length, () => {
        const apple = unparentedApples.pop();
        if ( apple ) {
          apple.parentPlateProperty.value = plate;
        }
      } );
    } );
  }

  /**
   * Get a position in model space for an apple in the "Collect" mode based on its index.
   */
  private getCollectionPosition( positionIndex: number ): Vector2 {
    const centerToCenterXInStack = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 +
                                   HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION;
    const centerToCenterY = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 +
                            VERTICAL_SPACE_BETWEEN_APPLES_COLLECTION;
    const centerToCenterXBetweenGroupLeftSides = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 4 +
                                                 HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION +
                                                 INTER_STACKED_GROUP_SPACING;
    const centerToCenterXBetweenGroups = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 +
                                         INTER_STACKED_GROUP_SPACING;

    // The set of stacks in the collection is centered by design, so first we need to figure out the overall span of the
    // stacks so that this can be factored in to the position calculations.
    const numberOfCompleteGroups = Math.floor( this.totalSnacksProperty.value / APPLES_PER_COLLECTION_GROUP );
    const numberOfApplesNotInCompleteGroup = this.totalSnacksProperty.value -
                                             ( numberOfCompleteGroups * APPLES_PER_COLLECTION_GROUP );
    let totalSpan = numberOfCompleteGroups * centerToCenterXInStack +
                    Math.max( numberOfCompleteGroups - 1, 0 ) * centerToCenterXBetweenGroups;

    if ( numberOfApplesNotInCompleteGroup === 1 ) {
      if ( numberOfCompleteGroups > 0 ) {

        // Add an amount to the total span corresponding to a partial additional group.
        totalSpan += centerToCenterXBetweenGroups;
      }
    }
    else if ( numberOfApplesNotInCompleteGroup >= 2 ) {

      if ( numberOfCompleteGroups > 0 ) {

        // Add an amount to the total span corresponding to an additional group.
        totalSpan += centerToCenterXBetweenGroupLeftSides;
      }
      else {

        // The total span is for one partial group with two columns.
        totalSpan += centerToCenterXInStack;
      }
    }
    const xAdjustForCentering = totalSpan / 2;

    const group = Math.floor( positionIndex / APPLES_PER_COLLECTION_GROUP );
    const column = positionIndex % 2;
    const row = Math.floor( ( positionIndex % APPLES_PER_COLLECTION_GROUP ) / 2 );
    const x = group * centerToCenterXBetweenGroupLeftSides + column * centerToCenterXInStack - xAdjustForCentering;
    const y = -( COLLECTION_BOTTOM_Y + MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS +
                 VERTICAL_SPACE_BETWEEN_APPLES_COLLECTION + row * centerToCenterY );
    return new Vector2( x, y );
  }

  /**
   * Re-stack snacks on the plate.
   */
  public override reorganizeSnacks( plate: Plate ): void {
    let stackIndex = 0;
    const applesOnPlate = this.getSnacksAssignedToPlate( plate );
    const activeApplesOnPlate = applesOnPlate.filter( apple => apple.isActiveProperty.value );
    const inactiveApplesOnPlate = applesOnPlate.filter( apple => !apple.isActiveProperty.value );
    activeApplesOnPlate.forEach( apple => {
      apple.positionProperty.value = SnackStacker.getStackedApplePosition( plate, stackIndex++ );
    } );
    inactiveApplesOnPlate.forEach( apple => {
      apple.positionProperty.value = SnackStacker.getStackedApplePosition( plate, stackIndex++ );
    } );
  }

  public override reset(): void {
    this.finishInProgressAnimations();
    this.notepadModeProperty.reset();

    super.reset();
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 300;
  public static readonly COLLECTION_AREA_SIZE = COLLECTION_AREA_SIZE;
}

/**
 * Given a set of apples, sort them in the order in which they are stacked on the plate.  The 0th apple will be the
 * lower left, then the lower right, then the left one on next row up, and so forth.
 */
const sortApplesByStackingOrder = ( apples: Apple[] ) => {
  return apples.sort( ( a: Apple, b: Apple ) => {

    // Verify that the apples aren't in the same place, since they can't be sorted if they are.
    assert && assert( !a.positionProperty.value.equals( b.positionProperty.value ), 'apples can\'t be sorted if in the same place' );

    // If the Y position is the same, sort by the X position, otherwise sort by Y position.
    if ( a.positionProperty.value.y === b.positionProperty.value.y ) {
      return a.positionProperty.value.x - b.positionProperty.value.x;
    }
    else {

      // Note that this is inverted because we are working in the graphics coordinate frame where lower Y values are
      // higher on the screen.
      return b.positionProperty.value.y - a.positionProperty.value.y;
    }
  } );
};

meanShareAndBalance.register( 'FairShareModel', FairShareModel );