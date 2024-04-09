// Copyright 2024, University of Colorado Boulder

/**
 * FairShareNotepadPlateNode displays the plate in the notepad for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Image } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../../common/model/Plate.js';
import { NotepadMode } from '../model/FairShareModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';
import Apple from '../model/Apple.js';

export default class FairShareNotepadPlateNode extends Image {

  public constructor( plate: Plate<Apple>, mvt: ModelViewTransform2, notepadModeProperty: TReadOnlyProperty<NotepadMode> ) {

    // The visibility of the plate is a function of whether the plate is active and the state of the notepad.
    const plateVisibleProperty = new DerivedProperty(
      [ plate.isActiveProperty, notepadModeProperty ],
      ( isActive, notepadMode ) => isActive && ( notepadMode !== NotepadMode.COLLECT )
    );

    super( notepadPlateSketch_svg, {
      maxWidth: Plate.WIDTH,
      visibleProperty: plateVisibleProperty
    } );

    // Set the Y position once.  It shouldn't change after construction.
    this.centerY = mvt.transformY( 0 );

    // Set position based on the plate's position.
    plate.xPositionProperty.link( xPosition => {
      this.centerX = mvt.transformX( xPosition );
    } );
  }
}

meanShareAndBalance.register( 'FairShareNotepadPlateNode', FairShareNotepadPlateNode );