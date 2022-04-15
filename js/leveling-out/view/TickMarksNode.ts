// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the ticks marks on 2D water cup nodes.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Line, Node } from '../../../../scenery/js/imports.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

class TickMarksNode extends Node {
  readonly parentNode: WaterCup2DNode;

  constructor( parentNode: WaterCup2DNode ) {
    super();
    this.parentNode = parentNode;

    const tickLevels = [ 0.25, 0.5, 0.75 ];
    tickLevels.forEach( tickLevel => {
      const fraction = parentNode.model.y + ( parentNode.cupHeight * tickLevel );

      this.addTickMark( fraction );
    } );
  }

  //creates and adds tick mark to node
  addTickMark( fraction: number ): void {
    const tickMark = new Line( this.parentNode.model.xProperty.value, fraction, this.parentNode.model.xProperty.value + 5, fraction, {
      stroke: 'black',
      lineWidth: 2
    } );
    this.addChild( tickMark );
  }
}

meanShareAndBalance.register( 'TickMarksNode', TickMarksNode );
export default TickMarksNode;