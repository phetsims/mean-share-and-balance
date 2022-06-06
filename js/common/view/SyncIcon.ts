// Copyright 2022, University of Colorado Boulder

import SyncShape from './SyncShape.js';
import { Path, Node } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

/**
 * Draws sync icon
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

export default class SyncIcon extends Node {
  public constructor( radius: number ) {
    super();
    const bottomArrowShape = new SyncShape( radius, 0.9 );
    const topArrowShape = new SyncShape( radius, -0.01 );

    const bottomArrow = new Path( bottomArrowShape, { fill: 'black' } );
    const topArrow = new Path( topArrowShape, { fill: 'black' } );

    this.addChild( bottomArrow );
    this.addChild( topArrow );
  }
}
meanShareAndBalance.register( 'SyncIcon', SyncIcon );