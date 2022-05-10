// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the ticks marks on 2D water cup nodes.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {};
type TickMarksNodeOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

// Should tick marks be common code?
export default class TickMarksNode extends Node {

  constructor( cupHeight: number, providedOptions: TickMarksNodeOptions ) {
    super( providedOptions );

    const tickLevels = [ 0.25, 0.5, 0.75 ];
    tickLevels.forEach( tickLevel => {
      const fraction = cupHeight * tickLevel;

      this.addTickMark( fraction );
    } );
  }

  //creates and adds tick mark to node
  addTickMark( fraction: number ): void {
    const tickMark = new Line( 0, fraction, 5, fraction, {
      stroke: 'black',
      lineWidth: 2
    } );
    this.addChild( tickMark );
  }
}

meanShareAndBalance.register( 'TickMarksNode', TickMarksNode );