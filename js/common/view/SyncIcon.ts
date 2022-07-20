// Copyright 2022, University of Colorado Boulder

import { Node, Path } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';

/**
 * Draws sync icon
 * Sync icon takes the form of two curved arrows pointing at each other's tail. The curved arrows split the bottom
 * and top half of a circle and the arrows point in a counter-clockwise direction.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class SyncIcon extends Node {
  public constructor( radius: number ) {
    super();
    const bottomArrowShape = new ResetShape( radius, { startAngle: Math.PI * 0.9, endAngle: -2 * Math.PI * 0.45 } );
    const topArrowShape = new ResetShape( radius, { startAngle: Math.PI * -0.09, endAngle: -2 * Math.PI * 0.45 } );

    const bottomArrow = new Path( bottomArrowShape, { fill: 'black' } );
    const topArrow = new Path( topArrowShape, { fill: 'black' } );

    this.addChild( bottomArrow );
    this.addChild( topArrow );
  }
}
meanShareAndBalance.register( 'SyncIcon', SyncIcon );