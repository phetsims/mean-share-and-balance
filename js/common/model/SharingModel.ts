// Copyright 2024, University of Colorado Boulder

/**
 * Base class for models where sharing - meaning redistribution of things like snacks - is done.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import TModel from '../../../../joist/js/TModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Plate from '../../leveling-out/model/Plate.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = EmptySelfOptions;
export type SharingModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

// constants
const MAX_PLATES = MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS;

export default class SharingModel implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;
  public readonly plates: Array<Plate>;
  public readonly isMeanAccordionExpandedProperty: Property<boolean>;
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  // TODO: Do we need options here, or can we just pass in a tandem?  See https://github.com/phetsims/mean-share-and-balance/issues/138.
  public constructor( options: SharingModelOptions ) {

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

    // Create the set of plates that will hold the snacks.
    this.plates = [];
    _.times( MAX_PLATES, plateIndex => {
      const x = plateIndex * MeanShareAndBalanceConstants.TABLE_PLATE_WIDTH;
      const plate = new Plate( {
        xPosition: x,
        isActive: plateIndex < this.numberOfPlatesProperty.value,
        linePlacement: plateIndex,
        startingNumberOfSnacks: plateIndex === 0 ? MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_SNACKS_ON_FIRST_PLATE : 1,

        // phet-io
        tandem: options.tandem.createTandem( `plate${plateIndex + 1}` )
      } );
      this.plates.push( plate );
    } );
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
}

meanShareAndBalance.register( 'SharingModel', SharingModel );