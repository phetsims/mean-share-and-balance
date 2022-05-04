// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 3D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from './WaterCupModel.js';
import Range from '../../../../dot/js/Range.js';

export default class WaterCup3DModel {
  readonly parent: WaterCupModel
  readonly y = 400;
  readonly waterLevelProperty: NumberProperty;

  constructor( parent: WaterCupModel ) {
    this.parent = parent;
    this.waterLevelProperty = new NumberProperty( parent.waterLevelProperty.value, {
      range: new Range( 0, 1 )
    } );
  }
}

meanShareAndBalance.register( 'WaterCup3DModel', WaterCup3DModel );