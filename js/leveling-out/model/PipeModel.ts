// Copyright 2022, University of Colorado Boulder

/**
 * Base class for Pipe Node
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

class PipeModel {
  readonly isOpenProperty: BooleanProperty

  constructor() {
    this.isOpenProperty = new BooleanProperty( false );
  }
}

export default PipeModel;