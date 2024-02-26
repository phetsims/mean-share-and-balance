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
import { EmptySelfOptions, optionize } from '../../../../phet-core/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import BackgroundNode from '../../../../soccer-common/js/view/BackgroundNode.js';
import BalancePointControls from './BalancePointControls.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KickerPortrayalUSA from '../../../../soccer-common/js/view/KickerPortrayalUSA.js';
import BalancePointSceneView from './BalancePointSceneView.js';
import { KickerImageSet } from '../../../../soccer-common/js/view/KickerPortrayal.js';
import KickerPortrayalAfrica from '../../../../soccer-common/js/view/KickerPortrayalAfrica.js';
import KickerPortrayalAfricaModest from '../../../../soccer-common/js/view/KickerPortrayalAfricaModest.js';
import isResettingProperty from '../../../../soccer-common/js/model/isResettingProperty.js';
import MeanCalculationDialog from '../../leveling-out/view/MeanCalculationDialog.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import BalancePointNotepadNode from './BalancePointNotepadNode.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;
const NUMBER_LINE_LEFT_X_MARGIN = 160;
const NUMBER_LINE_RIGHT_X_MARGIN = 200;
const CHART_VIEW_WIDTH = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH
                         - NUMBER_LINE_LEFT_X_MARGIN - NUMBER_LINE_RIGHT_X_MARGIN;

// Depending on how many characters a regionAndCulture RegionAndCulturePortrayal has will determine how we loop over the characters.
const KICKER_IMAGE_SETS: KickerImageSet[][] = [];

_.times( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, i => {
  const locale1MaxNumberOfCharacters = KickerPortrayalUSA.unnumberedKickersCount;
  const locale2MaxNumberOfCharacters = KickerPortrayalAfrica.unnumberedKickersCount;
  const locale3MaxNumberOfCharacters = KickerPortrayalAfricaModest.unnumberedKickersCount;

  const locale1CharacterIndex = i < locale1MaxNumberOfCharacters ? i : i % locale1MaxNumberOfCharacters;
  const locale2CharacterIndex = i < locale2MaxNumberOfCharacters ? i : i % locale2MaxNumberOfCharacters;
  const locale3CharacterIndex = i < locale3MaxNumberOfCharacters ? i : i % locale3MaxNumberOfCharacters;

  KICKER_IMAGE_SETS.push( [ KickerPortrayalUSA.unnumberedKickerImages[ locale1CharacterIndex ],
    KickerPortrayalAfrica.unnumberedKickerImages[ locale2CharacterIndex ],
    KickerPortrayalAfricaModest.unnumberedKickerImages[ locale3CharacterIndex ]
  ] );
} );

export default class BalancePointScreenView extends SoccerScreenView<BalancePointSceneModel, BalancePointModel> {

  public readonly playAreaCenterX: number;

  public constructor( model: BalancePointModel, providedOptions: BalancePointScreenViewOptions ) {

    const options = optionize<BalancePointScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
      chartViewWidth: CHART_VIEW_WIDTH,
      numberLineXMargin: NUMBER_LINE_LEFT_X_MARGIN,
      groundPositionY: MeanShareAndBalanceConstants.GROUND_POSITION_Y
    }, providedOptions );


    super( model, options );

    // There is only one scene in the balance point screen.
    const sceneModel = model.selectedSceneModelProperty.value;
    const sceneView = new BalancePointSceneView(
      model,
      sceneModel,
      KICKER_IMAGE_SETS,
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
    const notepadNode = new BalancePointNotepadNode( sceneModel, model.isMeanVisibleProperty, {
      tandem: options.tandem.createTandem( 'notepadNode' ),
      centerX: this.playAreaCenterX
    } );

    const notepadNodeBounds = notepadNode.bounds;

    const notepadNumberLineNode = new NumberLineNode( CHART_VIEW_WIDTH, MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, {
      includeXAxis: false,
      color: 'black',
      x: NUMBER_LINE_LEFT_X_MARGIN,
      bottom: notepadNodeBounds.maxY - 15,
      showTickMarks: false,
      visibleProperty: model.areTickMarksVisibleProperty
    } );

    const calculationDependencies = [
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.valueProperty ),
      ...model.selectedSceneModelProperty.value.soccerBalls.map( ball => ball.soccerBallPhaseProperty )
    ];

    const meanInfoDialog = new MeanCalculationDialog(
      calculationDependencies,
      () => model.selectedSceneModelProperty.value.getSortedStackedObjects().map( ball => ball.valueProperty.value! ),
      () => model.selectedSceneModelProperty.value.getSortedStackedObjects().length,
      model.isMeanInfoDialogVisibleProperty, notepadNodeBounds,
      {
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
        isResettingProperty.value = false;
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.addChild( backgroundNode );
    this.addChild( sceneView.backSceneViewLayer );
    this.addChild( notepadNode );
    this.addChild( notepadNumberLineNode );
    this.addChild( questionBar );
    this.addChild( controlsAlignBox );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNumberLineNode );
    this.addChild( sceneView.frontSceneViewLayer );
    this.addChild( meanInfoDialog );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );