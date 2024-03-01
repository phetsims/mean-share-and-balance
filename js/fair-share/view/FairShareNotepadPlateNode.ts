// Copyright 2024, University of Colorado Boulder

/**
 * FairShareNotepadPlateNode displays the plate in the notepad for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import { Line } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../../common/model/Plate.js';
import { NotepadMode } from '../model/FairShareModel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

export default class FairShareNotepadPlateNode extends Line {

  public constructor( plate: Plate, mvt: ModelViewTransform2, notepadModeProperty: TReadOnlyProperty<NotepadMode> ) {

    // The visibility of the plate is a function of whether the plate is active and the state of the notepad.
    const plateVisibleProperty = new DerivedProperty(
      [ plate.isActiveProperty, notepadModeProperty ],
      ( isActive, notepadMode ) => isActive && ( notepadMode !== NotepadMode.COLLECT )
    );

    super( 0, 0, Plate.WIDTH, 0, {
      stroke: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_PATTERN,
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH,
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