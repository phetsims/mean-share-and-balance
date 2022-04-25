// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { VBox, Text, Node } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import PredictMeanNode from './PredictMeanNode.js';
import merge from '../../../../phet-core/js/merge.js';
import PipeNode from './PipeNode.js';
import PipeModel from '../model/PipeModel.js';
import WaterCup3DNode from './WaterCup3DNode.js';
import WaterCup3DModel from '../model/WaterCup3DModel.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  private readonly waterCupMap: Map<WaterCup2DModel, WaterCup2DNode>;
  private readonly pipeMap: Map<PipeModel, PipeNode>
  // This also includes the pipes that connect the cups
  private readonly waterCup2DLayerNode = new Node();
  // This also includes the draggable triangle for water level
  private readonly waterCup3DLayerNode = new Node();
  private readonly cupsAreaCenterX: number;
  private readonly predictMeanLine: PredictMeanNode;
  readonly model: LevelingOutModel;
  readonly modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 250 ), 100 );
  readonly modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 500 ), 100 );

  constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    this.model = model;
    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups );

    const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, merge( {
      tandem: options.tandem.createTandem( 'questionBar' )
    }, { labelText: meanShareAndBalanceStrings.levelingOutQuestion, barFill: '#2496D6' } ) );

    //Checkbox Group
    const levelingOutOptionsCheckboxGroupTandem = options.tandem.createTandem( 'levelingOutOptionsCheckboxGroup' );
    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [
        {
          node: predictMeanText,
          property: model.isShowingPredictMeanProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' )
        },
        {
          node: showMeanText,
          property: model.isShowingMeanProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'showMeanCheckbox' )
        },
        {
          node: tickMarksText,
          property: model.isShowingTickMarksProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' )
        } ],
      {
        right: this.layoutBounds.right - 100,
        top: questionBar.boundsProperty.value.maxY + 20
      }
    );

    const numberOfCupsNumberPicker = new NumberPicker(
      model.numberOfCupsProperty,
      new Property( model.levelingOutRange ), {
        tandem: options.tandem.createTandem( 'numberOfCupsNumberPicker' ),
        yMargin: 10,
        xMargin: 10,
        arrowHeight: 10
      }
    );

    const levelingOutNumberPickerVBox = new VBox( {
      children: [
        numberOfCupsText,
        numberOfCupsNumberPicker
      ],
      align: 'center',
      right: 900,
      bottom: this.layoutBounds.bottom
    } );

    //Predict Mean Line
    this.predictMeanLine = new PredictMeanNode( model, this.modelViewTransform2DCups, {
        visibleProperty: model.isShowingPredictMeanProperty,
        tandem: options.tandem.createTandem( 'predictMeanLine' )
      }
    );

    // 2D water cup nodes addition and removal
    this.cupsAreaCenterX = this.layoutBounds.centerX - levelingOutOptionsCheckboxGroup.width;

    this.waterCupMap = new Map<WaterCup2DModel, WaterCup2DNode>();
    model.waterCups.forEach( waterCup => {
      this.addWaterCupNode( waterCup );
    } );

    model.waterCups.addItemAddedListener( waterCupModel => {
      this.addWaterCupNode( waterCupModel );
    } );

    model.waterCups.addItemRemovedListener( waterCupModel => {
      const waterCupNode = this.waterCupMap.get( waterCupModel )!;
      this.waterCup2DLayerNode.removeChild( waterCupNode );
      this.waterCup2DLayerNode.centerX = this.cupsAreaCenterX;
      this.predictMeanLine.x = this.waterCup2DLayerNode.x;
      this.waterCupMap.delete( waterCupModel );
    } );

    // Pipe nodes addition and removal
    this.pipeMap = new Map<PipeModel, PipeNode>();
    model.pipes.addItemAddedListener( pipe => {
      const pipeNode = new PipeNode( pipe, this.modelViewTransform2DCups );
      this.pipeMap.set( pipe, pipeNode );
      this.waterCup2DLayerNode.addChild( pipeNode );
    } );

    model.pipes.addItemRemovedListener( pipe => {
      const pipeNode = this.pipeMap.get( pipe )!;
      this.waterCup2DLayerNode.removeChild( pipeNode );
      this.pipeMap.delete( pipe );
    } );

    // 3D water cups
    const waterCup3DNode = new WaterCup3DNode( new WaterCup3DModel(), this.modelViewTransform3DCups );
    this.waterCup3DLayerNode.addChild( waterCup3DNode );
    this.waterCup3DLayerNode.centerX = this.cupsAreaCenterX;

    this.addChild( questionBar );
    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    this.addChild( this.waterCup2DLayerNode );
    this.addChild( this.waterCup3DLayerNode );
    this.addChild( this.predictMeanLine );
  }

  private addWaterCupNode( cupModel: WaterCup2DModel ): void {
    const waterCupNode = new WaterCup2DNode( cupModel, this.modelViewTransform2DCups, this.model.meanProperty,
      this.model.isShowingTickMarksProperty, this.model.isShowingMeanProperty );
    this.waterCupMap.set( cupModel, waterCupNode );
    this.waterCup2DLayerNode.addChild( waterCupNode );
    this.waterCup2DLayerNode.centerX = this.cupsAreaCenterX;
    this.predictMeanLine.x = this.waterCup2DLayerNode.x;
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );