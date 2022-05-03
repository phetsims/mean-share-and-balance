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
  private readonly waterCup2DMap: Map<WaterCup2DModel, WaterCup2DNode>;
  private readonly waterCup3DMap: Map<WaterCup3DModel, WaterCup3DNode>;
  private readonly pipeMap: Map<PipeModel, PipeNode>
  // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
  private readonly waterCupLayerNode = new Node();
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

    //Number Picker
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

    // 2D/3D water cup nodes addition and removal
    this.cupsAreaCenterX = this.layoutBounds.centerX - levelingOutOptionsCheckboxGroup.width;

    this.waterCup2DMap = new Map<WaterCup2DModel, WaterCup2DNode>();
    this.waterCup3DMap = new Map<WaterCup3DModel, WaterCup3DNode>();
    model.waterCups.forEach( waterCup => {
      this.addWaterCupNodes( waterCup.waterCup2DChild, waterCup.waterCup3DChild, options );
    } );

    model.waterCups.addItemAddedListener( waterCupModel => {
      this.addWaterCupNodes( waterCupModel.waterCup2DChild, waterCupModel.waterCup3DChild, options );
    } );

    model.waterCups.addItemRemovedListener( waterCupModel => {
      const waterCup2DNode = this.waterCup2DMap.get( waterCupModel.waterCup2DChild )!;
      const waterCup3DNode = this.waterCup3DMap.get( waterCupModel.waterCup3DChild )!;

      this.waterCupLayerNode.removeChild( waterCup2DNode );
      this.waterCupLayerNode.removeChild( waterCup3DNode );

      this.waterCupLayerNode.centerX = this.cupsAreaCenterX;
      this.predictMeanLine.x = this.waterCupLayerNode.x;

      this.waterCup2DMap.delete( waterCupModel.waterCup2DChild );
    } );

    // Pipe nodes addition and removal
    this.pipeMap = new Map<PipeModel, PipeNode>();
    model.pipes.addItemAddedListener( pipe => {
      const tandemName = `${this.model.numberOfCupsProperty.value}`;
      const pipeNode = new PipeNode( pipe, this.modelViewTransform2DCups, { tandem: options.tandem.createTandem( `${tandemName}PipeNode` ) } );
      this.pipeMap.set( pipe, pipeNode );
      this.waterCupLayerNode.addChild( pipeNode );
    } );

    model.pipes.addItemRemovedListener( pipe => {
      const pipeNode = this.pipeMap.get( pipe )!;
      this.waterCupLayerNode.removeChild( pipeNode );
      this.pipeMap.delete( pipe );
    } );

    this.addChild( questionBar );
    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    this.addChild( this.waterCupLayerNode );
    this.addChild( this.predictMeanLine );
  }

  private addWaterCupNodes( cup2DModel: WaterCup2DModel, cup3DModel: WaterCup3DModel, options: LevelingOutScreenViewOptions ): void {
    const waterCup2DNode = new WaterCup2DNode( cup2DModel, this.modelViewTransform2DCups, this.model.meanProperty,
      this.model.isShowingTickMarksProperty, this.model.isShowingMeanProperty );
    const tandemName = `${this.model.numberOfCupsProperty.value}`;
    const waterCup3DNode = new WaterCup3DNode( cup3DModel, this.modelViewTransform3DCups, { tandem: options.tandem.createTandem( `${tandemName}waterCup3DNode` ) } );

    this.waterCup2DMap.set( cup2DModel, waterCup2DNode );
    this.waterCup3DMap.set( cup3DModel, waterCup3DNode );

    this.waterCupLayerNode.addChild( waterCup2DNode );
    this.waterCupLayerNode.addChild( waterCup3DNode );

    this.waterCupLayerNode.centerX = this.cupsAreaCenterX;
    this.predictMeanLine.x = this.waterCupLayerNode.x;
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );