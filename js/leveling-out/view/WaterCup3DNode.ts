// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { LinearGradient, Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup3DModel from '../model/WaterCup3DModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};
type WaterCup3DNodeOptions = SelfOptions & NodeOptions

export default class WaterCup3DNode extends Node {
  constructor( cup3DModel: WaterCup3DModel, modelViewTransform: ModelViewTransform2,
               providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      //TODO add default options
    }, providedOptions );
    super();

    const cupHeight = 100;
    const xRadius = 30;
    const yRadius = 12;
    const centerTop = -cupHeight / 2;
    const centerBottom = cupHeight / 2;


    const cupGradient = new LinearGradient( -xRadius, 0, xRadius, 0 )
      .addColorStop( 0, 'white' )
      .addColorStop( 0.666, 'grey' )
      .addColorStop( 0.782, 'grey' )
      .addColorStop( 1, 'white' );

    const cupFrontShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, true )
      .close();

    const cupBackShape = new Shape()
      .ellipticalArc( 0, centerTop, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, true )
      .close();
    const cupBottomShape = new Shape()
      .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, 2 * Math.PI, false );

    const waterSide = new Path( null, {
      stroke: 'black',
      fill: '#51CEF4',
      pickable: false
    } );
    const waterTop = new Path( null, {
      fill: '#51CEF4',
      pickable: false
    } );

    cup3DModel.waterLevelProperty.link( waterLevel => {
      const centerLiquidY = centerBottom - cupHeight * waterLevel;
      const waterTopShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI * 2, false )
        .close();
      const waterSideShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
        .close();

      waterTop.shape = waterTopShape;
      waterSide.shape = waterSideShape;
    } );

    const cupFront = new Path( cupFrontShape, {
      stroke: 'grey',
      fill: cupGradient,
      opacity: 0.5
    } );
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

    // Adjustable water level triangle
    const dragRange = new Range( -cupHeight / 2, cupHeight / 2 );

    const waterLevelTriangle = new WaterLevelTriangleNode(
      cup3DModel.waterLevelProperty,
      dragRange,
      { tandem: options.tandem, y: cupHeight / 2, left: xRadius }
    );

    // this.y = cup3DModel.y;
    this.y = modelViewTransform.modelToViewY( 0 ) - cupHeight;

    this.addChild( cupBack );
    this.addChild( cupBottom );
    this.addChild( waterSide );
    this.addChild( waterTop );
    this.addChild( cupFront );
    this.addChild( waterLevelTriangle );
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );