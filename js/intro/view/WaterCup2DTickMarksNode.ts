// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the ticks marks on 2D water cup nodes.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type TickMarksNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>;

export default class WaterCup2DTickMarksNode extends Node {

  public constructor( cupHeight: number, providedOptions: TickMarksNodeOptions ) {
    super( providedOptions );

    const tickLevels = [ 0.25, 0.5, 0.75 ];
    tickLevels.forEach( tickLevel => {
      const fraction = cupHeight * tickLevel;

      this.addTickMark( fraction );
    } );
  }

  //creates and adds tick mark to node
  private addTickMark( fraction: number ): void {
    const tickMark = new Line( 0, fraction, 5, fraction, {
      stroke: 'black',
      lineWidth: 2
    } );
    this.addChild( tickMark );
  }
}

meanShareAndBalance.register( 'WaterCup2DTickMarksNode', WaterCup2DTickMarksNode );