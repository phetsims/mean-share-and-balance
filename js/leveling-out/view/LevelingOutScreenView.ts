// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the Leveling Out Screen, displaying 2D/3D water cups, pipes, and various interactive options.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 250 ), 100 );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 500 ), 100 );
    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean, { fontSize: 15 } );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean, { fontSize: 15 } );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks, { fontSize: 15 } );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups, { fontSize: 15 } );

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
        right: this.layoutBounds.right - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
        top: questionBar.boundsProperty.value.maxY + MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
      }
    );

    //Number Picker
    const numberOfCupsNumberPicker = new NumberPicker(
      model.numberOfCupsProperty,
      new Property( model.levelingOutRange ), {
        tandem: options.tandem.createTandem( 'numberOfCupsNumberPicker' ),
        color: 'black',
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
      right: this.layoutBounds.right - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.bottom - MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
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
    }, () => [ model.waterCup2DGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup2DNodeGroup' ),
      supportsDynamicState: false
    } );

    const waterCup3DNodeGroup = new PhetioGroup<WaterCup3DNode, [ WaterCup3DModel ]>( ( tandem: Tandem, waterCup3DModel: WaterCup3DModel ) => {
      return new WaterCup3DNode( waterCup3DModel, modelViewTransform3DCups, { tandem: tandem } );
    }, () => [ model.waterCup3DGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup3DNodeGroup' ),
      supportsDynamicState: false
    } );

    // Dynamically center cups
    const cupsAreaCenterX = this.layoutBounds.centerX - levelingOutOptionsCheckboxGroup.width;

    // Connect nodes to view
    const waterCup2DMap = new Map<WaterCup2DModel, WaterCup2DNode>();
    const waterCup3DMap = new Map<WaterCup3DModel, WaterCup3DNode>();

    const addWaterCup2DNode = ( waterCup2DModel: WaterCup2DModel ) => {
      const waterCup2DNode = waterCup2DNodeGroup.createCorrespondingGroupElement( waterCup2DModel.tandem.name, waterCup2DModel );
      waterCupLayerNode.addChild( waterCup2DNode );
      waterCup2DMap.set( waterCup2DModel, waterCup2DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanLine.x = waterCupLayerNode.x;

      // TODO fix predictMeanLine first cup bug
    };

    const addWaterCup3DNode = ( waterCup3DModel: WaterCup3DModel ) => {
      const waterCup3DNode = waterCup3DNodeGroup.createCorrespondingGroupElement( waterCup3DModel.tandem.name, waterCup3DModel );
      waterCupLayerNode.addChild( waterCup3DNode );
      waterCup3DMap.set( waterCup3DModel, waterCup3DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;
    };

    // add initial starting cups
    model.waterCup2DGroup.forEach( addWaterCup2DNode );
    model.waterCup3DGroup.forEach( addWaterCup3DNode );

    model.waterCup2DGroup.elementCreatedEmitter.addListener( addWaterCup2DNode );
    model.waterCup3DGroup.elementCreatedEmitter.addListener( addWaterCup3DNode );

    // TODO: Unify duplicated code
    model.waterCup2DGroup.elementDisposedEmitter.addListener( waterCup2DModel => {
      const waterCup2DNode = waterCup2DMap.get( waterCup2DModel )!;
      waterCupLayerNode.removeChild( waterCup2DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanLine.x = waterCupLayerNode.x;

      waterCup2DMap.delete( waterCup2DModel );
    } );

    model.waterCup3DGroup.elementDisposedEmitter.addListener( waterCup3DModel => {
      const waterCup3DNode = waterCup3DMap.get( waterCup3DModel )!;
      waterCupLayerNode.removeChild( waterCup3DNode );

      waterCupLayerNode.centerX = cupsAreaCenterX;

      waterCup3DMap.delete( waterCup3DModel );
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
      const pipeNode = pipeNodeGroup.createCorrespondingGroupElement( pipeModel.tandem.name, pipeModel );
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