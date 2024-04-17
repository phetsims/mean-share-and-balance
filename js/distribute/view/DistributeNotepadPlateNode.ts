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
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Plate from '../../common/model/Plate.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';
import CandyBar from '../model/CandyBar.js';

type NotepadPlateNodeOptions = StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class DistributeNotepadPlateNode extends Node {

  public constructor( plate: Plate<CandyBar>, mvt: ModelViewTransform2, providedOptions: NotepadPlateNodeOptions ) {

    const plateNode = new Image( notepadPlateSketch_svg, {
      maxWidth: Plate.WIDTH
    } );

    const options = optionize<NotepadPlateNodeOptions, EmptySelfOptions, NodeOptions>()( {
      visibleProperty: plate.isActiveProperty,
      excludeInvisibleChildrenFromBounds: false,
      children: [ plateNode ]
    }, providedOptions );

    super( options );

    // Set the Y position once.  It shouldn't change after construction.
    this.bottom = mvt.transformY( 0 );

    // Set position based on the plate's position.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = mvt.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'DistributeNotepadPlateNode', DistributeNotepadPlateNode );