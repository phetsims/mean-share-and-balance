// Copyright 2024, University of Colorado Boulder

/**
 * SnackStacker is a utility class used to position both model and view elements that represent snack foods into stacks.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import { Image } from '../../../scenery/js/imports.js';
import Snack from '../common/model/Snack.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from './MeanShareAndBalanceConstants.js';
import Plate from './model/Plate.js';
import { SnackType } from './view/SharingScreenView.js';

// constants
const VERTICAL_SPACE_BETWEEN_APPLES = 4; // in screen coords, empirically determined
const HORIZONTAL_SPACE_BETWEEN_APPLES = 5; // in screen coords, empirically determined

class SnackStacker {

  /**
   * Position the provided scenery Image Node based on the type of snack and the position within the stack.  This
   * positioning is done assuming that the Node is in a parent node with a plate at the bottom.
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

  /**
   * Get the position for a candy bar model element that is stacked on a plate.  The position is based on where the
   * plate is in model space and the candy bar's position in the stack.
   * @param plateXPosition - the X position of the plate on which the candy bar is to be stacked
   * @param positionInStack - position in the stack for the candy bar, 0 is the bottom, and it goes up from there.
   * @returns - A 2D vector in coordinate space that can be used to set the position of a candy bar.  The value is for
   *            the upper left corner of the candy bar rectangle.
   */
  public static getStackedCandyBarPosition( plateXPosition: number, positionInStack: number ): Vector2 {

    const xPosition = plateXPosition - MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2;

    const distanceBetweenCandyBarCenters = MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                                           MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING;

    const yPosition = -( MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height +
                         MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING / 2 +
                         ( positionInStack + 1 ) * distanceBetweenCandyBarCenters );

    return new Vector2( xPosition, yPosition );
  }

  /**
   * Get the position for an apple model element that is stacked on a plate.  The position is based on where the plate
   * is in model space and the apple's position in the stack.
   * @param plateXPosition - the X position of the plate on which the apple is to be stacked
   * @param positionInStack - Position in the stack of apples.  0 is the bottom left, 1 is the bottom right, 2 is the
   * left side of the 2nd row from the bottom, and so forth.
   * @returns - a 2D vector in coordinate space that can be used to set the position of an apple
   */
  public static getStackedApplePosition( plateXPosition: number, positionInStack: number ): Vector2 {
    const appleRadius = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS;
    const xPosition = positionInStack % 2 === 0 ?
                      plateXPosition - appleRadius - HORIZONTAL_SPACE_BETWEEN_APPLES / 2 :
                      plateXPosition + appleRadius + HORIZONTAL_SPACE_BETWEEN_APPLES / 2;
    const yPosition = -MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height / 2 -
                      MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS -
                      VERTICAL_SPACE_BETWEEN_APPLES -
                      Math.floor( positionInStack / 2 ) *
                      ( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS * 2 + VERTICAL_SPACE_BETWEEN_APPLES );
    return new Vector2( xPosition, yPosition );
  }

  public static getCueingArrowPosition( plate: Plate<Snack>, plateHeight: number, cueingArrowMargin: number ): Vector2 {
    const topSnackIndex = plate.snacksOnNotepadPlate.length - 1;
    const plateXPosition = plate.xPositionProperty.value;
    return SnackStacker.getStackedCandyBarPosition( plateXPosition, topSnackIndex )
      .plusXY( MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2, -plateHeight + cueingArrowMargin );
  }
}

meanShareAndBalance.register( 'SnackStacker', SnackStacker );
export default SnackStacker;