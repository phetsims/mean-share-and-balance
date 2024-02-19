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
import NotepadNode from '../../common/view/NotepadNode.js';
import { PatternStringProperty } from '../../../../axon/js/imports.js';
import BackgroundNode from '../../../../soccer-common/js/view/BackgroundNode.js';
import BalancePointControls from './BalancePointControls.js';
import { AlignBox } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import KickerPortrayalUSA from '../../../../soccer-common/js/view/KickerPortrayalUSA.js';
import BalancePointSceneView from './BalancePointSceneView.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;
const NUMBER_LINE_LEFT_X_MARGIN = 160;
const NUMBER_LINE_RIGHT_X_MARGIN = 200;
const CHART_VIEW_WIDTH = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH
                         - NUMBER_LINE_LEFT_X_MARGIN - NUMBER_LINE_RIGHT_X_MARGIN;

const KICKER_IMAGE_SETS = KickerPortrayalUSA.unnumberedKickerImages;

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

    // TODO: This hard codes only supporting one scene, https://github.com/phetsims/mean-share-and-balance/issues/152
    const sceneView = new BalancePointSceneView(
      model,
      model.selectedSceneModelProperty.value,
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
    const totalDistancePatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.totalDistancePatternStringProperty, {
      total: model.selectedSceneModelProperty.value.totalKickDistanceProperty
    } );
    const notepadNode = new NotepadNode( {
      readoutPatternStringProperty: totalDistancePatternStringProperty,
      tandem: options.tandem.createTandem( 'notepadNode' ),
      centerX: this.playAreaCenterX
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
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.addChild( backgroundNode );
    this.addChild( sceneView.backSceneViewLayer );
    this.addChild( notepadNode );
    this.addChild( questionBar );
    this.addChild( controlsAlignBox );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNumberLineNode );
    this.addChild( sceneView.frontSceneViewLayer );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );