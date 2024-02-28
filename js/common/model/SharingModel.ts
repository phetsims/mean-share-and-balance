// Copyright 2024, University of Colorado Boulder

/**
 * Base class for models where sharing - meaning redistribution of things like snacks - is done.
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
import Snack from './Snack.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  // Controls the number of snacks on the first plate.
  numberOfSnacksOnFirstPlate?: number;
};
export type SharingModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MAX_PLATES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;

export default class SharingModel<T extends Snack> implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;
  public readonly totalSnacksProperty: TReadOnlyProperty<number>;
  public readonly plates: Array<Plate>;
  public readonly isMeanAccordionExpandedProperty: Property<boolean>;
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;
  public readonly snacks: T[];
  public readonly meanProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions: SharingModelOptions ) {

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

    this.snacks = [];

    const totalSnacksPropertyDependencies: Array<TReadOnlyProperty<unknown>> = [];

    // Create the set of plates that will hold the snacks.
    this.plates = [];
    _.times( MAX_PLATES, plateIndex => {
      const x = plateIndex * MeanShareAndBalanceConstants.TABLE_PLATE_WIDTH;
      const plate = new Plate( {
        xPosition: x,
        isActive: plateIndex < this.numberOfPlatesProperty.value,
        linePlacement: plateIndex,
        startingNumberOfSnacks: plateIndex === 0 ? options.numberOfSnacksOnFirstPlate : 1,

        // phet-io
        tandem: options.tandem.createTandem( `plate${plateIndex + 1}` )
      } );
      this.plates.push( plate );

      totalSnacksPropertyDependencies.push( plate.snackNumberProperty );
      totalSnacksPropertyDependencies.push( plate.isActiveProperty );
    } );

    // Tracks the total number of snacks based on the "ground truth" numbers for each plate. Must be deriveAny because
    // .map() does not preserve .length().
    this.totalSnacksProperty = DerivedProperty.deriveAny(
      totalSnacksPropertyDependencies,
      () => {
        const candyBarAmounts = this.getActivePlates().map( plate => plate.snackNumberProperty.value );
        return _.sum( candyBarAmounts );
      },
      {
        tandem: options.tandem.createTandem( 'totalSnacksProperty' ),
        phetioValueType: NumberIO
      }
    );

    // Calculates the mean based on the "ground-truth" candyBars on the table.
    this.meanProperty = new DerivedProperty(
      [ this.totalSnacksProperty, this.numberOfPlatesProperty ],
      ( totalSnacks, numberOfPlates ) => totalSnacks / numberOfPlates, {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioValueType: NumberIO
      }
    );

    this.numberOfPlatesProperty.link( numberOfPlates => {
      this.plates.forEach( ( tablePlate, i ) => {
        tablePlate.isActiveProperty.value = i < numberOfPlates;
      } );
    } );
  }

  public getActivePlates(): Array<Plate> {
    return this.plates.filter( plate => plate.isActiveProperty.value );
  }

  public getSnacksAssignedToPlate( plate: Plate ): Array<T> {
    return this.snacks.filter( snack => snack.parentPlateProperty.value === plate );
  }

  public getInactiveSnacksAssignedToPlate( plate: Plate ): Array<T> {
    return this.getSnacksAssignedToPlate( plate ).filter( snack => !snack.isActiveProperty.value );
  }

  /**
   * Re-stack snacks on the plate.
   */
  public reorganizeSnacks( plate: Plate ): void {
    //TODO: FairShare implementation still needed: https://github.com/phetsims/mean-share-and-balance/issues/149
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.numberOfPlatesProperty.reset();
    this.isMeanAccordionExpandedProperty.reset();
    this.meanCalculationDialogVisibleProperty.reset();
    this.plates.forEach( plate => plate.reset() );
  }

  /**
   * Propagate the ground truth values (at the bottom of the screen, on the table) to the snacks that are being shown
   * on the plates in the notepad.
   */
  public syncData(): void {
    this.plates.forEach( plate => {
      this.getSnacksAssignedToPlate( plate ).forEach( ( snack, i ) => {
        snack.isActiveProperty.value = i < plate.snackNumberProperty.value;
      } );
      if ( plate.isActiveProperty.value ) {
        this.reorganizeSnacks( plate );
      }
    } );
  }
}

meanShareAndBalance.register( 'SharingModel', SharingModel );