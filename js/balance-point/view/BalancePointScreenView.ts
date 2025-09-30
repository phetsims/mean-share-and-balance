// Copyright 2024-2025, University of Colorado Boulder

/**
 * BalancePointScreenView defines the range and field size for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import SoccerCommonStrings from '../../../../soccer-common/js/SoccerCommonStrings.js';
import BackgroundNode from '../../../../soccer-common/js/view/BackgroundNode.js';
import KickButton, { KICK_BUTTON_FONT } from '../../../../soccer-common/js/view/KickButton.js';
import SoccerScreenView, { SoccerScreenViewOptions } from '../../../../soccer-common/js/view/SoccerScreenView.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanInfoPanel from '../../common/view/MeanInfoPanel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import BalancePointModel from '../model/BalancePointModel.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalancePointControls from './BalancePointControls.js';
import BalancePointNotepadNode from './BalancePointNotepadNode.js';
import BalancePointSceneView from './BalancePointSceneView.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;

export default class BalancePointScreenView extends SoccerScreenView<BalancePointSceneModel, BalancePointModel> {

  public readonly playAreaCenterX: number;

  public constructor( model: BalancePointModel, providedOptions: BalancePointScreenViewOptions ) {

    const options = optionize<BalancePointScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
      chartViewWidth: MeanShareAndBalanceConstants.CHART_VIEW_WIDTH,
      numberLineXMargin: MeanShareAndBalanceConstants.NUMBER_LINE_LEFT_X_MARGIN,
      groundPositionY: MeanShareAndBalanceConstants.GROUND_POSITION_Y,
      instrumentNumberLineNode: true
    }, providedOptions );

    super( model, options );

    // By design, there is only one scene model used on this screen, and the code throughout this file assumes that this
    // is the case.
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
      barFill: MeanShareAndBalanceColors.balancePointQuestionBarColorProperty,
      barHeight: MeanShareAndBalanceConstants.QUESTION_BAR_HEIGHT,
      tandem: options.tandem.createTandem( 'questionBar' ),
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    } );
    questionBar.addLinkedElement( MeanShareAndBalanceStrings.balancePointQuestionStringProperty );
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
    const controls = new BalancePointControls( model, notepadNode.bottom, {
      onInfoButtonPressed: () => {
        meanInfoPanel.closeButton.focus();
      },
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
        model.reset();
        notepadNode.reset();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    const kickButton = new KickButton( {
      visibleProperty: sceneModel.hasKickableSoccerBallsProperty,
      content: new Text( SoccerCommonStrings.kickStringProperty, {
        font: KICK_BUTTON_FONT,
        maxWidth: 60
      } ),
      multiKick: false,
      listener: () => {

        // Make sure the other control that affects kicking balls isn't trying to fire at the same time.
        controls.numberSpinner.interruptSubtreeInput();

        // Kick the ball or queue it for kicking by incrementing the target number.
        sceneModel.targetNumberOfBallsProperty.value++;
      },
      leftTop: this.modelViewTransform.modelToViewXY( -2, 0 ).plusXY( 0, 8 ),
      accessibleName: SoccerCommonStrings.kickStringProperty,
      tandem: options.tandem.createTandem( 'kickButton' )
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
      ...sceneModel.soccerBalls.map( ball => ball.valueProperty ),
      ...sceneModel.soccerBalls.map( ball => ball.soccerBallPhaseProperty )
    ];

    const meanInfoPanel = new MeanInfoPanel(
      calculationDependencies,
      sceneModel.meanValueProperty,
      () => sceneModel.getStackedObjects().map( ball => ball.valueProperty.value! ),
      () => sceneModel.getStackedObjects().length,
      model.meanInfoPanelVisibleProperty, notepadNodeBounds,
      () => controls.infoButton!.focus(),
      {
        zeroDataMessageProperty: SoccerCommonStrings.needAtLeastOneKickStringProperty,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        centerX: this.playAreaCenterX,
        tandem: options.tandem.createTandem( 'meanInfoPanel' )
      }
    );

    sceneView.groupSortInteractionView.setGroupFocusHighlightTop( notepadNodeBounds.bottom,
      MeanShareAndBalanceConstants.SOCCER_BALL_RANGE );

    this.addChild( meanInfoPanel );

    /**
     * BalancePointScreenView must explicitly set the traversal order for the screen here since it must
     * extend SoccerScreenView to take advantage of the code in the soccer-common repo. We do not have access
     * to msabSetPDOMOrder because of this necessary relationship.
     */
    this.pdomPlayAreaNode.setPDOMOrder( [
      kickButton,
      ...notepadNode.notepadPDOMOrder,
      sceneView.backSceneViewLayer,
      controls.numberSpinner
    ] );

    this.pdomControlAreaNode.setPDOMOrder( [
      ...controls.controlsPDOMOrder,
      meanInfoPanel,
      resetAllButton
    ] );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );