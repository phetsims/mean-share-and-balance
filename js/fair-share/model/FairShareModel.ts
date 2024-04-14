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
import { TimerListener } from '../../../../axon/js/Timer.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { SnackOptions } from '../../common/model/Snack.js';
import createObservableArray, { ObservableArray, ObservableArrayIO } from '../../../../axon/js/createObservableArray.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import Plate from '../../common/model/Plate.js';
import Multilink from '../../../../axon/js/Multilink.js';

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
  public collectToShareAnimationTimerListener: TimerListener | null = null;

  // The place where the apples reside when they are in the collection, since they can't be on plates.
  private appleCollection: ObservableArray<Apple>;

  public constructor( providedOptions: FairShareModelOptions ) {

    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {
      numberOfSnacksOnFirstPlate: 2
    }, providedOptions );

    const createApple = ( options: SnackOptions ) => new Apple( options );

    const handleFraction = ( plate: Plate<Apple>, fraction: Fraction ) => {

      // Make sure all of the apples are whole before setting the fraction value on the top apple.
      plate.snacksOnPlateInNotepad.forEach( apple => {
        apple.fractionProperty.value = Fraction.ONE;
      } );
      if ( fraction.numerator > 0 ) {
        const topSnack = plate.getTopSnack();
        assert && assert( topSnack, 'there should be a top snack available to set the fraction value' );
        topSnack!.fractionProperty.value = fraction;
      }
    };

    super( createApple, SnackStacker.getStackedApplePosition, handleFraction, options );
    this.notepadModeProperty = new EnumerationProperty( NotepadMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'notepadModeProperty' ),
      phetioFeatured: true
    } );

    this.appleCollection = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'appleCollection' )
    } );

    this.appleCollection.addItemAddedListener( apple => {
      const index = this.appleCollection.indexOf( apple );

      // TODO: We probably don't need to animate all the time...https://github.com/phetsims/mean-share-and-balance/issues/140
      apple.isActiveProperty.value = true;
      apple.moveTo( this.getCollectionPosition( index ), true );
    } );

    // Initialize the plates and set up plate-related behavior that is specific to the Leveling Out screen.
    this.plates.forEach( plate => {

      plate.isActiveProperty.link( isActive => {
        if ( !isActive ) {
          plate.tableSnackNumberProperty.set( 0 );
        }
        else {
          plate.tableSnackNumberProperty.value = plate.startingNumberOfSnacks;
        }
      } );

      plate.snacksOnPlateInNotepad.addItemAddedListener( apple => {
        this.addSnackAddedListener( apple, plate );
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
        while ( this.appleCollection.length > 0 ) {
          this.getActivePlates().forEach( plate => {

            _.times( plate.tableSnackNumberProperty.value, () => {
              const apple = this.appleCollection.pop();
              assert && assert( apple, 'there should be enough apples to put on the plates' );
              plate.addSnackToTop( apple!, true );
            } );
          } );
        }
        assert && assert( this.appleCollection.length === 0, 'All apples should be on plates.' );

        // Check plate state after all apples in collection have been handled.
        this.getActivePlates().forEach( plate => this.confirmPlateValues( plate ) );
      }
      else if ( previousNotepadMode === NotepadMode.SYNC && notepadMode === NotepadMode.COLLECT ) {

        // Move all apples from their current, synced up locations to the collection area.
        this.plates.forEach( plate => {
          while ( plate.getNumberOfNotepadSnacks() > 0 ) {
            const apple = plate.getTopSnackForTransfer();

            assert && assert( apple, 'there should be enough apples to transfer to the collection' );
            this.appleCollection.push( apple! );
          }
        } );
      }
      else if ( previousNotepadMode === NotepadMode.COLLECT && notepadMode === NotepadMode.SHARE ) {
        const numberOfWholeApplesPerActivePlate = Math.floor( this.meanProperty.value );
        const activePlates = this.getActivePlates();
        const applesAtTop: Apple[] = [];
        this.appleCollection.forEach( ( apple, i ) => {

          // Move the whole apples to the appropriate plates.
          if ( i < numberOfWholeApplesPerActivePlate * activePlates.length ) {
            const plate = activePlates[ i % activePlates.length ];
            plate.addSnackToTop( apple, true );
          }
          else {

            // The remaining apples are moved to the top of the notepad.
            applesAtTop.push( apple );
            apple.moveTo( new Vector2(
                ( applesAtTop.length - 1 ) * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
                -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y )
              ),
              true );
          }
        } );

        this.appleCollection.length = 0;

        // Any apples that were moved to the top are subsequently turned into fractional representations and
        // distributed to the plates.
        if ( applesAtTop.length > 0 ) {

          // Add the number of additional apples needed for fractionalization and distribution.
          const numberOfAdditionalApplesNeeded = this.numberOfPlatesProperty.value -
                                                 applesAtTop.length;

          _.times( numberOfAdditionalApplesNeeded, i => {
            const appleToAdd = this.getUnusedSnack();
            assert && assert( appleToAdd, 'there should be unused apples available to add' );
            applesAtTop.push( appleToAdd! );
          } );

          // Distribute the fractionalized apples to the plates.
          applesAtTop.forEach( ( apple, i ) => {
            apple.animateToPosition = true;
            this.plates[ i ].addSnackToTop( apple, true );
          } );
          applesAtTop.length = 0;
        }
      }
      else if ( previousNotepadMode === NotepadMode.SHARE && notepadMode === NotepadMode.COLLECT ) {

        // Make sure all apples are whole.
        this.getAllSnacks().forEach( snack => {
          snack.fractionProperty.value = Fraction.ONE;
        } );

        // Animate the movement of the apples from the individual plates to the collection area.
        this.getActivePlates().forEach( plate => {
          _.times( plate.getNumberOfNotepadSnacks(), () => {
            if ( this.appleCollection.length < this.totalSnacksProperty.value ) {

              const apple = plate.getTopSnackForTransfer();
              assert && assert( apple, 'there should be enough apples to transfer to the collection' );

              this.appleCollection.push( apple! );
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
        // no animation needed for this mode change.
        this.getActivePlates().forEach( plate => plate.syncNotepadToTable() );
      }
      else if ( previousNotepadMode === NotepadMode.SYNC && notepadMode === NotepadMode.SHARE ) {

        // In the Share mode the total number of apples is split up evenly over all active plates, so each one ends up
        // with the mean value, which could include a fractional part. There is no animation for this transition.
        this.getActivePlates().forEach( plate => {
          plate.setNotepadSnacksToValue( new Fraction( this.totalSnacksProperty.value, this.numberOfPlatesProperty.value ) );
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
        this.plates.forEach( plate => {
          if ( plate.isActiveProperty.value ) {
            plate.setNotepadSnacksToValue( new Fraction( totalSnacks, this.numberOfPlatesProperty.value ) );
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
            this.appleCollection.push( appleToAdd! );
          } );
        }
        else if ( delta < 0 ) {

          // Remove apples from the collection.
          _.times( Math.abs( delta ), () => {
            const appleToRemove = this.appleCollection.pop();
            assert && assert( appleToRemove, 'there should be enough apples in the collection to support this' );
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

    // Update the view when the number of active apples or plates changes.
    Multilink.multilinkAny( [
        this.totalSnacksProperty,
        ...this.plates.map( plate => plate.isActiveProperty ) ],
      () => {
        handleNumberOfSnacksChanged( this.totalSnacksProperty.value );
      } );
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
    this.getAllSnacks().forEach( snack => snack.forceAnimationToFinish() );
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

  private confirmPlateValues( plate: Plate<Apple> ): void {
    if ( this.notepadModeProperty.value === NotepadMode.SYNC ) {
      assert && assert( plate.snacksOnPlateInNotepad.length === plate.tableSnackNumberProperty.value,
        'the number of snacks on the plate should match the table snack number' );
    }
    else if ( this.notepadModeProperty.value === NotepadMode.COLLECT ) {
      assert && assert( plate.snacksOnPlateInNotepad.length === 0 && this.appleCollection.length === this.totalSnacksProperty.value,
        'the plate should have no snacks and the collection should have all of the snacks' );
    }
    else if ( this.notepadModeProperty.value === NotepadMode.SHARE ) {
      const numberOfWholeApplesPerActivePlate = Math.floor( this.totalSnacksProperty.value / this.numberOfPlatesProperty.value );
      const wholeApples = plate.getSnackStack().filter( snack => {
        return snack.fractionProperty.value.equals( Fraction.ONE );
      } );
      assert && assert( wholeApples.length === numberOfWholeApplesPerActivePlate,
        `each plate should have the correct number of whole apples. Desired: ${numberOfWholeApplesPerActivePlate}, Actual: ${wholeApples.length}` );

      const fractionValue = new Fraction( this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
        this.numberOfPlatesProperty.value );

      // We do not want to use the function plate.getTopSnack() here because it will not include our animating snack
      // as a possible value.
      const topSnack = plate.snacksOnPlateInNotepad[ plate.snacksOnPlateInNotepad.length - 1 ];
      assert && assert( !Number.isInteger( this.meanProperty.value ) &&
      topSnack.fractionProperty.value.equals( fractionValue ), 'the top snack should be a fraction' );
    }
  }

  /**
   * Update the positions for all apples in the collection.  It only makes sense to use this when in or going into the
   * Collect mode.
   */
  private updateCollectedApplePositions( animate = false ): void {
    this.appleCollection.forEach( ( apple, i ) => apple.moveTo( this.getCollectionPosition( i ), animate ) );
  }

  private addSnackAddedListener( apple: Apple, plate: Plate<Apple> ): void {
    const index = plate.snacksOnPlateInNotepad.indexOf( apple );

    // assert && assert( this.notepadModeProperty.value !== NotepadMode.COLLECT,
    //   'apples should not be added to plates in collect mode' );
    // const notepadMode = this.notepadModeProperty.hasDeferredValue ? this.notepadModeProperty.deferredValue : this.notepadModeProperty.value;
    if ( this.notepadModeProperty.value === NotepadMode.SHARE ) {

      // Calculate the fractional amount that will be set for the apples being distributed to the plates.
      const numberOfWholeApples = Math.floor( this.meanProperty.value );
      const fractionValue = new Fraction( this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
        this.numberOfPlatesProperty.value );

      if ( index < numberOfWholeApples || !apple.animateToPosition ) {
        apple.isActiveProperty.value = true;
        apple.fractionProperty.value = index < numberOfWholeApples ? Fraction.ONE : fractionValue;
        apple.moveTo( plate.getPositionForStackedItem( index ), apple.animateToPosition );
      }
      else if ( apple.animateToPosition ) {

        // This timer represents the second phase of the collect => share animation. The whole apples that were moved to
        // the top of the screen are turned into fractions and animate to their final positions on the plates.
        this.collectToShareAnimationTimerListener = stepTimer.setTimeout( () => {

          // Verify the state is consistent.
          assert && assert( !Number.isInteger( this.meanProperty.value ) && plate.hasSnack( apple ),
            'invalid state: there must be apples available for fractionalization if the mean value is not an integer.'
          );

          if ( index < numberOfWholeApples ) {
            apple.fractionProperty.value = Fraction.ONE;
          }
          else {
            apple.moveTo( new Vector2(
              ( index - numberOfWholeApples ) * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
              -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y ) ) );
            apple.fractionProperty.value = fractionValue;
          }
          apple.isActiveProperty.value = true;
          apple.moveTo( plate.getPositionForStackedItem( index ), true );

          apple.travelAnimationProperty.value?.finishEmitter.addListener( () => {
            this.confirmPlateValues( plate );
          } );

          this.collectToShareAnimationTimerListener = null;
        }, APPLE_FRACTION_DISTRIBUTION_DELAY * 1000 );
      }
    }
    else if ( this.notepadModeProperty.value === NotepadMode.SYNC ) {
      apple.isActiveProperty.value = true;
      apple.fractionProperty.value = Fraction.ONE;
      apple.moveTo( plate.getPositionForStackedItem( index ) );
    }

    // TODO: Add assertion to make sure end state matches expectations. https://github.com/phetsims/mean-share-and-balance/issues/140
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