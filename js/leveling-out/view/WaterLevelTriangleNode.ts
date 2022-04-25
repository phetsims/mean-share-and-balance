// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in 3D cups.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, Path } from '../../../../scenery/js/imports.js';

export default class WaterLevelTriangleNode extends Node {
  constructor( waterLevel: number, modelViewTransform: ModelViewTransform2 ) {
    super();

    const sideLength = 10;

    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, -Math.sin( Math.PI / 6 ) * sideLength )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, Math.sin( Math.PI / 6 ) * sideLength )
      .close();

    const waterLevelTriangle = new Path( triangleShape, {
      fill: 'green',
      stroke: 'black'
    } );

    this.addChild( waterLevelTriangle );
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleNode', WaterLevelTriangleNode );