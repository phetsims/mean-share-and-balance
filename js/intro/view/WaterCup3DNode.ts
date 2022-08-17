// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 3D water cup including draggable water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions, NodeTransformOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup from '../model/WaterCup.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleSlider from './WaterLevelTriangleSlider.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import IntroModel from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

type WaterCup3DNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions>;

export default class WaterCup3DNode extends Node {
  private readonly waterLevelTriangle: Node;
  private readonly waterCup: WaterCup;
  private readonly tickMarksVisibleProperty: Property<boolean>;
  private readonly isShowingTickMarksListener: ( isShowingTickMarks: boolean ) => void;

  public constructor( tickMarksVisibleProperty: Property<boolean>,
                      model: Pick<IntroModel, 'changeWaterLevel'>,
                      waterCup: WaterCup, modelViewTransform: ModelViewTransform2,
                      providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCup.position.x,
      visibleProperty: waterCup.isActiveProperty
    }, providedOptions );
    super();

    this.waterCup = waterCup;

    // The CUP_HEIGHT is the height of the 2d cups.  The 3D cups have to be adjusted accordingly because of the top and bottom ellipses,
    // so they don't seem disproportionately tall
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - 10;

    const beakerLineWidth = 2;
    const waterCupNode = new BeakerNode( waterCup.waterLevelProperty.asRanged(), {
      lineWidth: beakerLineWidth,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      beakerHeight: beakerHeight,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.water3DCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.waterCup3DGlareFillColorProperty
    } );

    this.isShowingTickMarksListener = ( isShowingTickMarks: boolean ) => waterCupNode.setTicksVisible( isShowingTickMarks );

    tickMarksVisibleProperty.link( this.isShowingTickMarksListener );

    waterCup.waterLevelProperty.lazyLink( ( waterLevel, oldWaterlevel ) => {
      model.changeWaterLevel( waterCup, waterLevel, oldWaterlevel );
    } );

    this.waterLevelTriangle = new WaterLevelTriangleSlider( waterCup.waterLevelProperty, waterCup.enabledRangeProperty, beakerHeight, {
      tandem: options.tandem.createTandem( 'waterLevelTriangle' ),
      left: MeanShareAndBalanceConstants.CUP_WIDTH * MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
      top: waterCupNode.top + waterCupNode.yRadiusOfEnds + beakerLineWidth / 2
    } );

    this.addChild( waterCupNode );
    this.addChild( this.waterLevelTriangle );
    this.mutate( options );

    this.tickMarksVisibleProperty = tickMarksVisibleProperty;
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );