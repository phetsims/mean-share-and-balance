// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the table water cup including draggable water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Node, NodeOptions, NodeTransformOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Cup from '../model/Cup.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import WaterLevelTriangleSlider from './WaterLevelTriangleSlider.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BeakerNode from '../../../../scenery-phet/js/BeakerNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import LevelOutModel from '../model/LevelOutModel.js';

type SelfOptions = {

  // The cross-fade mix between the two sounds that are combined for the sound generation used for the water level. This
  // value must be between 0 and 1, inclusive.  A value of 0 indication 100% sound A, 1 indicates 100% sound be, and
  // values in between represent a proportionate mix.
  soundPlayerCrossFade?: number;
};

type TableCupNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions | 'children'>;

export default class TableCupNode extends Node {

  public constructor( tickMarksVisibleProperty: Property<boolean>,
                      model: Pick<LevelOutModel, 'changeWaterLevel'>,
                      waterCup: Cup, notepadModelViewTransform: ModelViewTransform2,
                      providedOptions?: TableCupNodeOptions ) {

    const options = optionize<TableCupNodeOptions, SelfOptions, NodeOptions>()( {
      bottom: notepadModelViewTransform.modelToViewY( 0 ),
      visibleProperty: waterCup.isActiveProperty,
      soundPlayerCrossFade: 0,
      isDisposable: false
    }, providedOptions );

    // The CUP_HEIGHT is the height of the notepad cups.  The table cups have to be adjusted accordingly because of the
    // top and bottom ellipses, so they don't seem disproportionately tall.
    const beakerHeight = MeanShareAndBalanceConstants.CUP_HEIGHT - 10;
    const beakerLineWidth = 2;
    const waterCupNode = new BeakerNode( waterCup.waterLevelProperty, {
      lineWidth: beakerLineWidth,
      beakerWidth: MeanShareAndBalanceConstants.CUP_WIDTH,
      beakerHeight: beakerHeight,
      solutionFill: MeanShareAndBalanceColors.waterFillColorProperty,
      solutionGlareFill: MeanShareAndBalanceColors.tableCupCrescentFillColorProperty,
      solutionShadowFill: MeanShareAndBalanceColors.waterShadowFillColorProperty,
      beakerGlareFill: MeanShareAndBalanceColors.tableCupGlareFillColorProperty,
      emptyBeakerFill: MeanShareAndBalanceColors.emptyTableCupColorProperty
    } );

    const showingTickMarksListener = ( showingTickMarks: boolean ) => waterCupNode.setTicksVisible( showingTickMarks );
    tickMarksVisibleProperty.link( showingTickMarksListener );

    waterCup.waterLevelProperty.link( ( waterLevel, oldWaterLevel ) => {
      model.changeWaterLevel( waterCup, waterLevel, oldWaterLevel );
    } );

    const waterLevelSlider = new WaterLevelTriangleSlider(
      waterCup.waterLevelProperty,
      waterCup.enabledRangeProperty,
      beakerHeight,
      {
        left: MeanShareAndBalanceConstants.CUP_WIDTH * MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
        top: waterCupNode.top + beakerLineWidth * 2,
        soundPlayerCrossFade: options.soundPlayerCrossFade,
        accessibleName: `Water Level Cup ${waterCup.linePlacement}`,

        // phet-io
        tandem: options.tandem.createTandem( 'waterLevelSlider' )
      }
    );

    const combinedOptions = combineOptions<NodeOptions>( { children: [ waterCupNode, waterLevelSlider ] }, options );
    super( combinedOptions );

    // Set position
    waterCup.xPositionProperty.link( xPosition => {
      this.left = notepadModelViewTransform.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'TableCupNode', TableCupNode );