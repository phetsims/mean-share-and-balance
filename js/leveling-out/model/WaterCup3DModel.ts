// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 3D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from './WaterCupModel.js';

export default class WaterCup3DModel {
  readonly parent: WaterCupModel
  readonly y = 400;

  constructor( parent: WaterCupModel ) {
    this.parent = parent;
  }
}

meanShareAndBalance.register( 'WaterCup3DModel', WaterCup3DModel );