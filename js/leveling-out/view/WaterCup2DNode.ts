// Copyright 2022, University of Colorado Boulder

//Review: Add JSDoc

import Utils from '../../../../dot/js/Utils.js';
import { Rectangle, Node } from '../../../../scenery/js/imports.js';
import WaterCup2DNodeModel from '../model/WaterCup2DNodeModel.js';

class WaterCup2DNode extends Node {

  constructor( model: WaterCup2DNodeModel ) {

    super();
    const cupHeight = 100;
    const cupWidth = 50;
    //Review: add comment describing variable
    const y = Utils.linear( 0, 1, model.y + cupHeight, model.y, model.waterLevelProperty.value );

    const waterCupRectangle = new Rectangle( model.xProperty.value, model.y, cupWidth, cupHeight, { stroke: 'black' } );
    const waterLevelRectangle = new Rectangle( model.xProperty.value, y, cupWidth, cupHeight * model.waterLevelProperty.value, { fill: '#51CEF4' } );

    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
  }
}

//Review: add namespace
export default WaterCup2DNode;