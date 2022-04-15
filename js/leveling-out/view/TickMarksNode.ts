// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the ticks marks on 2D water cup nodes.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Line, Node } from '../../../../scenery/js/imports.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

class TickMarksNode extends Node {

  // REVIEW: Probably better to access the WaterCup2DModel via parentNode.waterCup
  constructor( parentNode: WaterCup2DNode, parentModel: WaterCup2DModel ) {
    super();

    // REVIEW: Let's use a tickLevels array and loop

    const quarter = parentModel.y + ( parentNode.cupHeight * 0.75 );
    const half = parentModel.y + ( parentNode.cupHeight * 0.5 );
    const threeQuarters = parentModel.y + ( parentNode.cupHeight * 0.25 );

    const quarterTickMark = new Line( parentModel.xProperty.value, quarter, parentModel.xProperty.value + 5, quarter, {
      stroke: 'black',
      lineWidth: 2
    } );

    const halfTickMark = new Line( parentModel.xProperty.value, half, parentModel.xProperty.value + 5, half, {
      stroke: 'black',
      lineWidth: 2
    } );

    const threeQuartersTickMark = new Line( parentModel.xProperty.value, threeQuarters, parentModel.xProperty.value + 5, threeQuarters, {
      stroke: 'black',
      lineWidth: 2
    } );

    this.addChild( quarterTickMark );
    this.addChild( halfTickMark );
    this.addChild( threeQuartersTickMark );
  }
}

meanShareAndBalance.register( 'TickMarksNode', TickMarksNode );
export default TickMarksNode;