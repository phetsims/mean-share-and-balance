// Copyright 2022-2024, University of Colorado Boulder

/**
 * DistributeNotepadPlateNode displays the plate and the outlined candy bars in the notepad for the Distribute
 * screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Color, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Plate, { PLATE_WIDTH } from '../../common/model/Plate.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';
import CandyBar from '../model/CandyBar.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import SnackStacker from '../../common/SnackStacker.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import DistributeModel from '../model/DistributeModel.js';

type NotepadPlateNodeOptions = StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

// constants
const CUEING_ARROW_LENGTH = 24;
const CUEING_ARROW_OPTIONS: ArrowNodeOptions = {
  fill: MeanShareAndBalanceColors.arrowFillColorProperty,
  stroke: Color.BLACK,
  lineWidth: 1,
  tailWidth: DistributeModel.CANDY_BAR_HEIGHT * 0.6,
  headWidth: DistributeModel.CANDY_BAR_HEIGHT * 1.2,
  lineJoin: 'round'
};
const CUEING_ARROW_MARGIN = 2;

export default class DistributeNotepadPlateNode extends Node {

  public constructor( hasGroupItemBeenSortedProperty: TReadOnlyProperty<boolean>, plate: Plate<CandyBar>,
                      mvt: ModelViewTransform2, providedOptions: NotepadPlateNodeOptions ) {

    const plateNode = new Image( notepadPlateSketch_svg, {
      maxWidth: PLATE_WIDTH
    } );

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      visibleProperty: plate.isActiveProperty,
      excludeInvisibleChildrenFromBounds: false,
      children: [ plateNode ]
    }, providedOptions );

    super( options );

    if ( plate.linePlacement === 0 ) {
      const leftCueingArrow = new ArrowNode( 0, 0, -CUEING_ARROW_LENGTH, 0, CUEING_ARROW_OPTIONS );
      const rightCueingArrow = new ArrowNode( 0, 0, CUEING_ARROW_LENGTH, 0, CUEING_ARROW_OPTIONS );
      leftCueingArrow.right = plateNode.left - CUEING_ARROW_MARGIN;
      rightCueingArrow.left = plateNode.right + CUEING_ARROW_MARGIN;

      Multilink.multilink( [ plate.snacksOnNotepadPlate.lengthProperty, hasGroupItemBeenSortedProperty ],
        ( numberOfSnacks, hasGroupItemBeenSorted ) => {
          leftCueingArrow.visible = !hasGroupItemBeenSorted;
          rightCueingArrow.visible = !hasGroupItemBeenSorted;

          // Set the position of the cueing arrows.
          const topCandyBarY = SnackStacker.getStackedCandyBarPosition(
            plate.xPositionProperty.value, numberOfSnacks - 1 ).y +
                               plateNode.height + DistributeModel.CANDY_BAR_HEIGHT / 2;
          leftCueingArrow.centerY = topCandyBarY;
          rightCueingArrow.centerY = topCandyBarY;
        } );
      this.addChild( leftCueingArrow );
      this.addChild( rightCueingArrow );
    }

    // Set the Y position once.  It shouldn't change after construction.
    this.bottom = mvt.transformY( 0 );

    // Set position based on the plate's position.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = mvt.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'DistributeNotepadPlateNode', DistributeNotepadPlateNode );