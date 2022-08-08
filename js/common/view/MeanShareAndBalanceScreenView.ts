// Copyright 2022, University of Colorado Boulder

/**
 * Parent ScreenView that contains components shared across screens such as: QuestionBar, Controls Layout,
 * SyncDataButton, and ResetAll
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceModel from '../model/MeanShareAndBalanceModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { AlignBox, GridBox, TColor, VBox } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SyncButton from './SyncButton.js';

type SelfOptions = EmptySelfOptions;

export type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  public readonly resetAllButton: ResetAllButton;
  // Syncs the two representations on each screen. ie. in intro, syncs the 3D and 2D cups.
  public readonly controlsVBox: VBox;
  public readonly numberSpinnerVBox: VBox;
  public readonly questionBar: QuestionBar;
  private readonly controlsAlignBox: AlignBox;
  public readonly syncButton: SyncButton;

  protected constructor( model: MeanShareAndBalanceModel, questionBarText: string, questionBarColor: TColor, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      tandem: options.tandem.createTandem( 'questionBar' ),
      labelText: questionBarText,
      barFill: questionBarColor
    } );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    this.syncButton = new SyncButton( this.layoutBounds, {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.syncData();
      },
      tandem: options.tandem.createTandem( 'syncRepresentationsButton' )
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' ),
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN
    } );

    this.controlsVBox = new VBox( {
      align: 'left',
      layoutOptions: { column: 1, row: 0 }
    } );

    this.numberSpinnerVBox = new VBox( {
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 1, row: 2 }
    } );

    const controlsGridBox = new GridBox( {
      children: [
        this.controlsVBox,
        this.syncButton,
        this.numberSpinnerVBox
      ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    } );

    this.controlsAlignBox = new AlignBox( controlsGridBox, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
    this.addChild( this.controlsAlignBox );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );