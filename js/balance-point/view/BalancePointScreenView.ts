// Copyright 2024, University of Colorado Boulder

/**
 * BalancePointScreenView defines the range and field size for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerScreenView, { SoccerScreenViewOptions } from '../../../../soccer-common/js/view/SoccerScreenView.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalancePointModel from '../model/BalancePointModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import BackgroundNode from '../../../../soccer-common/js/view/BackgroundNode.js';
import BalancePointControls from './BalancePointControls.js';
import { AlignBox, Text } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BalancePointSceneView from './BalancePointSceneView.js';
import isResettingProperty from '../../../../soccer-common/js/model/isResettingProperty.js';
import MeanCalculationDialog from '../../common/view/MeanCalculationDialog.js';
import BalancePointNotepadNode from './BalancePointNotepadNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import KickButton, { KICK_BUTTON_FONT } from '../../../../soccer-common/js/view/KickButton.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;

export default class BalancePointScreenView extends SoccerScreenView<BalancePointSceneModel, BalancePointModel> {

  public readonly playAreaCenterX: number;

  public constructor( model: BalancePointModel, providedOptions: BalancePointScreenViewOptions ) {

    const options = optionize<BalancePointScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
      chartViewWidth: MeanShareAndBalanceConstants.CHART_VIEW_WIDTH,
      numberLineXMargin: MeanShareAndBalanceConstants.NUMBER_LINE_LEFT_X_MARGIN,
      groundPositionY: MeanShareAndBalanceConstants.GROUND_POSITION_Y
    }, providedOptions );


    super( model, options );

    // There is only one scene in the balance point screen.
    const sceneModel = model.selectedSceneModelProperty.value;
    const sceneView = new BalancePointSceneView(
      model,
      sceneModel,
      this.keyboardSortCueNode,
      this.modelViewTransform,
      options.tandem.createTandem( 'sceneView' )
    );

    const controlsWidthOffset = ( MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH +
                                  MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    this.playAreaCenterX = this.layoutBounds.centerX - controlsWidthOffset;

    // Background
    const backgroundNode = new BackgroundNode( MeanShareAndBalanceConstants.GROUND_POSITION_Y, this.visibleBoundsProperty );

    const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      questionString: MeanShareAndBalanceStrings.balancePointQuestionStringProperty,
      barFill: MeanShareAndBalanceColors.balancePointQuestionBarColorProperty
    } );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    // Controls
    const controls = new BalancePointControls( model, {
      tandem: options.tandem.createTandem( 'controls' )
    } );

    // Notepad
    const notepadNode = new BalancePointNotepadNode( sceneModel, this.playAreaNumberLineNode,
      model.fulcrumWasDraggedProperty, model.areTickMarksVisibleProperty,
      model.isMeanVisibleProperty, model.isMeanFulcrumFixedProperty, {
        tandem: options.tandem.createTandem( 'notepadNode' ),
        centerX: this.playAreaCenterX
      }
    );

    const notepadNodeBounds = notepadNode.bounds;

    const calculationDependencies = [
      model.selectedSceneModelProperty,
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.valueProperty ),
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.soccerBallPhaseProperty )
    ];

    const meanInfoDialog = new MeanCalculationDialog(
      calculationDependencies,
      () => model.selectedSceneModelProperty.value.getStackedObjects().map( ball => ball.valueProperty.value! ),
      () => model.selectedSceneModelProperty.value.getStackedObjects().length,
      model.isMeanInfoDialogVisibleProperty, notepadNodeBounds,
      {
        zeroDataMessageProperty: MeanShareAndBalanceStrings.needAtLeastOneKickStringProperty,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        centerX: this.playAreaCenterX,
        tandem: options.tandem.createTandem( 'meanInfoDialog' )
      }
    );

    const controlsAlignBox = new AlignBox( controls, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        assert && assert( !isResettingProperty.value, 'cannot reset while already resetting' );
        isResettingProperty.value = true;
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        notepadNode.reset();
        isResettingProperty.value = false;
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    const kickButton = new KickButton( {
      visibleProperty: model.selectedSceneModelProperty.value.hasKickableSoccerBallsProperty,
      content: new Text( MeanShareAndBalanceStrings.kickStringProperty, {
        font: KICK_BUTTON_FONT,
        maxWidth: 60
      } ),
      multiKick: false,
      tandem: options.tandem.createTandem( 'kickButton' ),
      listener: () => model.selectedSceneModelProperty.value.targetNumberOfBallsProperty.value++,
      leftTop: this.modelViewTransform.modelToViewXY( -2, 0 ).plusXY( 0, 8 )
    } );

    sceneView.groupSortInteractionView.setGroupFocusHighlightTop( notepadNodeBounds.bottom,
      MeanShareAndBalanceConstants.SOCCER_BALL_RANGE );
    this.addChild( backgroundNode );
    this.addChild( sceneView.backSceneViewLayer );
    this.addChild( kickButton );
    this.addChild( notepadNode );
    this.addChild( questionBar );
    this.addChild( controlsAlignBox );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNumberLineNode );
    this.addChild( this.mouseSortHandCueNode );
    this.addChild( this.sortIndicatorArrowNode );
    this.addChild( sceneView.frontSceneViewLayer );
    this.addChild( meanInfoDialog );

    this.pdomPlayAreaNode.setPDOMOrder( [
      kickButton,
      sceneView.backSceneViewLayer,
      controls.numberSpinner,
      ...notepadNode.notepadPDOMOrder
      ]
    );

    this.pdomControlAreaNode.setPDOMOrder( [
        ...controls.controlsPDOMOrder,
      resetAllButton
    ] );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );