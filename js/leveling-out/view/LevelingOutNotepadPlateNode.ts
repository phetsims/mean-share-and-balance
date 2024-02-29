// Copyright 2022-2024, University of Colorado Boulder

/**
 * LevelingOutNotepadPlateNode displays the plate and the outlined candy bars in the notepad for the Leveling Out
 * screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Line, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../../common/model/Plate.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import SnackStacker from '../../common/SnackStacker.js';
import LevelingOutModel from '../model/LevelingOutModel.js';

type NotepadPlateNodeOptions = StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

// constants
const STROKE_WIDTH = 1;

export default class LevelingOutNotepadPlateNode extends Node {

  public constructor( plate: Plate, providedOptions: NotepadPlateNodeOptions ) {

    const candyBarOutlineNodes: Node[] = [];
    _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, i => {
      const candyBarOutlineNode = new Rectangle(
        0,
        0,
        LevelingOutModel.CANDY_BAR_WIDTH - STROKE_WIDTH,
        LevelingOutModel.CANDY_BAR_HEIGHT - STROKE_WIDTH,
        {
          stroke: MeanShareAndBalanceColors.candyBarColorProperty,
          lineDash: [ 1, 2 ]
        }
      );
      SnackStacker.setSnackGraphicPosition( candyBarOutlineNode, 'candyBars', i );
      candyBarOutlineNodes.push( candyBarOutlineNode );
    } );

    const plateNode = new Line( 0, 0, Plate.WIDTH, 0, {
      stroke: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_PATTERN,
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH
    } );

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      centerX: plate.xPositionProperty.value,
      bottom: LevelingOutModel.NOTEPAD_PLATE_CENTER_Y + MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH / 2,
      visibleProperty: plate.isActiveProperty,
      excludeInvisibleChildrenFromBounds: false,
      children: [ ...candyBarOutlineNodes, plateNode ]
    }, providedOptions );

    super( options );

    // Set the visibility of the outline nodes based on how many candy bars are on the table plate.
    plate.snackNumberProperty.link( numberOfSnacksOnPlate => {
      candyBarOutlineNodes.forEach( ( node, index ) => {
        node.visible = numberOfSnacksOnPlate > index;
      } );
    } );
  }
}

meanShareAndBalance.register( 'LevelingOutNotepadPlateNode', LevelingOutNotepadPlateNode );