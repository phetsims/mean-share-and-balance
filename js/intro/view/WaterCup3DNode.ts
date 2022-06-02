// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from '../model/WaterCupModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleNode from './WaterLevelTriangleNode.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import IntroModel from '../model/IntroModel.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type SelfOptions = {};
type WaterCup3DNodeOptions = SelfOptions & NodeOptions

export default class WaterCup3DNode extends Node {
  private readonly waterLevelTriangle: WaterLevelTriangleNode;

  constructor( introModel: IntroModel, cup3DModel: WaterCupModel, modelViewTransform: ModelViewTransform2,
               providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: cup3DModel.x,
      phetioDynamicElement: true
    }, providedOptions );
    super();

    const heightOffset = 10;
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - heightOffset;

    const waterCup = new BeakerNode( cup3DModel.waterLevelProperty, {
      lineWidth: 2,
      beakerHeight: beakerHeight,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.water3DCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.waterCup3DGlareFillColorProperty
    } );

    // TODO: Increase documentation for adapter property.
    // Synthetic property used to track water level prior to setting water level in 2D and 3D cups.
    const adapterProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      range: new Range( 0, 1 ),
      reentrant: true
    } );

    adapterProperty.lazyLink( ( waterLevel, oldWaterLevel ) => {
      introModel.changeWaterLevel( cup3DModel, adapterProperty, waterLevel, oldWaterLevel );
    } );

    cup3DModel.resetEmitter.addListener( () => adapterProperty.reset() );

    this.waterLevelTriangle = new WaterLevelTriangleNode( adapterProperty, cup3DModel.enabledRangeProperty, {
      tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
      left: MeanShareAndBalanceConstants.CUP_WIDTH / 2
    } );

    this.addChild( waterCup );
    this.addChild( this.waterLevelTriangle );

    this.waterLevelTriangle.bottom = waterCup.bottom + 5;
    this.mutate( options );
  }

  override dispose(): void {
    super.dispose();
    this.waterLevelTriangle.dispose();
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );