// Copyright 2022, University of Colorado Boulder

/**
 * Base class for Pipe Node
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

class PipeModel {

  readonly isOpenProperty: BooleanProperty;
  readonly xProperty: NumberProperty;
  readonly y: number;

  constructor( xProperty: NumberProperty, y: number ) {
    this.isOpenProperty = new BooleanProperty( false );
    this.xProperty = xProperty;
    this.y = y;
  }
}

export default PipeModel;