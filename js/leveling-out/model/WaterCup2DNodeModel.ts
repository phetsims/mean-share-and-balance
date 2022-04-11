// Copyright 2022, University of Colorado Boulder
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';

//Review: rename model and filename to remove Node
//Review: Add JSDoc comment to describe model

class WaterCup2DNodeModel {
  readonly xProperty: NumberProperty;
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;

  constructor() {
    this.xProperty = new NumberProperty( 50 );
    this.y = 200;
    //TODO update variables in other files
    this.waterLevelProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 )
    } );
  }
}

//Review: add namespace (check other files for register method)
export default WaterCup2DNodeModel;