// Copyright 2022-2024, University of Colorado Boulder

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
import { Node, TColor } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TModel from '../../../../joist/js/TModel.js';

export type MeanShareAndBalanceScreenViewOptions = WithRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  protected readonly notepad: Node;
  protected readonly resetAllButton: ResetAllButton;
  public readonly questionBar: QuestionBar;
  protected readonly playAreaCenterX: number;

  protected constructor(
    model: TModel,
    questionBarStringProperty: TReadOnlyProperty<string>,
    questionBarColor: TColor,
    notepadNode: Node,
    providedOptions: MeanShareAndBalanceScreenViewOptions ) {
    const options = providedOptions;

    super( options );

    const controlsWidthOffset = ( MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH +
                                  MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    this.playAreaCenterX = this.layoutBounds.centerX - controlsWidthOffset;

    this.notepad = notepadNode;

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

    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // May be used for future screens
  }

  protected msabSetPDOMOrder( notepadInteractionNodes: Node[], tableInteractionNodes: Node[], controlNodes: Node[] ): void {
    this.pdomPlayAreaNode.setPDOMOrder( [
      ...notepadInteractionNodes,
      this.notepad,
      ...tableInteractionNodes
    ] );

    this.pdomControlAreaNode.setPDOMOrder( [
      ...controlNodes,
      this.resetAllButton
    ] );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreenView', MeanShareAndBalanceScreenView );