// Copyright 2024, University of Colorado Boulder

/**
 * Adds a RectangularRadioButtonGroup to the NotepadNode for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { NotepadMode } from '../model/FairShareModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { AlignBox, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type FairShareNotepadNodeOptions = EmptySelfOptions & NotepadNodeOptions;
export default class FairShareNotepadNode extends NotepadNode {

  public constructor( notepadModeEnumerationProperty: Property<NotepadMode>,
                      providedOptions: FairShareNotepadNodeOptions ) {

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
      notepadModeEnumerationProperty,
      notepadModeItems,
      {
        orientation: 'horizontal',
        spacing: 5,
        tandem: providedOptions.tandem.createTandem( 'notepadModeRadioButtonGroup' )
      }
    );

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