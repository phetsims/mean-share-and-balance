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
import { CUEING_ARROW_MARGIN } from '../distribute/view/DistributeScreenView.js';
import CandyBar from '../distribute/model/CandyBar.js';

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
   * Position the graphical node that is being used to depict all or part of a snack.  This method is used to position
   * the nodes that are *not* represented as images in the view.  The position is set in
   */
  public static setSnackGraphicPosition( snackNode: Node, snackType: SnackType, positionInStack: number ): void {

    assert && assert( snackType === 'candyBars' || snackType === 'apples', 'unknown snack type' );

    if ( snackType === 'candyBars' ) {

      // The candy bar graphic Nodes are stacked in a single column with a little space between each.
      snackNode.centerX = MeanShareAndBalanceConstants.CANDY_BAR_WIDTH / 2;
      snackNode.centerY = -( MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height +
                             MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT / 2 +
                             positionInStack * ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                             MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ) );
    }
    else {

      // The apples are stacked in two columns with some space between them in both the x and y dimensions.
      snackNode.centerX = positionInStack % 2 === 0 ?
                          MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2 - snackNode.width / 2 - HORIZONTAL_SPACE_BETWEEN_APPLES / 2 :
                          MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2 + snackNode.width / 2 + HORIZONTAL_SPACE_BETWEEN_APPLES / 2;
      snackNode.bottom = -Math.floor( positionInStack / 2 ) * ( snackNode.width + VERTICAL_SPACE_BETWEEN_APPLES ) -
                         VERTICAL_SPACE_BETWEEN_APPLES;
    }
  }

  /**
   * Get the position for a candy bar model element that is stacked on a plate.  The position is based on where the
   * plate is in model space and the candy bar's position in the stack.
   * @param plateXPosition - the X position of the plate on which the candy bar is to be stacked
   * @param positionInStack - position in the stack for the candy bar, 0 is the bottom, and it goes up from there.
   * @returns - a 2D vector in coordinate space that can be used to set the position of a candy
   */
  public static getStackedCandyBarPosition( plateXPosition: number, positionInStack: number ): Vector2 {

    const xPosition = plateXPosition - MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2;

    // TODO: Why do I need to account for stroke now? https://github.com/phetsims/mean-share-and-balance/issues/186
    const yPosition = -( MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height +
                         MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING -
                         1 +
                         ( positionInStack + 1 ) * ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                         MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ) );
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

  public static getCueingArrowPosition( plate: Plate<CandyBar>, plateHeight: number ): Vector2 {
    const topSnackIndex = plate.snacksOnNotepadPlate.length - 1;
    const plateXPosition = plate.xPositionProperty.value;
    return SnackStacker.getStackedCandyBarPosition( plateXPosition, topSnackIndex )
      .plusXY( MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2, -plateHeight + CUEING_ARROW_MARGIN );
  }
}

meanShareAndBalance.register( 'SnackStacker', SnackStacker );
export default SnackStacker;