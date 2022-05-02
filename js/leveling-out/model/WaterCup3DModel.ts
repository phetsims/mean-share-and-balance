// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 3D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
// import Range from '../../../../dot/js/Range.js';
// import optionize from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  x: number;
};
export type WaterCup3DModelOptions = SelfOptions;

export default class WaterCup3DModel {
  readonly waterLevelProperty: NumberProperty;
  readonly xProperty: NumberProperty;
  readonly y = 400;

  constructor( waterLevelProperty: NumberProperty, xProperty: NumberProperty, providedOptions?: WaterCup3DModelOptions ) {
    // const options = optionize<WaterCup3DModelOptions, SelfOptions>()( {
    // }, providedOptions );

    this.xProperty = xProperty;
    this.waterLevelProperty = waterLevelProperty;
  }
}

meanShareAndBalance.register( 'WaterCup3DModel', WaterCup3DModel );