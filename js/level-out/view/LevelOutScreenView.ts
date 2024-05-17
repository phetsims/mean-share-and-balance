// Copyright 2022-2024, University of Colorado Boulder
/**
 * Representation for the Level Out Screen, displaying table/notepad water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { AlignBox, ManualConstraint, Node, Path } from '../../../../scenery/js/imports.js';
import LevelOutModel from '../model/LevelOutModel.js';
import Property from '../../../../axon/js/Property.js';
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

    const modelViewTransformNotepadCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
      new Vector2( 0, MeanShareAndBalanceConstants.NOTEPAD_CUPS_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransformTableCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
      new Vector2( 0, MeanShareAndBalanceConstants.TABLE_CUPS_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    // Create the sound that will be played when the mean prediction become correct.
    const meanPredictionSuccessSoundClip = new SoundClip( selectionArpeggio009_mp3, { initialOutputLevel: 0.1 } );
    soundManager.addSoundGenerator( meanPredictionSuccessSoundClip );

    // Predict Mean Line that acts as a slider for alternative input.
    const createSuccessIndicatorMultilink = ( predictMeanLine: Path, successRectangle: Node ) => {
      Multilink.multilink(
        [
          model.arePipesOpenProperty,
          model.meanPredictionProperty,
          model.meanProperty,
          model.doWaterLevelsMatchMeanProperty
        ],
        ( arePipesOpen, meanPrediction, meanValue, doWaterLevelsMatchMean ) => {
          const meanTolerance = 0.05;
          const roundedPrediction = Utils.roundToInterval( meanPrediction, 0.01 );
          const roundedMean = Utils.roundToInterval( meanValue, 0.01 );
          const closeToMean = Utils.equalsEpsilon( roundedPrediction, roundedMean, meanTolerance );
          const successRectangleWasVisible = successRectangle.visible;
          const successStrokeColorWasSet = predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty;

          if ( arePipesOpen && doWaterLevelsMatchMean && roundedPrediction === roundedMean ) {
            predictMeanLine.stroke = MeanShareAndBalanceColors.meanColorProperty;
            successRectangle.visible = false;
          }
          else {
            successRectangle.visible = arePipesOpen && doWaterLevelsMatchMean && closeToMean;
            predictMeanLine.stroke = MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN;
          }

          // If one of the success indicators was just activated, play the "successful prediction" sound.
          if ( model.predictMeanVisibleProperty.value && !successRectangleWasVisible && !successStrokeColorWasSet &&
               ( successRectangle.visible || predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty ) ) {
            meanPredictionSuccessSoundClip.play();
          }
        }
      );
    };
    const meanPredictionSlider = new MeanPredictionSlider(
      model.meanPredictionProperty,
      model.dragRange,
      createSuccessIndicatorMultilink,
      modelViewTransformNotepadCups,
      {
        visibleProperty: model.predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        // phet-io
        tandem: options.tandem.createTandem( 'meanPredictionSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    // Update line length and dilation based on the number of objects.
    model.numberOfCupsProperty.link( () => {
      const activeNotepadCups = model.getActiveNotepadCups();
      const firstCup = activeNotepadCups[ 0 ];
      const lastCup = activeNotepadCups[ activeNotepadCups.length - 1 ];
      meanPredictionSlider.updateLine( firstCup.position.x, lastCup.position.x + MeanShareAndBalanceConstants.CUP_WIDTH );
    } );

    const notepadCupsParentTandem = options.tandem.createTandem( 'notepadCups' );
    const tableCupsParentTandem = options.tandem.createTandem( 'tableCups' );
    const pipesParentTandem = options.tandem.createTandem( 'pipes' );

    // Add all cup nodes to the view.
    const notepadCupNodes: Array<NotepadCupNode> = [];
    model.notepadCups.forEach( ( cupModel, index ) => {
      const cupNode = new NotepadCupNode( cupModel, model.tableCups[ index ], modelViewTransformNotepadCups,
        model.meanProperty, model.tickMarksVisibleProperty,
        { tandem: notepadCupsParentTandem.createTandem( `notepadCupNode${cupModel.linePlacement + 1}` ) } );
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
      const pipeNode = new PipeNode( pipeModel, model.arePipesOpenProperty,
        model.arePipesEnabledProperty, modelViewTransformNotepadCups,
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
      children: [ notepadNode, tableNode, waterCupLayerNode, meanPredictionSlider ]
    } );

    // Instantiate Parent
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

    // Controls on Right side of screen
    const controls = new LevelOutControls( model.tickMarksVisibleProperty, model.predictMeanVisibleProperty,
      model.numberOfCupsProperty, model.numberOfCupsRangeProperty,
      model.arePipesOpenProperty, model.arePipesEnabledProperty, { tandem: options.tandem.createTandem( 'controls' ) } );

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
      meanPredictionSlider.x = waterCupLayerProxy.x - 12.5;
      tableNode.centerX = waterCupLayerProxy.centerX - 10;

      tableNode.y = waterCupLayerProxy.bottom - 30;

      // Create a focus highlight that surrounds all the valves. Only the first valve is in the traversal order, and
      // they all do the same thing so this highlight indicates that there will only be one stop in the traversal order.
      const pipeBoundsShapes = pipeNodes.filter( pipe => pipe.visibleProperty.value )
        .map( pipe => Shape.bounds( pipe.globalBounds ) );

      // Focus highlight is set on the valveNode because it is what receives focus (not the PipeNode).
      pipeNodes[ 0 ].focusHighlight = Shape.union( pipeBoundsShapes )
        .transformed( pipeNodes[ 0 ].getGlobalToLocalMatrix() );
    } );

    // Add sound generation for the water cup levels.
    this.waterBalanceSoundGenerator = new WaterBalanceSoundGenerator(
      model.meanProperty,
      model.tableCups,
      model.notepadCups,
      model.arePipesOpenProperty,
      { initialOutputLevel: 0.1 }
    );
    soundManager.addSoundGenerator( this.waterBalanceSoundGenerator );

    // Add sound generation for the pipes opening and closing.
    model.arePipesOpenProperty.lazyLink( pipesOpen => {
      if ( !ResetAllButton.isResettingAllProperty.value ) {
        pipesOpen ? switchToRightSoundPlayer.play() : switchToLeftSoundPlayer.play();
      }
    } );

    model.numberOfCupsProperty.link( () => {
      this.interruptSubtreeInput();
    } );

    this.msabSetPDOMOrder( tableCupNodes, [ pipeNodes[ 0 ], meanPredictionSlider, controls.numberSpinner ], controls.controlsPDOMOrder );
  }

  public override reset(): void {
    this.waterBalanceSoundGenerator.reset();
    super.reset();
  }
}

meanShareAndBalance.register( 'LevelOutScreenView', LevelOutScreenView );