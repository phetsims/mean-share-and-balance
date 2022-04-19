// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 2D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  x: number;
};
export type WaterCup2DModelOptions = SelfOptions;

class WaterCup2DModel {
  readonly xProperty: NumberProperty;
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;

  constructor( providedOptions: WaterCup2DModelOptions ) {
    const options = optionize<WaterCup2DModelOptions, SelfOptions>()( {
      x: 50
    }, providedOptions );

    this.xProperty = new NumberProperty( options.x );
    this.y = 200;
    //TODO update variables in other files
    this.waterLevelProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 )
    } );
  }
}

meanShareAndBalance.register( 'WaterCup2DModel', WaterCup2DModel );
export default WaterCup2DModel;