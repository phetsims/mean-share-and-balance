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

type SelfOptions = {};

export type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  readonly resetAllButton: ResetAllButton;
  readonly syncDataButton: ResetButton;

  constructor( model: MeanShareAndBalanceModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( options );

    this.syncDataButton = new ResetButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.syncData();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      y: 300,
      radius: 15,
      tandem: options.tandem.createTandem( 'matchRepresentationsButton' )
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

    // this.bottomRightControlsGrid = new GridBox( {
    //   rows: [ [ null, null ], [ null, this.resetAllButton ] ],
    //   right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
    //   bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN
    // } );

    this.addChild( this.resetAllButton );
    this.addChild( this.syncDataButton );
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