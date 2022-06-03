// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the MeanShareAndBalanceScreen, contains resetAll button
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceModel from '../model/MeanShareAndBalanceModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ResetButton from '../../../../scenery-phet/js/buttons/ResetButton.js';
import { AlignBox, GridBox, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import merge from '../../../../phet-core/js/merge.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type SelfOptions = {};

export type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  readonly resetAllButton: ResetAllButton;
  readonly syncDataButton: ResetButton;
  readonly controlsAlignBox: AlignBox;
  readonly controlsVBox: VBox;
  readonly numberSpinnerVBox: VBox;
  readonly questionBar: QuestionBar;

  constructor( model: MeanShareAndBalanceModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, merge( {
      tandem: options.tandem.createTandem( 'questionBar' )
    }, { labelText: meanShareAndBalanceStrings.levelingOutQuestion, barFill: '#2496D6' } ) );

    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height, this.layoutBounds.maxX, this.layoutBounds.maxY );

    this.syncDataButton = new ResetButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.syncData();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      radius: 15,
      tandem: options.tandem.createTandem( 'matchRepresentationsButton' ),
      layoutOptions: { x: 0, y: 1, xAlign: 'left', minContentHeight: 175, yAlign: 'top' }
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
      layoutOptions: { x: 0, y: 0 }
    } );

    this.numberSpinnerVBox = new VBox( {
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { x: 0, y: 2 }
    } );

    const controlsGridBox = new GridBox( {
      children: [
        this.controlsVBox,
        this.syncDataButton,
        this.numberSpinnerVBox
      ],
      minContentWidth: 175,
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
  }

  /**
   * Steps the view.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );