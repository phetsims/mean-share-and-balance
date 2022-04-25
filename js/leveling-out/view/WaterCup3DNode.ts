// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { LinearGradient, Node, Path } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup3DModel from '../model/WaterCup3DModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';

export default class WaterCup3DNode extends Node {
  constructor( cup3DModel: WaterCup3DModel, modelViewTransform: ModelViewTransform2 ) {
    super();

    const cupHeight = 100;
    const xRadius = 40;
    const yRadius = 12;
    const centerTop = -cupHeight / 2;
    const centerBottom = cupHeight / 2;
    const centerLiquidY = centerBottom - cupHeight * cup3DModel.waterLevelProperty.value;

    const cupGradient = new LinearGradient( -xRadius, 0, xRadius, 0 )
      .addColorStop( 0, 'white' )
      .addColorStop( 0.666, 'grey' )
      .addColorStop( 0.782, 'grey' )
      .addColorStop( 1, 'white' );

    // const cupFrontShape = new Shape()
    //   .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
    //   .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, true )
    //   .close();

    const cupBackShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, true )
      .close();
    const cupBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, 2 * Math.PI, false );
    const waterTopShape = new Shape()
      .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI * 2, false )
      .close();
    const waterSideShape = new Shape()
      .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, Math.PI, 0, true )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
      .close();

    // const cupFront = new Path( cupFrontShape, {
    //   stroke: 'grey',
    //   fill: cupGradient
    // } );
    const cupBack = new Path( cupBackShape, {
      stroke: 'grey',
      fill: cupGradient
    } );
    cupBack.setScaleMagnitude( -1, 1 );
    const cupBottom = new Path( cupBottomShape, {
      stroke: 'grey',
      fill: 'white',
      pickable: false
    } );
    const waterSide = new Path( waterSideShape, {
      stroke: 'black',
      fill: '#51CEF4',
      pickable: false
    } );
    const waterTop = new Path( waterTopShape, {
      fill: '#51CEF4',
      pickable: false
    } );

    const waterLevelTriangle = new WaterLevelTriangleNode( cup3DModel.waterLevelProperty.value, modelViewTransform );

    this.y = cup3DModel.y;

    this.addChild( cupBack );
    this.addChild( cupBottom );
    this.addChild( waterSide );
    this.addChild( waterTop );
    // this.addChild( cupFront );
    this.addChild( waterLevelTriangle );
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );