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
import WaterCupModel from '../model/WaterCupModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TickMarksNode from './TickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import { PropertyLinkListener } from '../../../../axon/js/IReadOnlyProperty.js';

type SelfOptions = {};

type cup2DModel2DNodeOptions = SelfOptions & NodeOptions;

export default class WaterCup2DNode extends Node {
  private readonly meanProperty: NumberProperty;
  private readonly meanLink: PropertyLinkListener<number>;
  private readonly waterLevelLink: PropertyLinkListener<number>;
  private readonly waterCupModel: WaterCupModel;
  private readonly tickMarks: TickMarksNode;

  constructor( waterCupModel: WaterCupModel, modelViewTransform: ModelViewTransform2, meanProperty: NumberProperty,
               isShowingTickMarksProperty: BooleanProperty, isShowingMeanProperty: BooleanProperty,
               providedOptions?: cup2DModel2DNodeOptions ) {
    const options = optionize<cup2DModel2DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCupModel.x,
      phetioDynamicElement: true
    }, providedOptions );

    super();

    this.waterCupModel = waterCupModel;

    this.meanProperty = meanProperty;
    this.tickMarks = new TickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      {
        visibleProperty: isShowingTickMarksProperty,
        tandem: options.tandem.createTandem( 'tickMarks' )
      }
    );

    // 0 is empty, 1 is full
    const y = Utils.linear( 0, 1, MeanShareAndBalanceConstants.CUP_HEIGHT, 0, waterCupModel.waterLevelProperty.value );

    const waterCupRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT,
      { stroke: 'black' }
    );

    const waterCupBackgroundRectangle = new Rectangle( waterCupRectangle.localBounds, { fill: 'white' } );
    const waterLevelRectangle = new Rectangle( 0, y, MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * waterCupModel.waterLevelProperty.value,
      { fill: MeanShareAndBalanceColors.waterFillColorProperty }
    );

    this.waterLevelLink = ( waterLevel: number ) => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    };
    waterCupModel.waterLevelProperty.link( this.waterLevelLink );

    const meanInverse = 1 - meanProperty.value;

    const showMeanLine = new Line(
      0,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      {
        stroke: MeanShareAndBalanceColors.showMeanLineStrokeColorProperty,
        lineWidth: 2,
        visibleProperty: isShowingMeanProperty
      } );

    this.meanLink = ( mean: number ) => {
      const inverse = 1 - mean;
      showMeanLine.setY1( MeanShareAndBalanceConstants.CUP_HEIGHT * inverse );
      showMeanLine.setY2( MeanShareAndBalanceConstants.CUP_HEIGHT * inverse );
    };

    meanProperty.link( this.meanLink );

    this.addChild( waterCupBackgroundRectangle );
    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
    this.addChild( showMeanLine );
    this.addChild( this.tickMarks );

    this.mutate( options );
  }

  override dispose(): void {
    super.dispose();
    this.meanProperty.unlink( this.meanLink );
    this.waterCupModel.waterLevelProperty.unlink( this.waterLevelLink );
    this.tickMarks.dispose();
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );