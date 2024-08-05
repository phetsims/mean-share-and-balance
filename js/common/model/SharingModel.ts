// Copyright 2024, University of Colorado Boulder

/**
 * Base class for models where sharing - meaning redistribution of things like snacks between plates - is done.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
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
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';

type SelfOptions = {

  // Controls the initial number of snacks on each plate.
  initialPlateValues: number[];
  snackTandemPrefix: string;
};
export type SharingModelOptions = SelfOptions & PhetioObjectOptions;

// constants
const MAX_PLATES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;
const INTER_PLATE_DISTANCE = 100; // distance between plate centers, in screen coords
const NUMBER_OF_PLATES_RANGE = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS );

export default class SharingModel<T extends Snack> extends PhetioObject implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;
  public readonly totalSnacksProperty: TReadOnlyProperty<number>;
  public readonly plates: Plate<T>[];
  public readonly meanInfoPanelVisibleProperty: Property<boolean>;
  public readonly totalVisibleProperty: Property<boolean>;
  public readonly meanValueProperty: TReadOnlyProperty<number>;

  // Tracks whether all active notepad plates are in sync with their ground truth (table) values.
  public readonly activePlatesInSyncProperty: TReadOnlyProperty<boolean>;

  // A state flag used to control whether the motion of snacks is animated or instantaneous.  This is helpful for
  // preventing animations during phet-io state setting.
  public animateAddedSnacks = false;

  // This ObservableArray is used to keep track of snacks that are not in use and are thus available to be moved to a
  // plate or elsewhere. These are generally inactive and not visible in the view. Adding a snack to this array will
  // cause it to be deactivated.
  protected readonly unusedSnacks: ObservableArray<T>;

  // Allows PhET-iO clients to modify the max number of plates in the screen.
  private readonly maxPlatesProperty: Property<number>;

  protected readonly initialPlateValuesProperty: Property<number[]>;

  /**
   *
   * @param snackCreator - A function that creates a new snack based on the specific needs of each model.
   * @param snackStackingFunction - A function that determines how snacks should stack on a plate.
   * @param handleFraction - A function that determines how to handle fractional values for plates.
   * @param providedOptions
   */
  public constructor( snackCreator: ( options: SnackOptions ) => T,
                      snackStackingFunction: ( plateXPosition: number, index: number ) => Vector2,
                      handleFraction: ( plate: Plate<T>, fraction: Fraction ) => void,
                      providedOptions: SharingModelOptions ) {

    const options = optionize<SharingModelOptions, SelfOptions, PhetioObjectOptions>()( {
      isDisposable: false,
      phetioType: SharingModel.SharingModelIO,
      phetioState: false,
      phetioDocumentation: 'The model for the Distribute and Fair Share screens, which includes tablePlates and notepadPlates.'
    }, providedOptions );

    super( options );

    // Create Properties
    this.numberOfPlatesRangeProperty = new Property<Range>( NUMBER_OF_PLATES_RANGE );
    this.maxPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      numberType: 'Integer',
      range: NUMBER_OF_PLATES_RANGE,

      // phet-io
      phetioFeatured: true,
      phetioDocumentation: 'The maximum number of plates that can be displayed in the simulation. The simulation will reset when the number of max plates is changed.',
      tandem: options.tandem.createTandem( 'maxPlatesProperty' )
    } );
    this.numberOfPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPlatesRangeProperty,

      // phet-io
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'numberOfPlatesProperty' )
    } );
    this.meanInfoPanelVisibleProperty = new BooleanProperty( false, {
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'meanInfoPanelVisibleProperty' )
    } );
    this.totalVisibleProperty = new BooleanProperty( false, {
      phetioFeatured: true,
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
    let totalSnackCount = 0;
    _.times( totalNumberOfSnacks, () => {

      const snack = snackCreator( {

        // phet-io
        tandem: snacksParentTandem.createTandem( `${options.snackTandemPrefix}${totalSnackCount++}` )
      } );

      this.unusedSnacks.push( snack );
    } );

    // Create the set of plates that will hold the snacks.
    assert && assert( options.initialPlateValues.length === MAX_PLATES, 'initialPlateValues must have the same length as the number of plates' );
    this.initialPlateValuesProperty = new Property( options.initialPlateValues, {
      phetioValueType: ArrayIO( NumberIO ),
      isValidValue: ( snackValues: number[] ) =>
        snackValues.length === MAX_PLATES &&
        snackValues.every(
          value => value >= MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE &&
        value <= MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE ),
      tandem: options.tandem.createTandem( 'initialPlateValuesProperty' ),
      phetioDocumentation: `Set the initial snack value of each plate. The array length should be equal to ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS} (the default max number of plates).` +
                           `The values should be between ${MeanShareAndBalanceConstants.MIN_NUMBER_OF_SNACKS_PER_PLATE} and ${MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE}.` +
                           `The default initial values are: ${options.initialPlateValues}.`,
      phetioFeatured: true
    } );
    this.plates = [];
    const platesParentTandem = options.tandem.createTandem( 'plates' );
    _.times( MAX_PLATES, plateIndex => {
      const initialXPosition = plateIndex * INTER_PLATE_DISTANCE;
      const plate = new Plate(
        this.getUnusedSnack.bind( this ),
        this.releaseSnack.bind( this ),
        this.initialPlateValuesProperty,
        {
          initialXPosition: initialXPosition,
          initiallyActive: plateIndex < this.numberOfPlatesProperty.value,
          linePlacement: plateIndex,
          handleFraction: handleFraction,
          snackStackingFunction: snackStackingFunction,

          // phet-io
          tandem: platesParentTandem.createTandem( `plate${plateIndex + 1}` )
        }
      );
      this.plates.push( plate );
    } );
    const activePlateDependencies = this.plates.map( plate => plate.isActiveProperty );
    const plateSyncDependencies = this.plates.map( plate => plate.snacksInSyncProperty );
    this.activePlatesInSyncProperty = DerivedProperty.deriveAny( [ ...activePlateDependencies, ...plateSyncDependencies ],
      () => {
        return this.plates.every( plate => plate.isActiveProperty.value ? plate.snacksInSyncProperty.value : true );
      } );

    // Tracks the total number of snacks based on the "ground truth" numbers for each plate.
    this.totalSnacksProperty = DerivedProperty.deriveAny(
      this.plates.map( plate => plate.tableSnackNumberProperty ),
      () => {
        const snackAmounts = this.plates.map( plate => plate.tableSnackNumberProperty.value );
        return _.sum( snackAmounts );
      },
      {
        phetioFeatured: true,
        tandem: options.tandem.createTandem( 'totalSnacksProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Calculates the mean based on the "ground-truth" snacks on the table.
    this.meanValueProperty = new DerivedProperty(
      [ this.totalSnacksProperty, this.numberOfPlatesProperty ],
      ( totalSnacks, numberOfPlates ) => totalSnacks / numberOfPlates, {
        phetioFeatured: true,
        tandem: options.tandem.createTandem( 'meanValueProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Monitor the number of active plates and update the plate positions to keep them centered.
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
    let currentPlate = null;
    this.plates.forEach( plate => {
      if ( plate.hasSnack( snack ) ) {
        currentPlate = plate;
      }
    } );
    return currentPlate;
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

    // We cannot count on being in a "synced" state in phet-io state setting situations. Therefore, we will rely
    // on the state handling of each plate's ObservableArrays to determine how snacks should be distributed.
    if ( !isSettingPhetioStateProperty.value ) {
      this.syncData();

      // Release all snack from plates by setting their table snack number to 0.  This puts the snacks back onto the
      // unused list so that when the plates are reset, they can grab the ones they need the same way they did during
      // construction of the model.
      this.plates.forEach( plate => { plate.tableSnackNumberProperty.value = 0; } );

      // Reset the active plates, whereupon they will grab and position snacks to match their initial table snack number.
      this.getActivePlates().forEach( plate => plate.reset() );
    }

    // The maximum number of plates should still be respected after reset.
    const max = this.maxPlatesProperty.value;
    this.numberOfPlatesProperty.value = Math.min( this.numberOfPlatesProperty.value, max );
    this.numberOfPlatesRangeProperty.value = new Range( NUMBER_OF_PLATES_RANGE.min, max );
  }

  /**
   * Restore initial state of the sim including visual Properties and data.
   */
  public reset(): void {
    this.meanInfoPanelVisibleProperty.reset();
    this.totalVisibleProperty.reset();
    this.resetData();
  }

  /**
   * For use by PhET-iO clients to set the number of snacks on each plate for the scene model.
   * @param plateValues
   */
  private setPlateValues( plateValues: number[] ): void {
    // Validate data points
    // If a client passes through an empty array of data points, ignore and return early.
    if ( plateValues.length === 0 ) {
      return;
    }
    else if ( plateValues.length > this.maxPlatesProperty.value ) {
      plateValues = plateValues.slice( 0, this.maxPlatesProperty.value );
    }
    plateValues.forEach( ( plateValue, i ) => {
      const plate = this.plates[ i ];
      const error = plate.tableSnackNumberProperty.getValidationError( plateValue );
      if ( error ) {
        throw new Error( error );
      }
    } );

    // Restore the state of the data before setting the new data points.
    this.resetData();
    this.numberOfPlatesProperty.value = plateValues.length;

    plateValues.forEach( ( plateValue, index ) => {
      this.plates[ index ].tableSnackNumberProperty.set( plateValue );
    } );
  }

  public static readonly INTER_PLATE_DISTANCE = INTER_PLATE_DISTANCE;

  private static readonly SharingModelIO = new IOType( 'SharingModelIO', {
    valueType: SharingModel,
    methods: {
      setDataPoints: {
        returnType: VoidIO,
        parameterTypes: [ ArrayIO( NumberIO ) ],
        implementation: function( this: SharingModel<Snack>, dataPoints: number[] ) {
          this.setPlateValues( dataPoints );
        },
        documentation: 'Sets the data points for the scene model. Array lengths that exceed maxPlates will ignore excess values.'
      },

      getDataPoints: {
        returnType: ArrayIO( NumberIO ),
        parameterTypes: [],
        implementation: function( this: SharingModel<Snack> ) {
          return this.getActivePlates().map( plate => plate.tableSnackNumberProperty.value );
        },
        documentation: 'Gets the data points for the scene model.'
      }
    }
  } );
}

meanShareAndBalance.register( 'SharingModel', SharingModel );