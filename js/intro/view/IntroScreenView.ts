// Copyright 2022-2024, University of Colorado Boulder
/**
 * Representation for the Intro Screen, displaying table/notepad water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { AlignBox, ManualConstraint, Node } from '../../../../scenery/js/imports.js';
import IntroModel from '../model/IntroModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadCupNode from './NotepadCupNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PredictMeanSlider from './PredictMeanSlider.js';
import PipeNode from './PipeNode.js';
import TableCupNode from './TableCupNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import IntroControls from './IntroControls.js';
import LabTableNode from '../../common/view/LabTableNode.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Shape } from '../../../../kite/js/imports.js';
import NotepadNode from '../../common/view/NotepadNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';


type LevelingOutScreenViewOptions = PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {


  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const modelViewTransformNotepadCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.NOTEPAD_CUPS_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransformTableCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.TABLE_CUPS_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    // Predict Mean Line that acts as a slider for alternative input.
    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.dragRange,
      model.numberOfCupsProperty, () => model.getActiveNotepadCups(),
      modelViewTransformNotepadCups, {
        visibleProperty: model.predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        // phet-io
        tandem: options.tandem.createTandem( 'predictMeanSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    const notepadCupsParentTandem = options.tandem.createTandem( 'notepadCups' );
    const tableCupsParentTandem = options.tandem.createTandem( 'tableCups' );
    const pipesParentTandem = options.tandem.createTandem( 'pipes' );

    // Add all cup nodes to the view
    const notepadCupNodes: Array<NotepadCupNode> = [];
    model.notepadCups.forEach( ( cupModel, index ) => {
      const cupNode = new NotepadCupNode( cupModel, model.tableCups[ index ], modelViewTransformNotepadCups, model.meanProperty, model.tickMarksVisibleProperty,
        model.meanVisibleProperty, model.cupLevelVisibleProperty, { tandem: notepadCupsParentTandem.createTandem( `notepadCupNode${cupModel.linePlacement + 1}` ) } );
      notepadCupNodes.push( cupNode );
    } );

    assert && assert( model.tableCups.length > 1, 'some of the code below assumes at least 2 cups exist' );
    const tableCupNodes: Array<TableCupNode> = [];
    model.tableCups.forEach( ( cupModel, i ) => {
      const cupNode = new TableCupNode( model.tickMarksVisibleProperty, model, cupModel, modelViewTransformTableCups, {
        soundPlayerCrossFade: i / ( model.tableCups.length - 1 ),
        tandem: tableCupsParentTandem.createTandem( `tableCupNode${cupModel.linePlacement + 1}` )
      } );
      tableCupNodes.push( cupNode );
    } );

    // Add all pipe nodes to the view.
    const pipeNodes: Array<PipeNode> = [];
    model.pipeArray.forEach( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, model.arePipesOpenProperty, modelViewTransformNotepadCups,
        { tandem: pipesParentTandem.createTandem( `pipeNode${index + 1}` ), focusable: index === 0 } );

      pipeNodes.push( pipeNode );
    } );

    // This also includes the pipes that connect the notepad cups as well as the draggable water level triangle.
    const waterCupLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...notepadCupNodes, ...tableCupNodes, ...pipeNodes ]
    } );

    const notepadNode = new NotepadNode( {
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

    const tableNode = new LabTableNode( { centerX: waterCupLayerNode.centerX } );

    const superOptions = combineOptions<MeanShareAndBalanceScreenViewOptions>( options, {
      children: [ notepadNode, tableNode, waterCupLayerNode, predictMeanSlider ]
    } );

    // Instantiate Parent
    super(
      model,
      MeanShareAndBalanceStrings.introQuestionStringProperty,
      MeanShareAndBalanceColors.introQuestionBarColorProperty,
      notepadNode,
      superOptions );

    // Controls on Right side of screen
    const controls = new IntroControls( model.tickMarksVisibleProperty, model.meanVisibleProperty, model.predictMeanVisibleProperty,
      model.cupLevelVisibleProperty, model.numberOfCupsProperty, model.arePipesOpenProperty,
      { minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25, spacing: 20, tandem: options.tandem.createTandem( 'controls' ) } );


    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    const controlsAlignBox = new AlignBox( controls, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    this.addChild( controlsAlignBox );

    notepadNode.centerX = this.playAreaCenterX;

    ManualConstraint.create( this, [ waterCupLayerNode ], waterCupLayerProxy => {
      waterCupLayerProxy.centerX = this.playAreaCenterX;
      predictMeanSlider.x = waterCupLayerProxy.x - 12.5;
      tableNode.centerX = waterCupLayerProxy.centerX - 10;

      tableNode.y = waterCupLayerProxy.bottom - 30;

      // Create a focus highlight that surrounds all the valves. Only the first valve is in the traversal
      // order and they all do the same thing so this highlight indicates that there will only be one stop in the
      // traversal order.
      const pipeBoundsShapes = pipeNodes.filter( pipe => pipe.visibleProperty.value )
        .map( pipe => Shape.bounds( pipe.globalBounds ) );

      // Focus highlight is set on the valveNode because it is what receives focus (not the PipeNode).
      pipeNodes[ 0 ].focusHighlight = Shape.union( pipeBoundsShapes )
        .transformed( pipeNodes[ 0 ].getGlobalToLocalMatrix() );
    } );

    model.numberOfCupsProperty.link( () => {
      this.interruptSubtreeInput();
    } );

    this.msabSetPDOMOrder( tableCupNodes, [ pipeNodes[ 0 ], predictMeanSlider ], controls.controlsPDOMOrder );
  }

  public override reset(): void {
    super.reset();
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );