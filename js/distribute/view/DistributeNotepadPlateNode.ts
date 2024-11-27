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
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../../common/model/Plate.js';
import Snack from '../../common/model/Snack.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type NotepadPlateNodeOptions = StrictOmit<NodeOptions, 'children'>;

// constants
const PLATE_X_OFFSET = 2; // The plate can appear off center since there is empty space on the left side of the image.

export default class DistributeNotepadPlateNode extends Node {

  public constructor( plate: Plate<Snack>,
                      modelViewTransform: ModelViewTransform2, providedOptions?: NotepadPlateNodeOptions ) {

    const plateNode = new Image( notepadPlateSketch_svg, {
      maxWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width,
      maxHeight: MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height
    } );

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      visibleProperty: plate.isActiveProperty,
      children: [ plateNode ],
      isDisposable: false
    }, providedOptions );

    super( options );

    // Set the Y position once.  It shouldn't change after construction.
    this.bottom = modelViewTransform.transformY( 0 );

    // Set position based on the plate's position.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = modelViewTransform.transformX( xPosition ) - PLATE_X_OFFSET;
    } );
  }
}

meanShareAndBalance.register( 'DistributeNotepadPlateNode', DistributeNotepadPlateNode );