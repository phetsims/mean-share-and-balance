// Copyright 2024, University of Colorado Boulder

/**
 * SnackStacker is a utility class used to position both model and view elements that represent snack foods into stacks.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../meanShareAndBalance.js';
import { Image, Node } from '../../../scenery/js/imports.js';
import { SnackType } from './view/SharingScreenView.js';
import MeanShareAndBalanceConstants from './MeanShareAndBalanceConstants.js';
import Plate from './model/Plate.js';
import Vector2 from '../../../dot/js/Vector2.js';

// constants
const VERTICAL_SPACE_BETWEEN_APPLES = 4; // in screen coords
const APPLE_X_MARGIN = 3; // in screen coords

class SnackStacker {

  /**
   * Position the provided scenery Node based on the type of snack and the position within the stack.  This positioning
   * is done assuming that the Node is in a parent node with a plate at the bottom.
   */
  public static setSnackImageNodePosition( snackNode: Image, snackType: SnackType, positionInStack: number ): void {
    assert && assert( snackType === 'candyBars' || snackType === 'apples', 'unknown snack type' );
    if ( snackType === 'candyBars' ) {

      // The candy bar image nodes are stacked in a single column with a little space between each.
      snackNode.x = 0;
      snackNode.bottom = -positionInStack * ( snackNode.height + MeanShareAndBalanceConstants.TABLE_CANDY_BAR_VERTICAL_SPACING );
    }
    else {

      // The apples are stacked in two columns with a little overlap in both the horizontal and vertical directions.
      snackNode.x = ( positionInStack % 2 ) * snackNode.width * 0.8;
      snackNode.bottom = -Math.floor( positionInStack / 2 ) * snackNode.height * 0.8;
    }
  }

  public static setSnackGraphicPosition( snackNode: Node, snackType: SnackType, positionInStack: number ): void {

    assert && assert( snackType === 'candyBars' || snackType === 'apples', 'unknown snack type' );

    if ( snackType === 'candyBars' ) {

      // The candy bar graphic Nodes are stacked in a single column with a little space between each.
      snackNode.centerX = MeanShareAndBalanceConstants.CANDY_BAR_WIDTH / 2;
      snackNode.centerY = -( MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH / 2 +
                             MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING +
                             MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT / 2 +
                             positionInStack * ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                             MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ) );
    }
    else {

      // The apples are stacked in two columns with some space between them in both the x and y dimensions.
      snackNode.left = positionInStack % 2 === 0 ?
                       APPLE_X_MARGIN :
        // TODO: It feels weird to me to use the candy bar width here.  There should be a constant for the plate width.  See https://github.com/phetsims/mean-share-and-balance/issues/149.
                       MeanShareAndBalanceConstants.CANDY_BAR_WIDTH - snackNode.width - APPLE_X_MARGIN;
      snackNode.bottom = -Math.floor( positionInStack / 2 ) * ( snackNode.width + VERTICAL_SPACE_BETWEEN_APPLES ) -
                         VERTICAL_SPACE_BETWEEN_APPLES;
    }
  }

  /**
   * Get the position for a candy bar model element that is stacked on a plate.  The position is based on where the
   * plate is in model space and the candy bar's position in the stack.
   * @param plate - plate on which the candy bar is to be stacked
   * @param positionInStack - position in the stack for the candy bar, 0 is the bottom and it goes up from there.
   */
  public static getCandyBarPositionInStack( plate: Plate, positionInStack: number ): Vector2 {
    const yPosition = MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y -
                      MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH / 2 -
                      ( positionInStack + 1 ) * ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                                                  MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING );
    return new Vector2( plate.xPosition, yPosition );
  }
}

meanShareAndBalance.register( 'SnackStacker', SnackStacker );
export default SnackStacker;