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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { TColor } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
// import SyncButton from './SyncButton.js';

export type MeanShareAndBalanceScreenViewOptions = PickRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  public readonly resetAllButton: ResetAllButton;
  public readonly questionBar: QuestionBar;

  // public readonly syncButton: SyncButton;

  protected constructor( model: MeanShareAndBalanceModel, questionBarText: TReadOnlyProperty<string>, questionBarColor: TColor, numberSpinnerProperty: Property<number>, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = providedOptions;

    super( options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      labelText: questionBarText.value,
      barFill: questionBarColor,

      // phet-io
      tandem: options.tandem.createTandem( 'questionBar' )
    } );


    //TODO: Do we need sync button for future screens?

    // this.syncButton = new SyncButton( this.layoutBounds, {
    //   listener: () => {
    //     this.interruptSubtreeInput(); // cancel interactions that may be in progress
    //     model.syncData();
    //   },
    //   tandem: options.tandem.createTandem( 'syncRepresentationsButton' )
    // } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,

      // phet-io
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // refactoring this to use children is inefficient. Too many of the elements rely on the layoutBounds of the class instance
    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );