// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the valve that opens and closes a pipe.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';


export default class TableNode extends Node {

  public constructor( providedOptions: StrictOmit<NodeOptions, 'children'> ) {

    const tableCorners = [ new Vector2( 0, 0 ), new Vector2( 725, 0 ), new Vector2( 770, 45 ), new Vector2( -45, 45 ) ];
    const tableTopShape = new Shape().polygon( tableCorners );

    const tableTop = new Path( tableTopShape, { fill: 'saddleBrown', stroke: 'black' } );
    const tableLegBL = new Rectangle( -30, 40, 15, 120, { fill: 'saddleBrown', stroke: 'black' } );
    const tableLegBR = new Rectangle( 740, 40, 15, 120, { fill: 'saddleBrown', stroke: 'black' } );
    const tableLegTL = new Rectangle( 5, 5, 15, 120, { fill: 'saddleBrown', stroke: 'black' } );
    const tableLegTR = new Rectangle( 705, 5, 15, 120, { fill: 'saddleBrown', stroke: 'black' } );

    const options = combineOptions<NodeOptions>( { children: [ tableLegBL, tableLegBR, tableLegTL, tableLegTR, tableTop ] }, providedOptions );
    super( options );
  }
}

meanShareAndBalance.register( 'TableNode', TableNode );