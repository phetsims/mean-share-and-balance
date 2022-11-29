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
import { Node, TColor } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

export type MeanShareAndBalanceScreenViewOptions = WithRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  protected readonly resetAllButton: ResetAllButton;
  public readonly questionBar: QuestionBar;
  protected readonly screenViewRootNode: Node;

  protected constructor( model: MeanShareAndBalanceModel, questionBarStringProperty: TReadOnlyProperty<string>, questionBarColor: TColor, providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = providedOptions;

    super( options );

    this.questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
      questionString: questionBarStringProperty,
      barFill: questionBarColor,

      // phet-io
      tandem: options.tandem.createTandem( 'questionBar' )
    } );

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

    this.screenViewRootNode = new Node( {
      children: [ this.questionBar, this.resetAllButton ]
    } );

    this.addChild( this.screenViewRootNode );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );