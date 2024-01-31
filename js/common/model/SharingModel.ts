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

type SelfOptions = EmptySelfOptions;
export type SharingModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;


export default class SharingModel implements TModel {

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;

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
  }

  /**
   * Restore initial state.
   */
  public reset(): void {
    this.numberOfPlatesProperty.reset();
  }
}

meanShareAndBalance.register( 'SharingModel', SharingModel );