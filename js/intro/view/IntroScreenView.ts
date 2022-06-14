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
import { Text, Node } from '../../../../scenery/js/imports.js';
// TODO: why is this in Sun?
// REVIEW: Can you please elaborate on the question?
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import IntroModel from '../model/IntroModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCupModel from '../model/WaterCupModel.js';
import PredictMeanNode from './PredictMeanNode.js';
import PipeNode from './PipeNode.js';
import PipeModel from '../model/PipeModel.js';
import WaterCup3DNode from './WaterCup3DNode.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {

  private readonly pipeMap: Map<PipeModel, PipeNode>;

  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_2D_Y_VALUE ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_3D_Y_VALUE ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const autoShareText = new Text( meanShareAndBalanceStrings.autoShare, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    // Checkbox Group
    const introOptionsCheckboxGroupTandem = options.tandem.createTandem( 'introOptionsCheckboxGroup' );
    const introOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: predictMeanText,
        property: model.isShowingPredictMeanProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.predictMean }
      }, {
        node: showMeanText,
        property: model.isShowingMeanProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'showMeanCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.showMean }
      }, {
        node: tickMarksText,
        property: model.isShowingTickMarksProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.tickMarks }
      }, {
        node: autoShareText,
        property: model.isAutoSharingProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'autoShareCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.autoShare }
      } ], {

        checkboxOptions: {
          boxWidth: 16
        }
      }
    );

    //Number Picker
    const numberOfCupsNumberSpinner = new NumberSpinner(
      model.numberOfCupsProperty,

      // The range is constant
      new Property( model.numberOfCupsRange ), {
        arrowsPosition: 'leftRight',
        tandem: options.tandem.createTandem( 'numberOfCupsNumberPicker' ),
        accessibleName: meanShareAndBalanceStrings.numberOfCups,
        layoutOptions: {
          align: 'left'
        }
      }
    );

    //Predict Mean Line
    const predictMeanLine = new PredictMeanNode(
      model,
      modelViewTransform2DCups, {
        visibleProperty: model.isShowingPredictMeanProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        tandem: options.tandem.createTandem( 'predictMeanLine' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
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
      return new WaterCup3DNode( model, waterCup3DModel, modelViewTransform3DCups, { tandem: tandem } );
    }, () => [ model.waterCup3DGroup.archetype ], {
      phetioType: PhetioGroup.PhetioGroupIO( Node.NodeIO ),
      tandem: options.tandem.createTandem( 'waterCup3DNodeGroup' ),
      supportsDynamicState: false
    } );

    // Center 2D & 3D cups
    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
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

    // add and remove cups according to model groups
    model.waterCup2DGroup.elementCreatedEmitter.addListener( createAddWaterCupListener( waterCup2DMap, waterCup2DNodeGroup ) );
    model.waterCup3DGroup.elementCreatedEmitter.addListener( createAddWaterCupListener( waterCup3DMap, waterCup3DNodeGroup ) );
    model.waterCup2DGroup.elementDisposedEmitter.addListener( createRemoveWaterCupListener( waterCup2DNodeGroup, waterCup2DMap ) );
    model.waterCup3DGroup.elementDisposedEmitter.addListener( createRemoveWaterCupListener( waterCup3DNodeGroup, waterCup3DMap ) );

    // Pipe nodes addition and removal
    this.pipeMap = new Map<PipeModel, PipeNode>();

    const pipeNodeGroup = new PhetioGroup<PipeNode, [ PipeModel ]>( ( tandem: Tandem, pipeModel: PipeModel ) => {
      return new PipeNode( pipeModel, modelViewTransform2DCups, model.isAutoSharingProperty,
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

    // Configure layout
    this.controlsVBox.addChild( introOptionsCheckboxGroup );
    this.numberSpinnerVBox.children = [ numberOfCupsText, numberOfCupsNumberSpinner ];

    this.addChild( waterCupLayerNode );
    this.addChild( predictMeanLine );

    this.pdomPlayAreaNode.pdomOrder = [
      introOptionsCheckboxGroup,
      predictMeanLine,
      numberOfCupsNumberSpinner,
      waterCupLayerNode,
      this.syncDataButton
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];
  }

  public override step( dt: number ): void {
    for ( const pipe of this.pipeMap.values() ) {
      pipe.step( dt );
    }
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );