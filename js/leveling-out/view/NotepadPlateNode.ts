// Copyright 2022-2024, University of Colorado Boulder

/**
 * In the upper (notepad) snackType, contains all the candy bars on a plate. Each plate in the model has one
 * NotepadPlateNode.
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

type NotepadPlateNodeOptions = StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

// constants
const STROKE_WIDTH = 1;

export default class NotepadPlateNode extends Node {
  public constructor( plate: Plate, providedOptions: NotepadPlateNodeOptions ) {

    const candyBarVerticalSpacing = MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
                                    MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING;

    const candyBarOutlineNodes: Node[] = [];
    _.times( MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE, i => {
      candyBarOutlineNodes.push( new Rectangle(
        0,
        0,
        MeanShareAndBalanceConstants.CANDY_BAR_WIDTH - STROKE_WIDTH,
        MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT - STROKE_WIDTH,
        {
          stroke: MeanShareAndBalanceColors.candyBarColorProperty,
          lineDash: [ 1, 2 ],
          centerX: MeanShareAndBalanceConstants.CANDY_BAR_WIDTH / 2,
          centerY: -( MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING +
                      MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT / 2 +
                      MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH +
                      candyBarVerticalSpacing * i )
        }
      ) );
    } );

    const plateNode = new Line( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, 0, {
      stroke: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_PATTERN,
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH
    } );

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.xPosition,
      bottom: MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y + MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH / 2,
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

meanShareAndBalance.register( 'NotepadPlateNode', NotepadPlateNode );