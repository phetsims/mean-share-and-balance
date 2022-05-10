// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2D & 3D water cup models.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = {
  x: number;
  y: number;
};
type AbstractWaterCupModelOptions = SelfOptions & PhetioObjectOptions;

export default abstract class AbstractWaterCupModel extends PhetioObject {
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;
  readonly xProperty: NumberProperty;

  constructor( providedOptions: AbstractWaterCupModelOptions ) {
    const options = optionize<AbstractWaterCupModelOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );
    super( options );

    this.y = options.y;
    this.xProperty = new NumberProperty( options.x );
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      range: new Range( 0, 1 )
    } );
  }
}