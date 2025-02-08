// Copyright 2022-2025, University of Colorado Boulder

/**
 * Sync icon takes the form of two side-by-side straight arrows, one pointing down and the other pointing up.
 * Arrows are a wireframe style with rounded caps and joins.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LineArrowNode, { LineArrowNodeOptions } from '../../../../scenery-phet/js/LineArrowNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

const ARROW_LENGTH = 30;
const ARROW_SPACING = 15;

export default class SyncIcon extends Node {
  public constructor() {
    const arrowOptions: LineArrowNodeOptions = {
      headLineWidth: 5,
      tailLineWidth: 5,
      headWidth: 12.9,
      headHeight: 6.88,
      lineJoin: 'round',
      lineCap: 'round'
    };
    const downArrow = new LineArrowNode( 0, 0, 0, ARROW_LENGTH, arrowOptions );
    const upArrow = new LineArrowNode( ARROW_SPACING, ARROW_LENGTH, ARROW_SPACING, 0, arrowOptions );

    super( { children: [ downArrow, upArrow ], scale: 0.5, isDisposable: false } );
  }
}
meanShareAndBalance.register( 'SyncIcon', SyncIcon );