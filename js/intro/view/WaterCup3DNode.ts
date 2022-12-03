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
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import IntroModel from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

type WaterCup3DNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions | 'children'>;

export default class WaterCup3DNode extends Node {

  public constructor( tickMarksVisibleProperty: Property<boolean>,
                      model: Pick<IntroModel, 'changeWaterLevel'>,
                      waterCup: WaterCup, modelViewTransform: ModelViewTransform2,
                      providedOptions?: WaterCup3DNodeOptions ) {

    const options = optionize<WaterCup3DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCup.position.x,
      visibleProperty: waterCup.isActiveProperty
    }, providedOptions );

    // The CUP_HEIGHT is the height of the 2d cups.  The 3D cups have to be adjusted accordingly because of the top and bottom ellipses,
    // so they don't seem disproportionately tall
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - 10;

    const beakerLineWidth = 2;
    const waterCupNode = new BeakerNode( waterCup.waterLevelProperty, {
      lineWidth: beakerLineWidth,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      beakerHeight: beakerHeight,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.water3DCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.waterCup3DGlareFillColorProperty,
      emptyBeakerFill: MeanShareAndBalanceColors.emptyWaterCup3DColorProperty
    } );

    const isShowingTickMarksListener = ( isShowingTickMarks: boolean ) => waterCupNode.setTicksVisible( isShowingTickMarks );

    tickMarksVisibleProperty.link( isShowingTickMarksListener );

    waterCup.waterLevelProperty.lazyLink( ( waterLevel, oldWaterlevel ) => {
      model.changeWaterLevel( waterCup, waterLevel, oldWaterlevel );
    } );

    const waterLevelTriangle = new WaterLevelTriangleSlider( waterCup.waterLevelProperty, waterCup.enabledRangeProperty, beakerHeight, {
      left: MeanShareAndBalanceConstants.CUP_WIDTH * MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
      top: waterCupNode.top + beakerLineWidth * 2,

      // phet-io
      tandem: options.tandem.createTandem( 'waterLevelSlider' )
    } );

    const combinedOptions = combineOptions<NodeOptions>( { children: [ waterCupNode, waterLevelTriangle ] }, options );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'WaterCup3DNode', WaterCup3DNode );