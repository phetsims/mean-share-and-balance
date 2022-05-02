// Copyright 2022, University of Colorado Boulder

/**
 * Parent class for all water cups
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import WaterCup2DModel from './WaterCup2DModel.js';
import WaterCup3DModel from './WaterCup3DModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  x: number;
};
export type WaterCupModelOptions = SelfOptions;

export default class WaterCupModel {
  readonly xProperty: NumberProperty;
  readonly waterLevelProperty: NumberProperty;
  readonly waterCup2DChild: WaterCup2DModel;
  readonly waterCup3DChild: WaterCup3DModel;

  constructor( providedOptions?: WaterCupModelOptions ) {
    const options = optionize<WaterCupModelOptions, SelfOptions>()( {
      x: 0
    }, providedOptions );

    this.xProperty = new NumberProperty( options.x );
    this.waterLevelProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 )
    } );

    this.waterCup2DChild = new WaterCup2DModel( this.waterLevelProperty, this.xProperty );
    this.waterCup3DChild = new WaterCup3DModel( this.waterLevelProperty, this.xProperty );
  }
}