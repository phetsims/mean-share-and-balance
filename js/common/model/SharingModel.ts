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

type SelfOptions = {

  // Controls the initial number of snacks on the first plate.
  numberOfSnacksOnFirstPlate?: number;
};
export type SharingModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MAX_PLATES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;
const INTER_PLATE_DISTANCE = 100; // distance between plate centers, in screen coords

export default class SharingModel<T extends Snack> implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;
  public readonly totalSnacksProperty: TReadOnlyProperty<number>;
  public readonly plates: Plate[];
  public readonly isMeanAccordionExpandedProperty: Property<boolean>;
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;
  public readonly meanProperty: TReadOnlyProperty<number>;

  // This ObservableArray is used to keep track of snacks that are not in use and are thus available to be moved to a
  // plate or elsewhere. These are generally inactive and not visible in the view.  Removing a snack from this array will
  // cause it to be activated, adding to the array will cause it to be deactivated.
  protected readonly unusedSnacks: ObservableArray<Snack>;

  public constructor( snackCreator: ( options: SnackOptions ) => T,
                      snackStackingFunction: ( plateXPosition: number, index: number ) => Vector2,
                      providedOptions: SharingModelOptions ) {

    const options = combineOptions<SharingModelOptions>( {
      numberOfSnacksOnFirstPlate: 3
    }, providedOptions );

    this.numberOfPlatesRangeProperty = new Property<Range>(
      new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS ),
      {

        // phet-io
        tandem: options.tandem.createTandem( 'numberOfPlatesRangeProperty' ),
        phetioValueType: Range.RangeIO
      }
    );

    this.numberOfPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPlatesRangeProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPlatesProperty' )
    } );

    this.isMeanAccordionExpandedProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'isMeanAccordionExpandedProperty' )
    } );

    this.meanCalculationDialogVisibleProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'meanCalculationDialogVisibleProperty' )
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
    this.unusedSnacks.addItemRemovedListener( snack => {
      snack.isActiveProperty.value = true;
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
          startingNumberOfSnacks: plateIndex === 0 ? options.numberOfSnacksOnFirstPlate : 1,
          snackStackingFunction: snackStackingFunction,

          // phet-io
          tandem: options.tandem.createTandem( `plate${plateIndex + 1}` )
        }
      );
      this.plates.push( plate );
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
  }

  /**
   * Get an unused snack, meaning one that isn't on a plate.  Invoking this method removes the returned snack from the
   * list of those available, so it must be tracked and added back when the client no longer needs it.
   */
  public getUnusedSnack(): T | null {
    return this.unusedSnacks.pop() as T || null;
  }

  public getNumberOfActiveSnacksOnPlates(): number {
    return _.sumBy( this.getActivePlates(), plate => plate.getSnackStack().length );
  }

  /**
   * Release a snack, putting it back on the list of unused ones.  This is generally done when it is taken off a plate
   * and not moved to another plate.
   */
  public releaseSnack( snack: Snack ): void {
    this.unusedSnacks.push( snack );
  }

  public getActivePlates(): Plate[] {
    return this.plates.filter( plate => plate.isActiveProperty.value );
  }

  public getAllSnacks(): T[] {
    const allSnacks = this.unusedSnacks.getArrayCopy();
    this.plates.forEach( plate => {
      plate.getSnackStack().forEach( snack => allSnacks.push( snack ) );
    } );
    return allSnacks as T[];
  }

  /**
   * Get the plate on which the provided snack is currently sitting.  Returns null if the snack is not on a plate.
   */
  public getPlateForSnack( snack: Snack ): Plate | null {
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
   * Restore initial state.
   */
  public reset(): void {
    this.isMeanAccordionExpandedProperty.reset();
    this.meanCalculationDialogVisibleProperty.reset();

    this.numberOfPlatesProperty.reset();

    // Release all snack from plates by setting their table snack number to 0.  This puts the snacks back onto the
    // unused list so that when the plates are reset, they can grab the ones they need the same way they did during
    // construction of the model.
    this.plates.forEach( plate => { plate.tableSnackNumberProperty.value = 0; } );

    // Reset the active plates, whereupon they will grab and position snacks to match their initial table snack number.
    this.plates.forEach( plate => plate.isActiveProperty.value && plate.reset() );
  }
}

meanShareAndBalance.register( 'SharingModel', SharingModel );