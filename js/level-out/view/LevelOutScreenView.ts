// Copyright 2022-2024, University of Colorado Boulder
/**
 * Representation for the Level Out Screen, displaying table/notepad water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import LevelOutModel from '../model/LevelOutModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadCupNode from './NotepadCupNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanPredictionLine from '../../common/view/MeanPredictionLine.js';
import PipeNode from './PipeNode.js';
import TableCupNode from './TableCupNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import LevelOutControls from './LevelOutControls.js';
import LabTableNode from '../../common/view/LabTableNode.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Shape } from '../../../../kite/js/imports.js';
import NotepadNode from '../../common/view/NotepadNode.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import WaterBalanceSoundGenerator from './WaterBalanceSoundGenerator.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import switchToLeftSoundPlayer from '../../../../tambo/js/shared-sound-players/switchToLeftSoundPlayer.js';
import switchToRightSoundPlayer from '../../../../tambo/js/shared-sound-players/switchToRightSoundPlayer.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type LevelOutScreenViewOptions = PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class LevelOutScreenView extends MeanShareAndBalanceScreenView {

  // sound generator for the deviation between the water levels and the mean
  private readonly waterBalanceSoundGenerator: WaterBalanceSoundGenerator;

  public constructor( model: LevelOutModel, providedOptions: LevelOutScreenViewOptions ) {

    const options = providedOptions;

    // This also includes the pipes that connect the notepad cups as well as the draggable water level triangle.
    const waterCupLayerNode = new Node();
    const notepadNode = new NotepadNode();

    const superOptions = combineOptions<MeanShareAndBalanceScreenViewOptions>( options, {
      children: [ notepadNode ]
    } );
    super(
      model,

      // It was decided that updating the key for "introQuestionStringProperty" was not worth the effort of
      // retaining all the translations from the prototype publication. Therefore, the key no longer matches the
      // screen name. https://github.com/phetsims/mean-share-and-balance/issues/197
      MeanShareAndBalanceStrings.introQuestionStringProperty,
      MeanShareAndBalanceColors.levelOutQuestionBarColorProperty,
      notepadNode,
      superOptions
    );

    notepadNode.centerX = this.playAreaCenterX;
    const tableNode = new LabTableNode( {
      y: MeanShareAndBalanceConstants.LAB_TABLE_Y,
      centerX: this.playAreaCenterX
    } );

    const meanPredictSliderModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ),
      new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.NOTEPAD_CUPS_BOTTOM_Y ),
      MeanShareAndBalanceConstants.CUP_HEIGHT
    );

    const successIndicatorsEnabledProperty = DerivedProperty.and( [ model.pipesOpenProperty, model.waterLevelsMatchMeanProperty ] );
    const meanPredictionLine = new MeanPredictionLine(
      model.meanPredictionProperty,
      model.dragRange,
      successIndicatorsEnabledProperty,
      model.meanValueProperty,
      model.successIndicatorsOperatingProperty,
      meanPredictSliderModelViewTransform,
      {
        visibleProperty: model.predictMeanVisibleProperty,
        meanTolerance: 0.05,
        roundingInterval: 0.01,

        // phet-io
        tandem: options.tandem.createTandem( 'meanPredictionLine' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );
    meanPredictionLine.addLinkedElement( model.successIndicatorsOperatingProperty );

    this.addChild( tableNode );
    this.addChild( waterCupLayerNode );
    this.addChild( meanPredictionLine );

    const tableCupsParentTandem = options.tandem.createTandem( 'tableCups' );
    const pipesParentTandem = options.tandem.createTandem( 'pipes' );

    // Add all cup nodes to the view.
    const modelToNotepadTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.NOTEPAD_CUPS_BOTTOM_Y ),
      1
    );
    const modelToTableTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.TABLE_CUPS_BOTTOM_Y ),
      1
    );
    const notepadCupNodes: Array<NotepadCupNode> = [];
    model.notepadCups.forEach( cupModel => {
      const cupNode = new NotepadCupNode( cupModel, modelToNotepadTransform,
        model.tickMarksVisibleProperty );
      notepadCupNodes.push( cupNode );
    } );

    assert && assert( model.tableCups.length > 1, 'some of the code below assumes at least 2 cups exist' );
    const tableCupNodes: Array<TableCupNode> = [];
    model.tableCups.forEach( ( cupModel, i ) => {
      const cupNode = new TableCupNode( model.tickMarksVisibleProperty, model, cupModel, modelToTableTransform, {
        soundPlayerCrossFade: i / ( model.tableCups.length - 1 ),
        tandem: tableCupsParentTandem.createTandem( `tableCupNode${cupModel.linePlacement + 1}` )
      } );
      tableCupNodes.push( cupNode );
    } );

    // Add all pipe nodes to the view.
    const pipeNodes: Array<PipeNode> = [];
    model.pipeArray.forEach( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, model.pipesOpenProperty,
        model.pipesEnabledProperty, modelToNotepadTransform,
        { tandem: pipesParentTandem.createTandem( `pipeNode${index + 1}` ), focusable: index === 0 } );

      pipeNodes.push( pipeNode );
    } );

    waterCupLayerNode.children = [ ...notepadCupNodes, ...tableCupNodes, ...pipeNodes ];

    // Update line length and dilation based on the number of objects.
    model.numberOfCupsProperty.link( () => {
      const activeNotepadCups = model.getActiveNotepadCups();
      const firstCup = activeNotepadCups[ 0 ];
      const lastCup = activeNotepadCups[ activeNotepadCups.length - 1 ];
      meanPredictionLine.updateLine( firstCup.xPositionProperty.value, lastCup.xPositionProperty.value + MeanShareAndBalanceConstants.CUP_WIDTH );

      // Create a focus highlight that surrounds all the valves. Only the first valve is in the traversal order, and
      // they all do the same thing so this highlight indicates that there will only be one stop in the traversal order.
      const pipeBoundsShapes = pipeNodes.filter( pipe => pipe.visibleProperty.value )
        .map( pipe => Shape.bounds( pipe.globalBounds ) );

      // Focus highlight is set on the valveNode because it is what receives focus (not the PipeNode).
      pipeNodes[ 0 ].focusHighlight = Shape.union( pipeBoundsShapes )
        .transformed( pipeNodes[ 0 ].getGlobalToLocalMatrix() );
    } );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    // Controls on Right side of screen
    const controls = new LevelOutControls( model.tickMarksVisibleProperty, model.predictMeanVisibleProperty,
      model.numberOfCupsProperty, model.numberOfCupsRangeProperty, model.pipesOpenProperty,
      model.pipesEnabledProperty, notepadNode.bottom, { tandem: options.tandem.createTandem( 'controls' ) } );
    const controlsAlignBox = new AlignBox( controls, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );
    this.addChild( controlsAlignBox );

    // Add sound generation for the water cup levels.
    this.waterBalanceSoundGenerator = new WaterBalanceSoundGenerator(
      model.meanValueProperty,
      model.tableCups,
      model.notepadCups,
      model.pipesOpenProperty,
      { initialOutputLevel: 0.03 }
    );
    soundManager.addSoundGenerator( this.waterBalanceSoundGenerator );

    // Add sound generation for the pipes opening and closing.
    model.pipesOpenProperty.lazyLink( pipesOpen => {
      if ( !ResetAllButton.isResettingAllProperty.value ) {
        pipesOpen ? switchToRightSoundPlayer.play() : switchToLeftSoundPlayer.play();
      }
    } );
    model.numberOfCupsProperty.link( () => {
      this.interruptSubtreeInput();
    } );

    this.msabSetPDOMOrder(
      [ pipeNodes[ 0 ], meanPredictionLine ],
      [ ...tableCupNodes, controls.numberSpinner ],
      controls.controlsPDOMOrder
    );
  }

  public override reset(): void {
    this.waterBalanceSoundGenerator.reset();
    super.reset();
  }
}

meanShareAndBalance.register( 'LevelOutScreenView', LevelOutScreenView );