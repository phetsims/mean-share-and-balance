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
import WaterCupModel from '../model/WaterCupModel.js';
import PredictMeanNode from './PredictMeanNode.js';
import merge from '../../../../phet-core/js/merge.js';
import PipeNode from './PipeNode.js';
import PipeModel from '../model/PipeModel.js';
import WaterCup3DNode from './WaterCup3DNode.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  readonly pipeMap: Map<PipeModel, PipeNode>;

  constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 250 ), 100 );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 500 ), 100 );
    //TODO text adjustment to work with query param stringTest=long
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
      new Property( model.numberOfCupsRange ), {
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
        tandem: options.tandem.createTandem( 'predictMeanLine' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.',
        valueProperty: model.meanPredictionProperty,
        enabledRangeProperty: new Property( model.dragRange )
      }
    );

    // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
    const waterCupLayerNode = new Node();

    // 2D/3D water cup nodes addition and removal
    const waterCup2DNodeGroup = new PhetioGroup<WaterCup2DNode, [ WaterCupModel ]>( ( tandem: Tandem, waterCup2DModel: WaterCupModel ) => {
      return new WaterCup2DNode( waterCup2DModel, modelViewTransform2DCups,
        model.meanProperty,
        model.isShowingTickMarksProperty,
        model.isShowingMeanProperty, { tandem: tandem } );
    }, () => [ model.waterCup2DGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup2DNodeGroup' ),
      supportsDynamicState: false
    } );

    const waterCup3DNodeGroup = new PhetioGroup<WaterCup3DNode, [ WaterCupModel ]>( ( tandem: Tandem, waterCup3DModel: WaterCupModel ) => {
      return new WaterCup3DNode( waterCup3DModel, modelViewTransform3DCups, { tandem: tandem } );
    }, () => [ model.waterCup3DGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup3DNodeGroup' ),
      supportsDynamicState: false
    } );

    // Center 2D & 3D cups
    const checkboxGroupWidthOffset = ( levelingOutOptionsCheckboxGroup.width + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const cupsAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;
    const centerWaterCupLayerNode = () => {
      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanLine.x = waterCupLayerNode.x;
    };

    // Connect nodes to view
    const waterCup2DMap = new Map<WaterCupModel, WaterCup2DNode>();
    const waterCup3DMap = new Map<WaterCupModel, WaterCup3DNode>();

    // callback functions to add and remove water cups
    function createAddWaterCupListener<U extends Node>( map: Map<WaterCupModel, U>, nodeGroup: PhetioGroup<U, [ WaterCupModel ]> ) {
      return ( cupModel: WaterCupModel ) => {
        const cupNode = nodeGroup.createCorrespondingGroupElement( cupModel.tandem.name, cupModel );
        waterCupLayerNode.addChild( cupNode );
        map.set( cupModel, cupNode );
        centerWaterCupLayerNode();
      };
    }

    function createRemoveWaterCupListener<U extends Node>( phetioGroup: PhetioGroup<U, [ WaterCupModel ]>, map: Map<WaterCupModel, U> ) {
      return ( cupModel: WaterCupModel ) => {
        const cupNode = map.get( cupModel )!;
        waterCupLayerNode.removeChild( cupNode );
        centerWaterCupLayerNode();
        map.delete( cupModel );
        phetioGroup.disposeElement( cupNode );
      };
    }

    // add initial starting cups
    model.waterCup2DGroup.forEach( createAddWaterCupListener( waterCup2DMap, waterCup2DNodeGroup ) );
    model.waterCup3DGroup.forEach( createAddWaterCupListener( waterCup3DMap, waterCup3DNodeGroup ) );

    // add and remove cups according to model groups.
    model.waterCup2DGroup.elementCreatedEmitter.addListener( createAddWaterCupListener( waterCup2DMap, waterCup2DNodeGroup ) );
    model.waterCup3DGroup.elementCreatedEmitter.addListener( createAddWaterCupListener( waterCup3DMap, waterCup3DNodeGroup ) );
    model.waterCup2DGroup.elementDisposedEmitter.addListener( createRemoveWaterCupListener( waterCup2DNodeGroup, waterCup2DMap ) );
    model.waterCup3DGroup.elementDisposedEmitter.addListener( createRemoveWaterCupListener( waterCup3DNodeGroup, waterCup3DMap ) );

    // Pipe nodes addition and removal
    this.pipeMap = new Map<PipeModel, PipeNode>();

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
      this.pipeMap.set( pipeModel, pipeNode );
    };

    const removePipeNode = ( pipeModel: PipeModel ) => {
      const pipeNode = this.pipeMap.get( pipeModel )!;
      waterCupLayerNode.removeChild( pipeNode );
      pipeNodeGroup.disposeElement( pipeNode );
      this.pipeMap.delete( pipeModel );
    };

    model.pipeGroup.elementCreatedEmitter.addListener( createPipeNode );
    model.pipeGroup.elementDisposedEmitter.addListener( removePipeNode );

    this.addChild( questionBar );
    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    this.addChild( waterCupLayerNode );
    this.addChild( predictMeanLine );

    this.pdomPlayAreaNode.pdomOrder = [
      levelingOutOptionsCheckboxGroup,
      predictMeanLine,
      levelingOutNumberPickerVBox,
      waterCupLayerNode

    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];
  }

  override step( dt: number ): void {
    for ( const pipe of this.pipeMap.values() ) {
      pipe.step( dt );
    }
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );