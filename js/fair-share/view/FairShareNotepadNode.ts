// Copyright 2024, University of Colorado Boulder

/**
 * Adds a RectangularRadioButtonGroup to the NotepadNode for the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import NotepadNode, { NotepadNodeOptions } from '../../common/view/NotepadNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import FairShareModel, { ApplesAnimationState, NotepadMode } from '../model/FairShareModel.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import { AlignBox, Image, Text } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import collectionArea_svg from '../../../images/collectionArea_svg.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import collectSound_mp3 from '../../../sounds/collectSound_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import shareCompleteSound_mp3 from '../../../sounds/shareCompleteSound_mp3.js';
import shareWhooshSound_mp3 from '../../../sounds/shareWhooshSound_mp3.js';
import shareFractionalizeSound_mp3 from '../../../sounds/shareFractionalizeSound_mp3.js';
import erase_mp3 from '../../../../scenery-phet/sounds/erase_mp3.js';
import TinyEmitter from '../../../../axon/js/TinyEmitter.js';

type FairShareNotepadNodeOptions = EmptySelfOptions & NotepadNodeOptions;
export default class FairShareNotepadNode extends NotepadNode {

  public constructor( notepadModeProperty: Property<NotepadMode>, applesAnimationStateEmitter: TinyEmitter<ApplesAnimationState>, providedOptions: FairShareNotepadNodeOptions ) {

    super( providedOptions );

    // Add the radio buttons for selecting the different modes.
    const notepadModes = [ NotepadMode.SYNC, NotepadMode.COLLECT, NotepadMode.SHARE ];
    const notepadModeItems = _.map( notepadModes,
      choice => {
        return {
          createNode: () => new Text( choice.stringProperty, { font: new PhetFont( 12 ), maxWidth: 120 } ),
          value: choice,
          tandemName: `${choice.name.toLowerCase()}RadioButton`,
          options: { minWidth: 80 }
        };
      }
    );

    // sound generation
    const syncSoundClip = new SoundClip( erase_mp3, { initialOutputLevel: 0.3 } );
    soundManager.addSoundGenerator( syncSoundClip );
    const collectSoundClip = new SoundClip( collectSound_mp3, { initialOutputLevel: 0.3 } );
    soundManager.addSoundGenerator( collectSoundClip );

    // TODO: jbphet I'm not sure what to do about the mainGainNode... https://github.com/phetsims/mean-share-and-balance/issues/206
    const whooshSoundClip = new SoundClip( shareWhooshSound_mp3, { initialOutputLevel: 0.3 } );
    // whooshSoundClip.connect( this.mainGainNode );
    soundManager.addSoundGenerator( whooshSoundClip );

    const shareCompleteSoundClip = new SoundClip( shareCompleteSound_mp3, { initialOutputLevel: 0.3 } );
    // shareCompleteSoundClip.connect( this.mainGainNode );
    soundManager.addSoundGenerator( shareCompleteSoundClip );
    const shareFractionalizeSoundClip = new SoundClip( shareFractionalizeSound_mp3, { initialOutputLevel: 0.3 } );
    // shareFractionalizeSoundClip.connect( this.mainGainNode )
    soundManager.addSoundGenerator( shareFractionalizeSoundClip );

    // Play the appropriate sounds as the apples animate to their different positions.
    applesAnimationStateEmitter.addListener( applesAnimationState => {
      applesAnimationState === 'split' && shareFractionalizeSoundClip.play();
      applesAnimationState === 'land' && shareCompleteSoundClip.play();
    } );

    const notepadModeRadioButtonGroup = new RectangularRadioButtonGroup<NotepadMode>(
      notepadModeProperty,
      notepadModeItems,
      {
        orientation: 'horizontal',
        spacing: 5,
        soundPlayers: [ syncSoundClip, collectSoundClip, whooshSoundClip ],
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