// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import { Node, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup3DModel from '../model/WaterCup3DModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
// import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {};
type WaterCup3DNodeOptions = SelfOptions & NodeOptions

export default class WaterCup3DNode extends Node {
  constructor( cup3DModel: WaterCup3DModel, modelViewTransform: ModelViewTransform2,
               providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      //TODO add default options
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: cup3DModel.xProperty.value,
      phetioDynamicElement: true
    }, providedOptions );
    super();

    const xRadius = 30;
    const yRadius = 12;
    const centerTop = -MeanShareAndBalanceConstants.CUP_HEIGHT / 2;
    const centerBottom = MeanShareAndBalanceConstants.CUP_HEIGHT / 2;

    // Cup structure and glare shapes
    const cupGlareShape = new Shape()
      .moveTo( -20, centerTop + 18 )
      .verticalLineTo( 50 )
      .lineTo( -15, 52 )
      .verticalLineTo( centerTop + 21 )
      .close();

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

    // Water fill and shading paths
    const waterSide = new Path( null, {
      fill: '#A5D9F2',
      pickable: false
    } );
    const waterTop = new Path( null, {
      fill: '#A5D9F2',
      pickable: false
    } );
    const waterFrontEdge = new Path( null, {
      fill: '#8EC6DD',
      pickable: false
    } );
    const waterBackEdge = new Path( null, {
      fill: '#9CD0E5',
      pickable: false
    } );
    const waterCrescent = new Path( null, {
      fill: '#B4E5F9'
    } );

    // Water cup structure and glare paths
    const cupFront = new Path( cupFrontShape, {
      stroke: 'black',
      lineWidth: 2
    } );

    const cupBack = new Path( cupBackShape, {
      stroke: 'black',
      lineWidth: 2,
      fill: '#EDF2F4'
    } );

    cupBack.setScaleMagnitude( -1, 1 );
    const cupBottom = new Path( cupBottomShape, {
      stroke: 'black',
      fill: 'white',
      pickable: false
    } );

    const cupGlare = new Path( cupGlareShape.getOffsetShape( 2 ), {
      fill: 'white',
      opacity: 0.35
    } );

    // Adjustable water level triangle
    const dragRange = new Range( -MeanShareAndBalanceConstants.CUP_HEIGHT / 2, MeanShareAndBalanceConstants.CUP_HEIGHT / 2 );

    // Pass in parent waterLevelProperty to link appropriately for 3D/2D communication
    const waterLevelTriangle = new WaterLevelTriangleNode(
      cup3DModel.waterLevelProperty,
      dragRange,
      {
        tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
        y: MeanShareAndBalanceConstants.CUP_HEIGHT / 2,
        left: xRadius
      }
    );

    // water level adjustment listener
    cup3DModel.waterLevelProperty.link( waterLevel => {
      const centerLiquidY = centerBottom - MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel;
      const waterTopShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI * 2, false )
        .close();
      const waterSideShape = new Shape()
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, yRadius, 0, 0, Math.PI, false )
        .close();
      const waterFrontEdgeShape = new Shape()
        .ellipticalArc( 0, centerLiquidY + 1, xRadius, yRadius + 2, 0, Math.PI, 0, true )
        .ellipticalArc( 0, centerLiquidY, xRadius, yRadius, 0, 0, Math.PI, false );
      const waterBackEdgeShape = new Shape()
        .ellipticalArc( 0, centerBottom - 1, xRadius, yRadius + 4, Math.PI, Math.PI, 0, true )
        .ellipticalArc( 0, centerBottom, xRadius, yRadius, Math.PI, 0, Math.PI, false );
      const waterCrescentShape = new Shape()
        .ellipticalArc( 8, centerLiquidY, yRadius * 0.75, xRadius * 0.4, Math.PI * 1.5, Math.PI, 0, true )
        .ellipticalArc( 8, centerLiquidY, yRadius * 0.75, xRadius * 0.6, Math.PI * 1.5, 0, Math.PI, false );

      waterTop.shape = waterTopShape;
      waterSide.shape = waterSideShape;
      waterFrontEdge.shape = waterFrontEdgeShape;
      waterBackEdge.shape = waterBackEdgeShape;
      waterCrescent.shape = waterCrescentShape;

    } );

    // waterFrontEdge.clipArea = this.cupClipArea( waterFrontEdge.localBounds, cupFront.localBounds );

    this.addChild( cupBack );
    this.addChild( cupBottom );
    this.addChild( waterSide );
    this.addChild( waterBackEdge );
    this.addChild( waterTop );
    this.addChild( waterCrescent );
    this.addChild( waterFrontEdge );
    this.addChild( cupFront );
    this.addChild( cupGlare );
    this.addChild( waterLevelTriangle );

    this.mutate( options );
  }

  // private cupClipArea( waterBounds: Bounds2, cupBounds: Bounds2 ): Shape {
  //   const clipAreaWater = Shape.bounds( waterBounds );
  //   const clipAreaCup = Shape.bounds( cupBounds );
  //
  //   return clipAreaWater.shapeDifference( clipAreaCup );
  // }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );