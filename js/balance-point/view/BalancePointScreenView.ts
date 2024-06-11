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
import MeanCalculationPanel from '../../common/view/MeanCalculationPanel.js';
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

    // The play area center is calculated based on the layout bounds and the width of the controls.
    const controlsWidthOffset = ( MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH +
                                  MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    this.playAreaCenterX = this.layoutBounds.centerX - controlsWidthOffset;

    const backgroundNode = new BackgroundNode( MeanShareAndBalanceConstants.GROUND_POSITION_Y, this.visibleBoundsProperty );
    const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      questionString: MeanShareAndBalanceStrings.balancePointQuestionStringProperty,
      barFill: MeanShareAndBalanceColors.balancePointQuestionBarColorProperty
    } );
    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    // Create the notepad that appears below the questionBar.
    const notepadNode = new BalancePointNotepadNode( sceneModel, this.playAreaNumberLineNode,
      model.fulcrumWasDraggedProperty, model.tickMarksVisibleProperty,
      model.meanFulcrumFixedProperty, {
        totalVisibleProperty: model.totalVisibleProperty,
        tandem: options.tandem.createTandem( 'notepadNode' ),
        centerX: this.playAreaCenterX,
        meanInfoPanelVisibleProperty: model.meanInfoPanelVisibleProperty
      }
    );

    // Create the controls that appear on the right side of the screen.
    const controls = new BalancePointControls( model, {
      tandem: options.tandem.createTandem( 'controls' )
    } );
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

    // Add children to the scene graph in correct z-order.
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

    // Grab the notepadNode bounds after the playAreaNumberLineNode and notepadNode have been added to the scene graph.
    // This ensures that we have updated notepadNode bounds as the numberLines are transformed to match along the x-axis.
    const notepadNodeBounds = notepadNode.bounds;
    const calculationDependencies = [
      model.selectedSceneModelProperty,
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.valueProperty ),
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.soccerBallPhaseProperty )
    ];

    const meanCalculationPanel = new MeanCalculationPanel(
      calculationDependencies,
      () => model.selectedSceneModelProperty.value.getStackedObjects().map( ball => ball.valueProperty.value! ),
      () => model.selectedSceneModelProperty.value.getStackedObjects().length,
      model.meanInfoPanelVisibleProperty, notepadNodeBounds,
      {
        zeroDataMessageProperty: MeanShareAndBalanceStrings.needAtLeastOneKickStringProperty,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        centerX: this.playAreaCenterX,
        tandem: options.tandem.createTandem( 'meanCalculationPanel' )
      }
    );

    sceneView.groupSortInteractionView.setGroupFocusHighlightTop( notepadNodeBounds.bottom,
      MeanShareAndBalanceConstants.SOCCER_BALL_RANGE );

    this.addChild( meanCalculationPanel );

    // Set the PDOM order of the nodes in the screen.
    this.pdomPlayAreaNode.setPDOMOrder( [
        kickButton,
        ...notepadNode.notepadPDOMOrder,
        sceneView.backSceneViewLayer,
        controls.numberSpinner
      ] );

    this.pdomControlAreaNode.setPDOMOrder( [
      ...controls.controlsPDOMOrder,
      resetAllButton
    ] );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );