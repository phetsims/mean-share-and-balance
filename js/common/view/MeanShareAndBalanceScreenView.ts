// Copyright 2022-2024, University of Colorado Boulder

/**
 * Parent ScreenView that contains components shared across screens such as: QuestionBar, Controls Layout,
 * SyncDataButton, and ResetAll
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import TModel from '../../../../joist/js/TModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';

export type MeanShareAndBalanceScreenViewOptions = WithRequired<ScreenViewOptions, 'tandem'>;

export default class MeanShareAndBalanceScreenView extends ScreenView {
  protected readonly notepad: Node;
  protected readonly resetAllButton: ResetAllButton;
  public readonly questionBar: QuestionBar;
  protected readonly playAreaCenterX: number;

  protected constructor(
    model: TModel,
    questionBarStringProperty: LocalizedStringProperty,
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
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true },
      tandem: options.tandem.createTandem( 'questionBar' )
    } );
    this.questionBar.addLinkedElement( questionBarStringProperty );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - MeanShareAndBalanceConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - MeanShareAndBalanceConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.addChild( this.questionBar );
    this.addChild( this.resetAllButton );
  }

  /**
   * Resets the view.
   */
  public reset(): void {
    // Overwritten in subclasses.
  }

  /**
   * Set the traversal order for the screen.
   * @param notepadInteractionNodes
   * @param tableInteractionNodes
   * @param controlNodes
   */
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