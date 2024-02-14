// Copyright 2023, University of Colorado Boulder

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
import { combineOptions, EmptySelfOptions, optionize } from '../../../../phet-core/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import NotepadNode from '../../common/view/NotepadNode.js';
import { PatternStringProperty } from '../../../../axon/js/imports.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;
const NUMBER_LINE_MARGIN_X = 100;
const CHART_VIEW_WIDTH = ScreenView.DEFAULT_LAYOUT_BOUNDS.width - MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - NUMBER_LINE_MARGIN_X * 2;

export default class BalancePointScreenView extends SoccerScreenView<BalancePointSceneModel, BalancePointModel> {

  public constructor( model: BalancePointModel, providedOptions: BalancePointScreenViewOptions ) {

    const options = optionize<BalancePointScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
      chartViewWidth: CHART_VIEW_WIDTH,
      numberLineXMargin: NUMBER_LINE_MARGIN_X
    }, providedOptions );

    // Controls

    // Notepad
    const totalDistancePatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.totalDistancePatternStringProperty, {
      total: model.selectedSceneModelProperty.value.totalKickDistanceProperty
    } );
    const notepadNode = new NotepadNode( {
      readoutPatternStringProperty: totalDistancePatternStringProperty,
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

    const superOptions = combineOptions<SoccerScreenViewOptions>( {
      children: [ notepadNode ]
    }, options );
    super( model, superOptions );

    const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      questionString: MeanShareAndBalanceStrings.balancePointQuestionStringProperty,
      barFill: MeanShareAndBalanceColors.balancePointQuestionBarColorProperty
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

    this.addChild( questionBar );
    this.addChild( resetAllButton );
    this.addChild( this.playAreaNumberLineNode );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );