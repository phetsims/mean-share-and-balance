// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2D & 3D water cup models.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';

type SelfOptions = {
  x: number;
  y: number;
};
export type AbstractWaterCupModelOptions = SelfOptions & PhetioObjectOptions;

export default abstract class AbstractWaterCupModel extends PhetioObject {
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;
  readonly xProperty: NumberProperty;

  constructor( providedOptions: AbstractWaterCupModelOptions ) {
    super( providedOptions );

    this.xProperty = new NumberProperty( providedOptions.x );
    this.y = providedOptions.y;
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      range: new Range( 0, 1 )
    } );
  }
}