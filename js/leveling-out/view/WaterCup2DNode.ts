// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D water cup including dynamic water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Rectangle, Node, Line, NodeOptions } from '../../../../scenery/js/imports.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TickMarksNode from './TickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type SelfOptions = {};

type cup2DModel2DNodeOptions = SelfOptions & NodeOptions;

export default class WaterCup2DNode extends Node {
  constructor( cup2DModel: WaterCup2DModel, modelViewTransform: ModelViewTransform2, meanProperty: NumberProperty,
               isShowingTickMarksProperty: BooleanProperty, isShowingMeanProperty: BooleanProperty,
               providedOptions?: cup2DModel2DNodeOptions ) {
    const options = optionize<cup2DModel2DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: cup2DModel.xProperty.value,
      phetioDynamicElement: true
    }, providedOptions );

    super();

    const tickMarks = new TickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      {
        visibleProperty: isShowingTickMarksProperty,
        tandem: options.tandem.createTandem( 'tickMarks' )
      }
    );

    // 0 is empty, 1 is full
    const y = Utils.linear( 0, 1, MeanShareAndBalanceConstants.CUP_HEIGHT, 0, cup2DModel.waterLevelProperty.value );

    const waterCupRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT,
      { stroke: 'black' }
    );

    const waterCupBackgroundRectangle = new Rectangle( waterCupRectangle.localBounds, { fill: 'white' } );
    const waterLevelRectangle = new Rectangle( 0, y, MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * cup2DModel.waterLevelProperty.value,
      { fill: MeanShareAndBalanceColors.water2DFillColorProperty }
    );

    cup2DModel.waterLevelProperty.link( waterLevel => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    } );

    const meanInverse = 1 - meanProperty.value;

    const showMeanLine = new Line(
      0,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      {
        stroke: MeanShareAndBalanceColors.showMeanLineStrokeColorProperty,
        lineWidth: 2,
        visibleProperty: isShowingMeanProperty,
        tandem: options.tandem.createTandem( 'showMeanLine' ),
        phetioDocumentation: 'Line that shows the ground truth water level mean across all present cups.'
      } );

    meanProperty.link( mean => {
      const inverse = 1 - mean;
      showMeanLine.setY1( MeanShareAndBalanceConstants.CUP_HEIGHT * inverse );
      showMeanLine.setY2( MeanShareAndBalanceConstants.CUP_HEIGHT * inverse );
    } );

    this.addChild( waterCupBackgroundRectangle );
    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
    this.addChild( showMeanLine );
    this.addChild( tickMarks );

    this.mutate( options );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );