// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 *
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
  private readonly cup3DModel: WaterCupModel;
  private readonly adapterProperty: NumberProperty;

  public constructor( introModel: IntroModel, cup3DModel: WaterCupModel, modelViewTransform: ModelViewTransform2,
               providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: cup3DModel.x,
      phetioDynamicElement: true
    }, providedOptions );
    super();

    this.cup3DModel = cup3DModel;

    // The CUP_HEIGHT is the height of the 2d cups.  The 3D cups have to be adjusted accordingly because of the top and bottom ellipses so they don't seem disproportionately tall
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - 10;

    const beakerLineWidth = 2;
    const waterCup = new BeakerNode( cup3DModel.waterLevelProperty, {
      lineWidth: beakerLineWidth,
      beakerHeight: beakerHeight,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.water3DCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.waterCup3DGlareFillColorProperty
    } );

    // adapaterProperty double-checks the constraints and deltas in the water levels between the 2D and 3D cups.
    // when the adapterProperty values change a method in the introModel compares delta between current and past value
    // ensures it's within each cup's range, and then sets the water level for each cup accordingly.
    this.adapterProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {

      // REVIEW: Is this range defined elsewhere?  Should it be factored out?
      range: new Range( 0, 1 ),

      // When the slider is changed it triggers a value change in the adapter property
      // This value then updates the 2D & 3D waterLevels which may trigger a change in the slider enabledRangeProperty
      // If the range shrinks and the adapterProperty is out of range then it will be constrained requiring a reentrant: true
      reentrant: true
    } );

    this.adapterProperty.lazyLink( ( waterLevel, oldWaterLevel ) => {
      introModel.changeWaterLevel( cup3DModel, this.adapterProperty, waterLevel, oldWaterLevel );
    } );

    cup3DModel.resetEmitter.addListener( () => this.adapterProperty.reset() );

    this.waterLevelTriangle = new WaterLevelTriangleNode( this.adapterProperty, cup3DModel.enabledRangeProperty, beakerHeight, {
      tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
      left: MeanShareAndBalanceConstants.CUP_WIDTH * MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
      top: waterCup.top + BeakerNode.DEFAULT_Y_RADIUS + beakerLineWidth / 2
    } );

    this.addChild( waterCup );
    this.addChild( this.waterLevelTriangle );

    this.mutate( options );
  }

  public override dispose(): void {
    super.dispose();
    this.waterLevelTriangle.dispose();
    this.adapterProperty.dispose();
    this.cup3DModel.resetEmitter.removeAllListeners();
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );