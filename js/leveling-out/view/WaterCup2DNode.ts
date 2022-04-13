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
import TickMarksNode from './TickMarksNode.js';

class WaterCup2DNode extends Node {

  readonly cupHeight: number;
  readonly tickMarks: TickMarksNode;

  constructor( model: WaterCup2DModel ) {

    super();
    this.cupHeight = 100;
    const cupWidth = 50;
    //0 is empty, 1 is full
    const y = Utils.linear( 0, 1, model.y + this.cupHeight, model.y, model.waterLevelProperty.value );
    this.tickMarks = new TickMarksNode( this, model );

    const waterCupRectangle = new Rectangle( model.xProperty.value, model.y, cupWidth, this.cupHeight, { stroke: 'black' } );
    const waterLevelRectangle = new Rectangle( model.xProperty.value, y, cupWidth, this.cupHeight * model.waterLevelProperty.value, { fill: '#51CEF4' } );

    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
    this.addChild( this.tickMarks );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );
export default WaterCup2DNode;