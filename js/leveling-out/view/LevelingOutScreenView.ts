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
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import WaterCupModel from '../model/WaterCupModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 250 ), 100 );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 500 ), 100 );
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
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' ),
          options: { accessibleName: meanShareAndBalanceStrings.predictMean }
        },
        {
          node: showMeanText,
          property: model.isShowingMeanProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'showMeanCheckbox' ),
          options: { accessibleName: meanShareAndBalanceStrings.showMean }
        },
        {
          node: tickMarksText,
          property: model.isShowingTickMarksProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' ),
          options: { accessibleName: meanShareAndBalanceStrings.tickMarks }
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
        arrowHeight: 10,
        accessibleName: meanShareAndBalanceStrings.numberOfCups
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
    const predictMeanLine = new PredictMeanNode(
      model,
      modelViewTransform2DCups,
      {
        visibleProperty: model.isShowingPredictMeanProperty,
        tandem: options.tandem.createTandem( 'predictMeanLine' )
      }
    );

    // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
    const waterCupLayerNode = new Node();

    // 2D/3D water cup nodes addition and removal
    const waterCup2DNodeGroup = new PhetioGroup<WaterCup2DNode, [ WaterCup2DModel ]>( ( tandem: Tandem, waterCup2DModel: WaterCup2DModel ) => {
      return new WaterCup2DNode( waterCup2DModel, modelViewTransform2DCups,
        model.meanProperty,
        model.isShowingTickMarksProperty,
        model.isShowingMeanProperty, { tandem: tandem } );
    }, [ new WaterCup2DModel( new WaterCupModel() ) ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup2DNodeGroup' ),
      supportsDynamicState: false
    } );

    const waterCup3DNodeGroup = new PhetioGroup<WaterCup3DNode, [ WaterCup3DModel ]>( ( tandem: Tandem, waterCup3DModel: WaterCup3DModel ) => {
      return new WaterCup3DNode( waterCup3DModel, modelViewTransform3DCups, { tandem: tandem } );
    }, [ new WaterCup3DModel( new WaterCupModel() ) ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup3DNodeGroup' ),
      supportsDynamicState: false
    } );

    // Dynamically center cups
    const cupsAreaCenterX = this.layoutBounds.centerX - levelingOutOptionsCheckboxGroup.width;

    // Connect nodes to view
    const waterCup2DMap = new Map<WaterCup2DModel, WaterCup2DNode>();
    const waterCup3DMap = new Map<WaterCup3DModel, WaterCup3DNode>();

    const createWaterCup2DNode = ( waterCup2DModel: WaterCup2DModel ) => {
      const waterCup2DNode = waterCup2DNodeGroup.createCorrespondingGroupElement( 'waterCup2DNode', waterCup2DModel );
      waterCupLayerNode.addChild( waterCup2DNode );
      return waterCup2DNode;
    };
    const createWaterCup3DNode = ( waterCup3DModel: WaterCup3DModel ) => {
      const waterCup3DNode = waterCup3DNodeGroup.createCorrespondingGroupElement( 'waterCup3DNode', waterCup3DModel );
      waterCupLayerNode.addChild( waterCup3DNode );
      return waterCup3DNode;
    };

    const addWaterCupNodes = ( waterCupModel: WaterCupModel ) => {
      const waterCup2DNode = createWaterCup2DNode( waterCupModel.waterCup2DChild );
      const waterCup3DNode = createWaterCup3DNode( waterCupModel.waterCup3DChild );

      waterCup2DMap.set( waterCupModel.waterCup2DChild, waterCup2DNode );
      waterCup3DMap.set( waterCupModel.waterCup3DChild, waterCup3DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanLine.x = waterCupLayerNode.x;
    };

    // add initial starting cups
    model.waterCupGroup.forEach( waterCup => {
      addWaterCupNodes( waterCup );
    } );

    model.waterCupGroup.elementCreatedEmitter.addListener( waterCup => {
      addWaterCupNodes( waterCup );
    } );

    model.waterCupGroup.elementDisposedEmitter.addListener( waterCupModel => {
      const waterCup2DNode = waterCup2DMap.get( waterCupModel.waterCup2DChild )!;
      const waterCup3DNode = waterCup3DMap.get( waterCupModel.waterCup3DChild )!;

      waterCupLayerNode.removeChild( waterCup2DNode );
      waterCupLayerNode.removeChild( waterCup3DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanLine.x = waterCupLayerNode.x;

      waterCup2DMap.delete( waterCupModel.waterCup2DChild );
      waterCup3DMap.delete( waterCupModel.waterCup3DChild );
    } );

    // Pipe nodes addition and removal
    const pipeMap = new Map<PipeModel, PipeNode>();

    const pipeNodeGroup = new PhetioGroup<PipeNode, [ PipeModel ]>( ( tandem: Tandem, pipeModel: PipeModel ) => {
      return new PipeNode( pipeModel, modelViewTransform2DCups,
        { tandem: tandem } );
    }, () => [ model.pipeGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'pipeNodeGroup' ),
      supportsDynamicState: false
    } );

    const createPipeNode = ( pipeModel: PipeModel ) => {
      const pipeNode = pipeNodeGroup.createCorrespondingGroupElement( 'pipeNode', pipeModel );
      waterCupLayerNode.addChild( pipeNode );
      return pipeNode;
    };

    model.pipeGroup.elementCreatedEmitter.addListener( pipe => {
      const pipeNode = createPipeNode( pipe );
      pipeMap.set( pipe, pipeNode );
    } );

    model.pipeGroup.elementDisposedEmitter.addListener( pipe => {
      const pipeNode = pipeMap.get( pipe )!;
      waterCupLayerNode.removeChild( pipeNode );
      pipeMap.delete( pipe );
    } );

    this.addChild( questionBar );
    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    this.addChild( waterCupLayerNode );
    this.addChild( predictMeanLine );
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );