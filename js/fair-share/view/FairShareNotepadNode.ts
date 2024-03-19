// Copyright 2024, University of Colorado Boulder

/**
 * Adds a RectangularRadioButtonGroup to the NotepadNode for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import FairShareModel, { NotepadMode } from '../model/FairShareModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { AlignBox, Image, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import collectionArea_svg from '../../../images/collectionArea_svg.js';

type FairShareNotepadNodeOptions = EmptySelfOptions & NotepadNodeOptions;
export default class FairShareNotepadNode extends NotepadNode {

  public constructor( notepadModeProperty: Property<NotepadMode>, providedOptions: FairShareNotepadNodeOptions ) {

    super( providedOptions );

    // Add the radio buttons for selecting the different modes.
    const notepadModes = [ NotepadMode.SYNC, NotepadMode.COLLECT, NotepadMode.SHARE ];
    const notepadModeItems = _.map( notepadModes,
      choice => {
        return {
          createNode: () => new Text( choice.stringProperty, { font: new PhetFont( 12 ) } ),
          value: choice,
          tandemName: `${choice.name.toLowerCase()}RadioButton`,
          options: { minWidth: 80 }
        };
      }
    );
    const notepadModeRadioButtonGroup = new RectangularRadioButtonGroup<NotepadMode>(
      notepadModeProperty,
      notepadModeItems,
      {
        orientation: 'horizontal',
        spacing: 5,
        tandem: providedOptions.tandem.createTandem( 'notepadModeRadioButtonGroup' )
      }
    );

    // Add the box that will depict the collection area, which is only shown in 'Collect' mode.
    const collectionAreaVisibleProperty = new DerivedProperty(
      [ notepadModeProperty ],
      mode => mode === NotepadMode.COLLECT
    );
    const collectionAreaNode = new Image( collectionArea_svg, {
      initialWidth: FairShareModel.COLLECTION_AREA_SIZE.width,
      initialHeight: FairShareModel.COLLECTION_AREA_SIZE.height,
      centerX: this.paperStackBounds.centerX,
      centerY: this.paperStackBounds.centerY + 5, // tweaked a bit due to be perfectly centered around the collection
      visibleProperty: collectionAreaVisibleProperty
    } );

    this.addChild( collectionAreaNode );

    const radioButtonGroupAlignBox = new AlignBox( notepadModeRadioButtonGroup, {
      alignBounds: this.localBounds,
      xAlign: 'center',
      yAlign: 'bottom',
      yMargin: 18
    } );
    this.addChild( radioButtonGroupAlignBox );
  }
}

meanShareAndBalance.register( 'FairShareNotepadNode', FairShareNotepadNode );