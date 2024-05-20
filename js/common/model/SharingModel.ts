// Copyright 2024, University of Colorado Boulder

/**
 * Base class for models where sharing - meaning redistribution of things like snacks between plates - is done.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import TModel from '../../../../joist/js/TModel.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Plate from './Plate.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Snack, { SnackOptions } from './Snack.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import createObservableArray, { ObservableArray, ObservableArrayIO } from '../../../../axon/js/createObservableArray.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';

type SelfOptions = {

  // Controls the initial number of snacks on each plate.
  initialPlateValues: number[];
};
export type SharingModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MAX_PLATES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;
const INTER_PLATE_DISTANCE = 100; // distance between plate centers, in screen coords
const NUMBER_OF_PLATES_RANGE = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS );

export default class SharingModel<T extends Snack> implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;
  public readonly totalSnacksProperty: TReadOnlyProperty<number>;
  public readonly plates: Plate<T>[];
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;
  public readonly totalVisibleProperty: Property<boolean>;
  public readonly meanProperty: TReadOnlyProperty<number>;
  public readonly areAllActivePlatesInSyncProperty: TReadOnlyProperty<boolean>;
  public readonly areSnacksDistributedProperty: TReadOnlyProperty<boolean>;

  // A state flag used to control whether the motion of snacks is animated or instantaneous.  This is helpful for
  // preventing animations during phet-io state setting.
  public animateAddedSnacks = false;

  // This ObservableArray is used to keep track of snacks that are not in use and are thus available to be moved to a
  // plate or elsewhere. These are generally inactive and not visible in the view.  Removing a snack from this array will
  // cause it to be activated, adding to the array will cause it to be deactivated.
  protected readonly unusedSnacks: ObservableArray<T>;

  // Allows PhET-iO clients to modify the max number of plates in the screen.
  private readonly maxPlatesProperty: Property<number>;

  public constructor( snackCreator: ( options: SnackOptions ) => T,
                      snackStackingFunction: ( plateXPosition: number, index: number ) => Vector2,
                      handleFraction: ( plate: Plate<T>, fraction: Fraction ) => void,
                      providedOptions: SharingModelOptions ) {

    const options = combineOptions<SharingModelOptions>( {}, providedOptions );

    this.numberOfPlatesRangeProperty = new Property<Range>( NUMBER_OF_PLATES_RANGE );

    this.maxPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      numberType: 'Integer',
      range: NUMBER_OF_PLATES_RANGE,
      tandem: options.tandem.createTandem( 'maxPlatesProperty' )
    } );

    this.numberOfPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPlatesRangeProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPlatesProperty' )
    } );

    this.meanCalculationDialogVisibleProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'meanCalculationDialogVisibleProperty' )
    } );

    this.totalVisibleProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'totalVisibleProperty' )
    } );

    this.unusedSnacks = createObservableArray( {
      phetioType: ObservableArrayIO( ReferenceIO( IOType.ObjectIO ) ),
      tandem: options.tandem.createTandem( 'unusedSnacks' )
    } );

    // Automatically handle some of the state changes for snacks as they come and go from the unusedSnacks list.
    this.unusedSnacks.addItemAddedListener( snack => {
      snack.isActiveProperty.value = false;
      snack.positionProperty.value = MeanShareAndBalanceConstants.UNUSED_SNACK_POSITION;
    } );

    // parent tandem for the snacks that appear on the notepad
    const snacksParentTandem = options.tandem.createTandem( 'notepadSnacks' );

    // Create and initialize all the snacks.
    const totalNumberOfSnacks = MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE *
                                MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;
    let totalCandyBarCount = 0;
    _.times( totalNumberOfSnacks, () => {

      const snack = snackCreator( {

        // phet-io
        tandem: snacksParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
      } );

      this.unusedSnacks.push( snack );
    } );

    // Create the set of plates that will hold the snacks.
    assert && assert( options.initialPlateValues.length === MAX_PLATES, 'initialPlateValues must have the same length as the number of plates' );
    this.plates = [];
    _.times( MAX_PLATES, plateIndex => {
      const initialXPosition = plateIndex * INTER_PLATE_DISTANCE;
      const plate = new Plate(
        this.getUnusedSnack.bind( this ),
        this.releaseSnack.bind( this ),
        {
          initialXPosition: initialXPosition,
          isInitiallyActive: plateIndex < this.numberOfPlatesProperty.value,
          linePlacement: plateIndex,
          startingNumberOfSnacks: options.initialPlateValues[ plateIndex ],
          handleFraction: handleFraction,
          snackStackingFunction: snackStackingFunction,

          // phet-io
          tandem: options.tandem.createTandem( `plate${plateIndex + 1}` )
        }
      );
      this.plates.push( plate );
    } );

    const activePlateDependencies = this.plates.map( plate => plate.isActiveProperty );
    const plateSyncDependencies = this.plates.map( plate => plate.areSnacksInSyncProperty );
    this.areAllActivePlatesInSyncProperty = DerivedProperty.deriveAny( [ ...activePlateDependencies, ...plateSyncDependencies ],
      () => {
        return this.plates.every( plate => plate.isActiveProperty.value ? plate.areSnacksInSyncProperty.value : true );
      } );

    // Tracks the total number of snacks based on the "ground truth" numbers for each plate.
    this.totalSnacksProperty = DerivedProperty.deriveAny(
      this.plates.map( plate => plate.tableSnackNumberProperty ),
      () => {
        const snackAmounts = this.plates.map( plate => plate.tableSnackNumberProperty.value );
        return _.sum( snackAmounts );
      },
      {
        tandem: options.tandem.createTandem( 'totalSnacksProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Calculates the mean based on the "ground-truth" snacks on the table.
    this.meanProperty = new DerivedProperty(
      [ this.totalSnacksProperty, this.numberOfPlatesProperty ],
      ( totalSnacks, numberOfPlates ) => totalSnacks / numberOfPlates, {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Monitor the number of active plates/people and update the plate positions to keep them centered.
    this.numberOfPlatesProperty.link( numberOfPlates => {
      const totalSpan = Math.max( ( numberOfPlates - 1 ) * INTER_PLATE_DISTANCE, 0 );
      const leftPlateCenterX = -( totalSpan / 2 );
      this.getAllSnacks().forEach( snack => {
        snack.forceAnimationToFinish();
      } );
      this.plates.forEach( ( plate, i ) => {
        plate.isActiveProperty.value = i < numberOfPlates;
        plate.xPositionProperty.value = leftPlateCenterX + ( i * INTER_PLATE_DISTANCE );
      } );
    } );

    const notepadPlateSnackCountDependencies = this.plates.map( plate => plate.snacksOnNotepadPlate.lengthProperty );
    this.areSnacksDistributedProperty = DerivedProperty.deriveAny( [
        ...activePlateDependencies, ...notepadPlateSnackCountDependencies, this.meanProperty
      ],
      () => {
        const meanFloor = Math.floor( this.meanProperty.value );
        const meanCeil = Math.ceil( this.meanProperty.value );

        return _.every( this.getActivePlates(), plate =>
          plate.snacksOnNotepadPlate.length === meanFloor || plate.snacksOnNotepadPlate.length === meanCeil
        );
      } );

    this.maxPlatesProperty.lazyLink( maxNumberOfPlates => {
      this.resetData();
      this.numberOfPlatesProperty.value = Math.min( this.numberOfPlatesProperty.value, maxNumberOfPlates );
      this.numberOfPlatesRangeProperty.value = new Range( NUMBER_OF_PLATES_RANGE.min, maxNumberOfPlates );

    } );
  }

  /**
   * Get an unused snack, meaning one that isn't on a plate.  Invoking this method removes the returned snack from the
   * list of those available, so it must be tracked and added back when the client no longer needs it.
   */
  public getUnusedSnack(): T | null {
    return this.unusedSnacks.pop() || null;
  }

  /**
   * Release a snack, putting it back on the list of unused ones.  This is generally done when it is taken off a plate
   * and not moved to another plate.
   */
  public releaseSnack( snack: T ): void {
    this.unusedSnacks.push( snack );
  }

  public getActivePlates(): Plate<T>[] {
    return this.plates.filter( plate => plate.isActiveProperty.value );
  }

  public getAllSnacks(): T[] {
    const allSnacks = this.unusedSnacks.getArrayCopy();
    this.plates.forEach( plate => {
      plate.getSnackStack().forEach( snack => allSnacks.push( snack ) );
    } );
    return allSnacks;
  }

  /**
   * Get the plate on which the provided snack is currently sitting.  Returns null if the snack is not on a plate.
   */
  public getPlateForSnack( snack: T ): Plate<T> | null {
    let returnVal = null;
    for ( const plate of this.plates ) {
      if ( plate.hasSnack( snack ) ) {
        returnVal = plate;
      }
    }
    return returnVal;
  }

  /**
   * Propagate the ground truth values (at the bottom of the screen, on the table) to the snacks that are being shown
   * on the plates in the notepad.
   */
  public syncData(): void {
    this.plates.forEach( plate => { plate.syncNotepadToTable(); } );
  }

  /**
   * Resets the data in the simulation to it's initial state.
   */
  protected resetData(): void {
    this.numberOfPlatesProperty.reset();

    // Release all snack from plates by setting their table snack number to 0.  This puts the snacks back onto the
    // unused list so that when the plates are reset, they can grab the ones they need the same way they did during
    // construction of the model.
    this.plates.forEach( plate => { plate.tableSnackNumberProperty.value = 0; } );

  // Reset the active plates, whereupon they will grab and position snacks to match their initial table snack number.
  this.plates.forEach( plate => plate.isActiveProperty.value && plate.reset() );
  }

  /**
   * Restore initial state of the sim including visual Properties and data.
   */
  public reset(): void {
    this.meanCalculationDialogVisibleProperty.reset();
    this.totalVisibleProperty.reset();

    this.resetData();
  }

  public static readonly INTER_PLATE_DISTANCE = INTER_PLATE_DISTANCE;
}

meanShareAndBalance.register( 'SharingModel', SharingModel );