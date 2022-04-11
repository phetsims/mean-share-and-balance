// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D water cup including dynamic water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import { Rectangle, Node } from '../../../../scenery/js/imports.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

class WaterCup2DNode extends Node {

  constructor( model: WaterCup2DModel ) {

    super();
    const cupHeight = 100;
    const cupWidth = 50;
    //y maps the bottom and top left-hand corners of the waterLevelRectangle
    const y = Utils.linear( 0, 1, model.y + cupHeight, model.y, model.waterLevelProperty.value );

    const waterCupRectangle = new Rectangle( model.xProperty.value, model.y, cupWidth, cupHeight, { stroke: 'black' } );
    const waterLevelRectangle = new Rectangle( model.xProperty.value, y, cupWidth, cupHeight * model.waterLevelProperty.value, { fill: '#51CEF4' } );

    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );
export default WaterCup2DNode;