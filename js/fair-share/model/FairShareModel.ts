// Copyright 2024-2025, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen.  This models a variable number of plates on a table and another set of plates on a
 * notepad where the distribution of apples on the notepad plates can be distributed evenly ("Share" mode), collected
 * together ("Collect" mode), or synchronized with the amounts on each of the table plates ("Sync" mode).
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import createObservableArray, { ObservableArray, ObservableArrayIO } from '../../../../axon/js/createObservableArray.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import { TimerListener } from '../../../../axon/js/Timer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../../common/model/Plate.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import { SnackOptions } from '../../common/model/Snack.js';
import SnackStacker from '../../common/SnackStacker.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import Apple from './Apple.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;
export type ApplesAnimationState = 'split' | 'land';

// constants
const APPLES_PER_COLLECTION_GROUP = 10;
const VERTICAL_SPACE_BETWEEN_APPLES_COLLECTION = 4; // in screen coords, empirically determined
const HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION = 5; // in screen coords, empirically determined
const INTER_STACKED_GROUP_SPACING = 20;
const COLLECTION_BOTTOM_Y = 10; // in screen coords, empirically determined
const APPLE_FRACTION_DISTRIBUTION_DELAY = 0.75; // in seconds
const INITIAL_PLATE_VALUES = [ 2, 1, 6, 2, 10, 5, 8 ];
const PLATE_MIN_X_POSITION = -SharingModel.INTER_PLATE_DISTANCE *
                             MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS / 2;
const SORT_REFERENCE_POINT = new Vector2( PLATE_MIN_X_POSITION, 0 );

// Size of the collection area, empirically determined. Could be derived from other constants, but didn't seem worth it.
const COLLECTION_AREA_SIZE = new Dimension2( 410, 120 );

// Enumeration that defines the states that the notepad can be in.
export class DistributionMode extends EnumerationValue {

  // The plates on the notepad are in sync with those on the table, meaning they contain the same number of apples.
  public static readonly SYNC = new DistributionMode( MeanShareAndBalanceStrings.syncStringProperty );

  // The snacks are collected into a single collection area that doesn't involve the plates.
  public static readonly COLLECT = new DistributionMode( MeanShareAndBalanceStrings.collectStringProperty );

  // The total amount of snacks on the table are shared evenly between the plates in the notepad.
  public static readonly SHARE = new DistributionMode( MeanShareAndBalanceStrings.shareStringProperty );

  // Gets a list of keys, values and mapping between them.  For use in EnumerationProperty and PhET-iO.
  public static readonly enumeration = new Enumeration( DistributionMode, {
    phetioDocumentation: 'Describes the way in which the information in the notepad is displayed.'
  } );

  public constructor( public readonly stringProperty: TReadOnlyProperty<string> ) {
    super();
  }
}

export default class FairShareModel extends SharingModel<Apple> {

  // An enumeration property that controls the way in which the quantity of snacks on the table are displayed on the
  // notepad.  See the enumeration for more information about the possible modes.
  public readonly appleDistributionModeProperty: EnumerationProperty<DistributionMode>;

  // A timer listener for the 2nd phase of the animation that distributes apples from the collection area to the plates
  // when there are fractional apples involved (Share mode).
  private readonly fractionDistributionListenerMap = new Map<Apple, TimerListener>();

  // The array where the apples reside when they are in the collection, since they can't be on plates.
  private appleCollection: ObservableArray<Apple>;

  public readonly applesAnimationStateEmitter = new Emitter<[ ApplesAnimationState ]>( {
    parameters: [ { valueType: 'string' } ]
  } );

  public constructor( providedOptions: FairShareModelOptions ) {

    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {
      initialPlateValues: INITIAL_PLATE_VALUES,
      snackTandemPrefix: 'apple'
    }, providedOptions );

    const createApple = ( options: SnackOptions ) => new Apple( options );

    // Set the top apple on a plate to the provided fraction value.  If that value is 1, it will be set to a whole
    // value. All other apples will be set to 1 (whole).
    const handleFraction = ( plate: Plate<Apple>, fraction: Fraction ) => {

      assert && assert( fraction.value > 0 && fraction.value <= 1, 'invalid fraction value for this handler' );

      // Make sure all apples are whole before setting the fraction value on the top apple.
      plate.snacksOnNotepadPlate.forEach( apple => {
        apple.fractionProperty.value = Fraction.ONE;
      } );

      const topSnack = plate.getTopSnack();
      assert && assert( topSnack, 'there should be a top snack available to set the fraction value' );
      topSnack!.fractionProperty.value = fraction;
    };

    super( createApple, SnackStacker.getStackedApplePosition, handleFraction, options );

    this.appleDistributionModeProperty = new EnumerationProperty( DistributionMode.SYNC, {
      tandem: providedOptions.tandem.createTandem( 'appleDistributionModeProperty' ),
      phetioFeatured: true
    } );

    this.appleCollection = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'appleCollection' )
    } );

    this.appleCollection.addItemAddedListener( apple => {
      apple.isActiveProperty.value = true;
      apple.fractionProperty.value = Fraction.ONE;
      apple.moveTo( this.getCollectionPosition( this.appleCollection.indexOf( apple ) ), this.animateAddedSnacks );
    } );

    // Set up plate-related behavior that is specific to the Fair Share screen.
    this.plates.forEach( plate => {
      plate.isActiveProperty.link( isActive => {
        if ( !isActive ) {
          plate.tableSnackNumberProperty.set( 0 );
        }
        else {
          plate.tableSnackNumberProperty.value = plate.startingNumberOfSnacksProperty.value;
        }
      } );

      plate.snacksOnNotepadPlate.addItemAddedListener( apple => {
        this.snackAddedToPlateListener( apple, plate );
      } );
    } );

    // Hook up the handler for changes to the notepad mode.
    this.appleDistributionModeProperty.link( this.handleModeChange.bind( this ) );

    // Hook up the handler for changes to the number of apples that are on the table.
    Multilink.multilinkAny(
      [
        this.totalSnacksProperty,
        ...this.plates.map( plate => plate.isActiveProperty )
      ],
      this.handleNumberOfSnacksChanged.bind( this )
    );
  }

  /**
   * Handle a change in the mode setting for the notepad.  This is a complex process that moves apples around between
   * plates and the collection area, and some of this motion is animated.
   * @param appleDistributionMode
   * @param previousDistributionMode
   */
  private handleModeChange( appleDistributionMode: DistributionMode, previousDistributionMode: DistributionMode | null ): void {

    // Make sure any leftover animations from previous mode changes are cleared.
    this.finishInProgressAnimations();

    // Make sure animation is initially turned off. It will be set below for the state transitions that need it.
    this.animateAddedSnacks = false;

    // So that we're in a consistent state, make sure all apples are whole.
    this.allSnacks.forEach( ( apple: Apple ) => { apple.fractionProperty.value = Fraction.ONE; } );

    // Handle each of the six possible start transitions.
    if ( previousDistributionMode === DistributionMode.COLLECT && appleDistributionMode === DistributionMode.SYNC ) {
      this.animateAddedSnacks = true;

      // Move each of the apples in the collection area to a notepad plate based on how many are on the associated
      // table plate.
      while ( this.appleCollection.length > 0 ) {
        this.getActivePlates().forEach( plate => {

          _.times( plate.tableSnackNumberProperty.value, () => {

            // Get an apple from the collection.  The `shift` method is used here because it leads to better apple
            // movement (shorter distances to travel) versus `pop`.
            const apple = this.appleCollection.shift();

            assert && assert( apple, 'there should be enough apples to put on the plates' );
            plate.addSnackToTop( apple! );
          } );
        } );
      }
      assert && assert( this.appleCollection.length === 0, 'All apples should be on plates.' );

      // Check plate state after all apples in collection have been handled.
      this.getActivePlates().forEach( plate => this.confirmPlateValues( plate ) );
    }
    else if ( previousDistributionMode === DistributionMode.SYNC && appleDistributionMode === DistributionMode.COLLECT ) {
      this.animateAddedSnacks = true;

      // Move all apples from their current, synced up locations to the collection area.
      this.plates.forEach( plate => {
        while ( plate.getNumberOfNotepadSnacks() > 0 ) {
          const apple = plate.getTopSnackForTransfer();

          assert && assert( apple, 'there should be enough apples to transfer to the collection' );
          this.appleCollection.push( apple! );
        }
      } );
    }
    else if ( previousDistributionMode === DistributionMode.COLLECT && appleDistributionMode === DistributionMode.SHARE ) {
      this.animateAddedSnacks = true;
      const numberOfWholeApplesPerActivePlate = Math.floor( this.meanValueProperty.value );
      const applesAtTop: Apple[] = [];

      // We want to identify the index of the middle apple traveling to the top of the collection area so that
      // the apples at top are centered.
      const numberOfRemainingApples = this.appleCollection.length -
                                      ( numberOfWholeApplesPerActivePlate * this.numberOfPlatesProperty.value );
      const middleAppleIndex = Math.floor( numberOfRemainingApples / 2 );

      // Sort the apples by their distance from the left side to minimize the distance they need to travel.
      this.appleCollection.sort( ( a1, a2 ) =>
        a2.positionProperty.value.distance( SORT_REFERENCE_POINT ) -
        a1.positionProperty.value.distance( SORT_REFERENCE_POINT )
      );

      // Move the whole apples to the active plates.
      this.getActivePlates().forEach( plate => {
        while ( plate.snacksOnNotepadPlate.length < numberOfWholeApplesPerActivePlate ) {
          const apple = this.appleCollection.pop();
          assert && assert( apple, 'There should be enough apples to add the wholes ones to each plate.' );
          plate.addSnackToTop( apple! );
        }
      } );

      // The remaining apples, if any, are moved in an animation to the top of the notepad.
      this.appleCollection.forEach( apple => {
        applesAtTop.push( apple );
        apple.moveTo( new Vector2(
            ( applesAtTop.length - middleAppleIndex - 1 ) * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
            -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y )
          ),
          true
        );
      } );

      // Mark the collection as empty now that the apples have all been moved out of the collection.
      this.appleCollection.length = 0;

      // Any apples that were moved to the top are subsequently turned into fractional representations and distributed
      // to the plates.
      if ( applesAtTop.length > 0 ) {

        // Add the number of additional apples needed for fractionalization and distribution.
        const numberOfAdditionalApplesNeeded = this.numberOfPlatesProperty.value - applesAtTop.length;

        const rightmostAppleAtTop = applesAtTop.length - middleAppleIndex - 1;
        _.times( numberOfAdditionalApplesNeeded, i => {
          const appleToAdd = this.getUnusedSnack();
          assert && assert( appleToAdd, 'there should be unused apples available to add' );
          appleToAdd!.moveTo( new Vector2(
            ( rightmostAppleAtTop + i ) * ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + HORIZONTAL_SPACE_BETWEEN_APPLES_IN_COLLECTION ),
            -( COLLECTION_AREA_SIZE.height + COLLECTION_BOTTOM_Y )
          ) );
          applesAtTop.push( appleToAdd! );
        } );

        // Add the soon-to-be fractionalized apples to the plates.
        applesAtTop.forEach( ( apple, i ) => {
          this.plates[ i ].addSnackToTop( apple );
        } );
      }
    }
    else if ( previousDistributionMode === DistributionMode.SHARE && appleDistributionMode === DistributionMode.COLLECT ) {

      this.animateAddedSnacks = true;

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
    else if ( ( previousDistributionMode === DistributionMode.SHARE || previousDistributionMode === null ) &&
              appleDistributionMode === DistributionMode.SYNC ) {

      // In the Sync mode the number of apples on the notepad plates match those shown on the table plates. There is
      // no animation needed for this mode change.
      this.getActivePlates().forEach( plate => plate.syncNotepadToTable() );
    }
    else if ( previousDistributionMode === DistributionMode.SYNC && appleDistributionMode === DistributionMode.SHARE ) {

      // In the Share mode the total number of apples is split evenly over all active plates, so each plate ends up
      // with the mean value, which could include a fractional part. There is no animation for this transition.
      this.getActivePlates().forEach( plate => {
        plate.setNotepadSnacksToValue( new Fraction( this.totalSnacksProperty.value, this.numberOfPlatesProperty.value ) );
      } );
    }
    else {
      assert && assert( false, `Unhandled state transition - from ${previousDistributionMode} to ${appleDistributionMode}` );
    }

    // Clear the flag that controls whether apple motion is animated - it is set at the start of each state change.
    this.animateAddedSnacks = false;
  }

  /**
   * Handler function that is invoked when the total number of active apples changes.  This will activate and position
   * apples based on the current mode.
   */
  private handleNumberOfSnacksChanged(): void {

    // Force any in-progress animations to finish before doing anything so that the model doesn't end up in a wierd
    // state.  These animations, if present, would have been instigated by changes to the notebook mode.
    this.finishInProgressAnimations();

    // Calculate the current total number of snacks that are on the plates.  We cannot count on the totalSnacks value to
    // be accurate because it comes from a derivedProperty that may not be updated yet during phet-io state setting.
    // We also can't count on the isActiveProperty state for the plates, since they could be in transition.  Instead,
    // we are using the numberOfPlatesProperty, which drives the values of the others.  This has, thus far, been shown
    // to work.
    let actualTotalSnacks = 0;
    _.times( this.numberOfPlatesProperty.value, i => {
      actualTotalSnacks += this.plates[ i ].tableSnackNumberProperty.value;
    } );

    const distributionMode = this.appleDistributionModeProperty.value;
    if ( distributionMode === DistributionMode.SYNC ) {

      // Sync up the notepad plates with the table plates.
      this.plates.forEach( plate => {
        plate.syncNotepadToTable();
      } );
    }
    else if ( distributionMode === DistributionMode.SHARE ) {
      this.plates.forEach( plate => {
        if ( plate.isActiveProperty.value ) {
          plate.setNotepadSnacksToValue( new Fraction( actualTotalSnacks, this.numberOfPlatesProperty.value ) );
        }
        else {

          // This plate isn't active, so if it has any snacks they need to be released.
          plate.removeAllSnacks();
        }
      } );
    }
    else if ( distributionMode === DistributionMode.COLLECT ) {

      const delta = actualTotalSnacks - this.appleCollection.length;
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
      assert && assert( false, `unhandled notepad mode: ${distributionMode}` );
    }
  }

  /**
   * Finish any in-progress animations of apples moving on the notepad.  This puts the model into a stable state where
   * it is ready for changes to the notepad mode, number of snacks, number of plates, etc.  If there are no animations
   * in progress when this is called it will have no effect.
   */
  private finishInProgressAnimations(): void {

    // Invoke any timer callbacks now.  This will initiate any movement of the apples, which will then be forced to
    // finish at the end of this method.
    this.fractionDistributionListenerMap.forEach( ( listener, apple ) => {

      // All apples on a plate should be active = true unless they are in an active timer.
      stepTimer.clearTimeout( listener );
      apple.isActiveProperty.value = true;

      this.fractionDistributionListenerMap.delete( apple );
    } );

    this.allSnacks.forEach( snack => snack.forceAnimationToFinish() );
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
   * Check that the number of apples on the notepad plates is correct based on the notepad mode and the number of apples
   * on the table plates.
   */
  private confirmPlateValues( plate: Plate<Apple> ): void {
    if ( this.appleDistributionModeProperty.value === DistributionMode.SYNC ) {
      assert && assert( plate.snacksOnNotepadPlate.length === plate.tableSnackNumberProperty.value,
        'the number of snacks on the plate should match the table snack number' );
    }
    else if ( this.appleDistributionModeProperty.value === DistributionMode.COLLECT ) {
      assert && assert( plate.snacksOnNotepadPlate.length === 0 && this.appleCollection.length === this.totalSnacksProperty.value,
        'the plate should have no snacks and the collection should have all of the snacks' );
    }
    else if ( this.appleDistributionModeProperty.value === DistributionMode.SHARE ) {
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
      const topSnack = plate.snacksOnNotepadPlate[ plate.snacksOnNotepadPlate.length - 1 ];
      assert && assert( !Number.isInteger( this.meanValueProperty.value ) &&
      topSnack.fractionProperty.value.equals( fractionValue ), `the top snack should match the fraction value: ${fractionValue}` );
    }
  }

  /**
   * Update the positions for all apples in the collection.  It only makes sense to use this when in or going into the
   * "Collect" mode.
   */
  private updateCollectedApplePositions( animate = false ): void {
    this.appleCollection.forEach( ( apple, i ) => apple.moveTo( this.getCollectionPosition( i ), animate ) );
  }

  /**
   * This listener is fired when a snack is added to a plate.  It takes care of setting the state of the apple,
   * including its positionProperty, isActiveProperty, and fractionProperty, based on the current state of the model.
   */
  private snackAddedToPlateListener( apple: Apple, plate: Plate<Apple> ): void {
    const index = plate.snacksOnNotepadPlate.indexOf( apple );

    assert && assert( this.appleDistributionModeProperty.value !== DistributionMode.COLLECT,
      'apples should not be added to plates in collect mode' );

    if ( this.appleDistributionModeProperty.value === DistributionMode.SHARE ) {

      // Calculate the fractional amount that will be set for the apples being distributed to the plates.
      // Do not used derived Properties to avoid listener dependencies.
      const numberOfWholeApples = Math.floor( this.totalSnacksProperty.value / this.numberOfPlatesProperty.value );
      const fractionValue = new Fraction( this.totalSnacksProperty.value % this.numberOfPlatesProperty.value,
        this.numberOfPlatesProperty.value );

      if ( index < numberOfWholeApples || !this.animateAddedSnacks ) {
        apple.isActiveProperty.value = true;
        apple.fractionProperty.value = index < numberOfWholeApples ? Fraction.ONE : fractionValue;
        apple.moveTo( plate.getPositionForStackedItem( index ), this.animateAddedSnacks );
      }
      else if ( this.animateAddedSnacks ) {

        const isFirstApple = this.fractionDistributionListenerMap.size < 1;

        // This timer represents the second phase of the Collect => Share animation. The whole apples that were moved to
        // the top of the screen are turned into fractions and animated to their final positions on the plates.
        this.fractionDistributionListenerMap.set( apple, stepTimer.setTimeout( () => {

          // Verify the state is consistent.
          assert && assert( !Number.isInteger( this.meanValueProperty.value ) && plate.hasSnack( apple ),
            'invalid state: there must be apples available for fractionalization if the mean value is not an integer.'
          );

          // If this is the first apple to be fractionalized, fire the emitter for our "split" sound.
          isFirstApple && this.applesAnimationStateEmitter.emit( 'split' );

          apple.fractionProperty.value = fractionValue;
          apple.isActiveProperty.value = true;
          apple.moveTo( plate.getPositionForStackedItem( index ), true );

          apple.travelAnimationProperty.value?.finishEmitter.addListener( () => {
            this.confirmPlateValues( plate );

            // Once the last apple has finished animating, fire emitter for our "landing" sound.
            this.fractionDistributionListenerMap.size === 1 && this.applesAnimationStateEmitter.emit( 'land' );
            this.fractionDistributionListenerMap.delete( apple );
          } );

        }, APPLE_FRACTION_DISTRIBUTION_DELAY * 1000 ) );
      }
    }
    else if ( this.appleDistributionModeProperty.value === DistributionMode.SYNC ) {
      apple.isActiveProperty.value = true;
      apple.fractionProperty.value = Fraction.ONE;
      apple.moveTo( plate.getPositionForStackedItem( index ), this.animateAddedSnacks );
    }
  }

  protected override resetData(): void {

    // Due to the use of observable arrays for PhET-iO and snack handling, the distribution mode must be DistributionMode.SYNC
    // prior to resetting the model. The model empties and refills plate arrays to match startup values which does not
    // take into account state for the collect observable array or fractionalized snacks.
    this.appleDistributionModeProperty.reset();
    assert && assert( this.appleDistributionModeProperty.value === DistributionMode.SYNC,
      'The apple distribution mode should reset to SYNC. Any other initial value is currently not supported by the sim.' );

    this.finishInProgressAnimations();
    super.resetData();
  }

  public static readonly NOTEPAD_PLATE_CENTER_Y = 300;
  public static readonly COLLECTION_AREA_SIZE = COLLECTION_AREA_SIZE;
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );