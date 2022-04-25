// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in 3D cups.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {};
type WaterLevelTriangleNodeOptions = SelfOptions & NodeOptions

export default class WaterLevelTriangleNode extends Node {
  constructor( waterLevelProperty: NumberProperty,
               xRadius: number, dragRange: Range,
               providedOptions?: WaterLevelTriangleNodeOptions ) {
    const options = optionize<WaterLevelTriangleNodeOptions, SelfOptions, NodeOptions>()( {
        cursor: 'pointer'
      },
      providedOptions );
    super( options );

    const sideLength = 15;

    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, -Math.sin( Math.PI / 6 ) * sideLength )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, Math.sin( Math.PI / 6 ) * sideLength )
      .close();

    const waterLevelTriangle = new Path( triangleShape, {
      fill: '#51CEF4',
      stroke: 'black'
    } );

    // set at edge of water cup
    this.x = xRadius;

    const adjustWaterLevelProperty = new Vector2Property( new Vector2( 0, waterLevelProperty.value ) );
    adjustWaterLevelProperty.link( adjustWaterLevel => {
      waterLevelProperty.set( dragRange.constrainValue( adjustWaterLevel.y ) );
    } );

    waterLevelProperty.link( waterLevel => {
      this.centerY = waterLevel;
    } );

    this.addInputListener( new DragListener( {
      positionProperty: adjustWaterLevelProperty
    } ) );

    this.addChild( waterLevelTriangle );
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleNode', WaterLevelTriangleNode );