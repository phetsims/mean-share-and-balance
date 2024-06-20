// Copyright 2022-2024, University of Colorado Boulder
/**
 * Representation for the Level Out Screen, displaying table/notepad water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { AlignBox, Node, Path } from '../../../../scenery/js/imports.js';
import LevelOutModel from '../model/LevelOutModel.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadCupNode from './NotepadCupNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanPredictionSlider from '../../common/view/MeanPredictionSlider.js';
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
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import switchToLeftSoundPlayer from '../../../../tambo/js/shared-sound-players/switchToLeftSoundPlayer.js';
import switchToRightSoundPlayer from '../../../../tambo/js/shared-sound-players/switchToRightSoundPlayer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import selectionArpeggio009_mp3 from '../../../../tambo/sounds/selectionArpeggio009_mp3.js';

type LevelOutScreenViewOptions = PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class LevelOutScreenView extends MeanShareAndBalanceScreenView {

  // sound generator for the deviation between the water levels and the mean
  private readonly waterBalanceSoundGenerator: WaterBalanceSoundGenerator;

  public constructor( model: LevelOutModel, providedOptions: LevelOutScreenViewOptions ) {

    const options = providedOptions;

    // Create the sound that will be played when the mean prediction becomes correct.
    const meanPredictionSuccessSoundClip = new SoundClip( selectionArpeggio009_mp3, { initialOutputLevel: 0.1 } );
    soundManager.addSoundGenerator( meanPredictionSuccessSoundClip );

    // Predict Mean Line that acts as a slider for alternative input.
    const createSuccessIndicatorMultilink = ( predictMeanLine: Path, successRectangle: Node ) => {
      Multilink.multilink(
        [
          model.pipesOpenProperty,
          model.meanPredictionProperty,
          model.meanProperty,
          model.waterLevelsMatchMeanProperty,
          model.successIndicatorsOperatingProperty
        ],
        ( pipesOpen, meanPrediction, meanValue, doWaterLevelsMatchMean, successIndicatorsOperating ) => {

          // If a phet-io client turns off successIndicator operation, hide the success rectangle, set the line to
          // the default pattern, and return early.
          if ( !successIndicatorsOperating ) {
            successRectangle.visible = false;
            predictMeanLine.stroke = MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN;
            return;
          }

          const successRectangleWasVisible = successRectangle.visible;
          const successStrokeColorWasSet = predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty;

          if ( pipesOpen && doWaterLevelsMatchMean ) {
            const meanTolerance = 0.05;
            const roundedPrediction = Utils.roundToInterval( meanPrediction, 0.01 );
            const roundedMean = Utils.roundToInterval( meanValue, 0.01 );
            const closeToMean = Utils.equalsEpsilon( roundedPrediction, roundedMean, meanTolerance );
            predictMeanLine.stroke = roundedPrediction === roundedMean ?
                                     MeanShareAndBalanceColors.meanColorProperty :
                                     MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN;
            successRectangle.visible = closeToMean;
          }
          else {
            predictMeanLine.stroke = MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN;
            successRectangle.visible = false;
          }

          // If one of the success indicators was just activated, play the "successful prediction" sound.
          if ( model.predictMeanVisibleProperty.value && !successRectangleWasVisible && !successStrokeColorWasSet &&
               ( successRectangle.visible || predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty ) ) {
            meanPredictionSuccessSoundClip.play();
          }
        }
      );
    };

    // This also includes the pipes that connect the notepad cups as well as the draggable water level triangle.
    const waterCupLayerNode = new Node();
    const notepadNode = new NotepadNode( {
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

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

    const meanPredictSliderModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
      new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.NOTEPAD_CUPS_BOTTOM_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const meanPredictionSlider = new MeanPredictionSlider(
      model.meanPredictionProperty,
      model.dragRange,
      createSuccessIndicatorMultilink,
      meanPredictSliderModelViewTransform,
      {
        visibleProperty: model.predictMeanVisibleProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'meanPredictionSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );
    meanPredictionSlider.addLinkedElement( model.successIndicatorsOperatingProperty );

    this.addChild( tableNode );
    this.addChild( waterCupLayerNode );
    this.addChild( meanPredictionSlider );

    const notepadCupsParentTandem = options.tandem.createTandem( 'notepadCups' );
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
        model.tickMarksVisibleProperty,
        { tandem: notepadCupsParentTandem.createTandem( `notepadCupNode${cupModel.linePlacement + 1}` ) } );
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
      meanPredictionSlider.updateLine( firstCup.xPositionProperty.value, lastCup.xPositionProperty.value + MeanShareAndBalanceConstants.CUP_WIDTH );

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
      model.numberOfCupsProperty, model.numberOfCupsRangeProperty,
      model.pipesOpenProperty, model.pipesEnabledProperty, { tandem: options.tandem.createTandem( 'controls' ) } );
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
      model.meanProperty,
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
      [ pipeNodes[ 0 ], meanPredictionSlider ],
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