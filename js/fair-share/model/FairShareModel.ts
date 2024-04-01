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
import { SnackOptions } from '../../common/model/Snack.js';
import createObservableArray, { ObservableArray, ObservableArrayIO } from '../../../../axon/js/createObservableArray.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

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

  // A timer listener for the 2nd phase of the animation that distributes apples from the collection area to the plates
  // when there are fractional apples involved (Share mode).
  private collectToShareAnimationTimerListener: TimerListener | null = null;

  // The place where the apples reside when they are in the collection, since they can't be on plates.
  private appleCollection: ObservableArray<Apple>;

  public constructor( providedOptions: FairShareModelOptions ) {

    const createApple = ( options: SnackOptions ) => new Apple( options );

    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {
      numberOfSnacksOnFirstPlate: 2
    }, providedOptions );

    super( createApple, SnackStacker.getStackedApplePosition, options );

    this.notepadModeProperty = new EnumerationProperty( NotepadMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadModeProperty' ),
      phetioFeatured: true
    } );

    this.appleCollection = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'appleCollection' )
    } );

    // Initialize the plates and set up plate-related behavior that is specific to the Leveling Out screen.
    this.plates.forEach( plate => {

      plate.isActiveProperty.lazyLink( isActive => {
        if ( !isActive ) {
          plate.tableSnackNumberProperty.set( 0 );
        }
        else {
          plate.tableSnackNumberProperty.value = plate.startingNumberOfSnacks;
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

    // Handle a change in the mode setting for the notepad.  This is a complex process that can trigger animations and
    // moves the apples around between plates and the collection area.
    const handleModeChange = ( notepadMode: NotepadMode, previousNotepadMode: NotepadMode | null ): void => {

      // Make sure any leftover animations from previous mode changes are cleared.
      this.finishInProgressAnimations();

      if ( previousNotepadMode === NotepadMode.COLLECT && notepadMode === NotepadMode.SYNC ) {

        // Take all the apples in the collection and add them to plates.
        this.plates.forEach( plate => {
          _.times( plate.tableSnackNumberProperty.value, () => {
            const apple = this.appleCollection.pop();
            assert && assert( apple, 'there should be enough apples to put on the plates' );
            plate.addSnackToTop( apple!, true );
          } );
        } );
      }
      else if ( previousNotepadMode === NotepadMode.SYNC && notepadMode === NotepadMode.COLLECT ) {

        // Move all apples from their current, synced up locations to the collection area.
        this.plates.forEach( plate => {
          while ( plate.getNumberOfNotepadSnacks() > 0 ) {
            const apple = plate.getTopSnackForTransfer() as Apple;
            apple.moveTo( this.getCollectionPosition( this.appleCollection.length ), true );
            this.appleCollection.push( apple );
          }
        } );
      }
      else if ( previousNotepadMode === NotepadMode.COLLECT && notepadMode === NotepadMode.SHARE ) {

        // This change is animated, and the animation happens in two phases.  First, all the whole apples go from their
        // position in the collection to the appropriate position on the plate while the whole pieces that will become
        // fractional move to the top. After that, the whole ones at the top become fractional and move to where they
        // need to go.

        const numberOfWholeApplesPerActivePlate = Math.floor( this.meanProperty.value );

        this.getActivePlates().forEach( plate => {

          // Move the correct number of whole apples from the collection to this plate.
          _.times( numberOfWholeApplesPerActivePlate, () => {
            const apple = this.appleCollection.pop();
            assert && assert( apple, 'there should be enough apples to transfer to the plates' );
            plate.addSnackToTop( apple!, true );
          } );
        } );

        // If there are apples still in the collection, these move to the top of the screen, and are subsequently turned
        // into fractional representations and distributed to the plates.
        if ( this.appleCollection.length > 0 ) {

          // Move the stragglers to the top of the notepad.
          this.appleCollection.forEach( ( apple, i ) => {
            apple.moveTo(
              new Vector2(
                i * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
                -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y )
              ),
              true
            );
          } );

          // Calculate the fractional amount that will be set for the apples being distributed to the plates.
          const fractionAmount = new Fraction(
            this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
            this.numberOfPlatesProperty.value
          );

          // Set a timer for the 2nd phase of the animation, which is when the whole apples that were moved to the top
          // of the screen are turned into fractions, any needed additional fractional apples are added, and then they
          // are distributed to each of the active plates.
          this.collectToShareAnimationTimerListener = stepTimer.setTimeout( () => {

            // Verify the state is consistent.
            assert && assert( fractionAmount.value > 0 && this.appleCollection.length > 0,
              'invalid state: there must be apples available for fractionalization if the fraction is > zero'
            );

            // Get the position of the rightmost apple that's currently waiting for positioning the new ones.
            const rightmostWaitingApplePosition = this.appleCollection.reduce(
              ( previousPosition, apple ) => apple.positionProperty.value.x > previousPosition.x ?
                                             apple.positionProperty.value :
                                             previousPosition,
              new Vector2( Number.NEGATIVE_INFINITY, 0 )
            );

            // Add the number of additional apples needed for fractionalization and distribution.
            const numberOfAdditionalApplesNeeded = this.numberOfPlatesProperty.value -
                                                   this.appleCollection.length;
            _.times( numberOfAdditionalApplesNeeded, i => {
              const appleToAdd = this.getUnusedSnack();
              assert && assert( appleToAdd, 'there should be unused apples available to add' );
              appleToAdd!.isActiveProperty.value = true;
              appleToAdd!.fractionProperty.value = fractionAmount;
              appleToAdd!.moveTo( new Vector2(
                rightmostWaitingApplePosition.x + ( i + 1 ) * MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION,
                rightmostWaitingApplePosition.y
              ) );
              this.appleCollection.push( appleToAdd! );
            } );

            // Distribute the fractionalized apples to the plates.
            _.times( this.appleCollection.length, i => {
              const apple = this.appleCollection.shift();
              apple!.fractionProperty.value = fractionAmount;
              this.plates[ i ].addSnackToTop( apple!, true );
            } );

            // Clear the timer.
            this.collectToShareAnimationTimerListener = null;

          }, APPLE_FRACTION_DISTRIBUTION_DELAY * 1000 );
        }
      }
      else if ( previousNotepadMode === NotepadMode.SHARE && notepadMode === NotepadMode.COLLECT ) {

        // Make sure all apples are whole.
        this.getAllSnacks().forEach( snack => { snack.fractionProperty.reset(); } );

        // Animate the movement of the apples from the individual plates to the collection area.
        this.getActivePlates().forEach( plate => {
          _.times( plate.getNumberOfNotepadSnacks(), () => {
            if ( this.appleCollection.length < this.totalSnacksProperty.value ) {

              // REVIEW: I think we talked about using generics for this already?
              const apple = plate.getTopSnackForTransfer() as Apple;
              apple.moveTo( this.getCollectionPosition( this.appleCollection.length ), true );
              this.appleCollection.push( apple );
            }
            else {

              // Enough apples have been added to the collection, so just remove the next one.
              plate.removeTopSnack();
            }
          } );
        } );
      }
      else if ( ( previousNotepadMode === NotepadMode.SHARE || previousNotepadMode === null ) &&
                notepadMode === NotepadMode.SYNC ) {

        // In the Sync mode the number of apples on the notepad plates match those shown on the table plates. There is
        // no animation needed for this mode change, so a simple way to make this happen is to set all snacks to have
        // their default parent plates and then activate the appropriate number of apples on each plate.

        // Reset the fraction Property for all snacks.
        this.getAllSnacks().forEach( snack => { snack.fractionProperty.value = Fraction.ONE; } );
        this.plates.forEach( plate => plate.syncNotepadToTable() );
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

        this.getActivePlates().forEach( plate => {

          // Add or remove apples to/from those on the notepad plate to get to the correct level.
          const delta = totalActiveApplesPerActivePlate - plate.getNumberOfNotepadSnacks();
          if ( delta > 0 ) {
            _.times( delta, () => plate.addASnack() );
          }
          else if ( delta < 0 ) {
            _.times( Math.abs( delta ), () => plate.removeTopSnack() );
          }

          if ( fractionalAmount.value > 0 ) {
            const topApple = plate.getTopSnack() as Apple;
            topApple.fractionProperty.value = fractionalAmount;
          }
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
          plate.syncNotepadToTable();
        } );
      }
      else if ( notepadMode === NotepadMode.SHARE ) {

        // Make all the apples whole to start with.
        this.getAllSnacks().forEach( snack => { snack.fractionProperty.value = Fraction.ONE; } );

        // Calculate the whole and fractional apples per plate.  Don't use derived values here since that could
        // introduce an order dependency.
        const wholeApplesPerPlate = Math.floor( this.totalSnacksProperty.value / this.numberOfPlatesProperty.value );
        const fractionalAppleAmount = new Fraction(
          this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
          this.numberOfPlatesProperty.value
        );
        const totalActiveApplesPerPlate = wholeApplesPerPlate + ( fractionalAppleAmount.value > 0 ? 1 : 0 );

        // Add or remove snacks to match the new amount.
        this.plates.forEach( plate => {

          if ( plate.isActiveProperty.value ) {

            // Calculate the difference between what is on this plate and what is needed.
            const delta = totalActiveApplesPerPlate - plate.getNumberOfNotepadSnacks();
            if ( delta > 0 ) {
              _.times( delta, () => plate.addASnack() );
            }
            else if ( delta < 0 ) {
              _.times( Math.abs( delta ), () => plate.removeTopSnack() );
            }

            // If there is a fractional amount, set it for the top apple.
            if ( fractionalAppleAmount.value > 0 ) {
              const topApple = plate.getTopSnack() as Apple;
              topApple.fractionProperty.value = fractionalAppleAmount;
            }
          }
          else {

            // This plate isn't active, so if it has any snacks they need to be released.
            plate.removeAllSnacks();
          }
        } );
      }
      else if ( notepadMode === NotepadMode.COLLECT ) {

        const delta = totalSnacks - this.appleCollection.length;
        if ( delta > 0 ) {

          // Add apples to the collection.
          _.times( delta, () => {
            const appleToAdd = this.getUnusedSnack();
            assert && assert( appleToAdd, 'there should be apples available to add' );
            appleToAdd!.isActiveProperty.value = true;
            this.appleCollection.push( appleToAdd! );
          } );
        }
        else if ( delta < 0 ) {

          // Remove apples from the collection.
          _.times( Math.abs( delta ), () => {
            const appleToRemove = this.appleCollection.pop();
            assert && assert( appleToRemove, 'there should be enough apples in the collection to support this' );
            appleToRemove!.isActiveProperty.value = false;
            appleToRemove!.positionProperty.value = MeanShareAndBalanceConstants.UNUSED_SNACK_POSITION;
            this.releaseSnack( appleToRemove! );
          } );
        }
        this.updateCollectedApplePositions();
      }
      else {
        assert && assert( false, `unhandled notepad mode: ${notepadMode}` );
      }
    };

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
    }
    this.snacks.forEach( snack => snack.forceAnimationToFinish() );
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
   * Update the positions for all apples in the collection.  It only makes sense to use this when in or going into the
   * Collect mode.
   */
  private updateCollectedApplePositions( animate = false ): void {
    this.appleCollection.forEach( ( apple, i ) => apple.moveTo( this.getCollectionPosition( i ), animate ) );
  }

  /**
   * Re-stack snacks on the plate.
   */
  public override reorganizeSnacks( plate: Plate ): void {
    let stackIndex = 0;
    const applesOnPlate = plate.getSnackStack() as Apple[];
    const activeApplesOnPlate = applesOnPlate.filter( apple => apple.isActiveProperty.value );
    const inactiveApplesOnPlate = applesOnPlate.filter( apple => !apple.isActiveProperty.value );
    activeApplesOnPlate.forEach( apple => {
      apple.positionProperty.value = SnackStacker.getStackedApplePosition( plate.xPositionProperty.value, stackIndex++ );
    } );
    inactiveApplesOnPlate.forEach( apple => {
      apple.positionProperty.value = SnackStacker.getStackedApplePosition( plate.xPositionProperty.value, stackIndex++ );
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

meanShareAndBalance.register( 'FairShareModel', FairShareModel );