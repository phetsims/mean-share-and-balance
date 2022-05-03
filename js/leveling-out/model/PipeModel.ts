// Copyright 2022, University of Colorado Boulder

/**
 * Base class for Pipe Node
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from './WaterCupModel.js';

export default class PipeModel {

  readonly isOpenProperty: BooleanProperty;
  readonly xProperty: NumberProperty;
  readonly y: number;
  readonly connectedCups: Array<WaterCupModel>;

  constructor( xProperty: NumberProperty, y: number, connectedCups: Array<WaterCupModel> ) {
    this.isOpenProperty = new BooleanProperty( false );
    this.xProperty = xProperty;
    this.y = y;
    this.connectedCups = connectedCups;
  }
}

meanShareAndBalance.register( 'PipeModel', PipeModel );