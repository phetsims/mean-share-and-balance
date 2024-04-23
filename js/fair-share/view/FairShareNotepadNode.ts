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
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import collectSound_mp3 from '../../../sounds/collectSound_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import shareCompleteSound_mp3 from '../../../sounds/shareCompleteSound_mp3.js';
import shareWhooshSound_mp3 from '../../../sounds/shareWhooshSound_mp3.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import shareFractionalizeSound_mp3 from '../../../sounds/shareFractionalizeSound_mp3.js';
import erase_mp3 from '../../../../scenery-phet/sounds/erase_mp3.js';

type FairShareNotepadNodeOptions = EmptySelfOptions & NotepadNodeOptions;
export default class FairShareNotepadNode extends NotepadNode {

  public constructor( notepadModeProperty: Property<NotepadMode>, providedOptions: FairShareNotepadNodeOptions ) {

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
    const shareSoundGenerator = new ShareModeSoundPlayer( { initialOutputLevel: 0.3 } );
    soundManager.addSoundGenerator( shareSoundGenerator );

    const notepadModeRadioButtonGroup = new RectangularRadioButtonGroup<NotepadMode>(
      notepadModeProperty,
      notepadModeItems,
      {
        orientation: 'horizontal',
        spacing: 5,
        soundPlayers: [ syncSoundClip, collectSoundClip, shareSoundGenerator ],
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

class ShareModeSoundPlayer extends SoundGenerator implements TSoundPlayer {

  private readonly whooshSoundClip: SoundClip;
  private readonly shareCompleteSoundClip: SoundClip;
  private readonly shareFractionalizeSoundClip: SoundClip;

  public constructor( options?: SoundGeneratorOptions ) {

    super( options );

    this.whooshSoundClip = new SoundClip( shareWhooshSound_mp3 );
    this.whooshSoundClip.connect( this.mainGainNode );
    this.shareCompleteSoundClip = new SoundClip( shareCompleteSound_mp3 );
    this.shareCompleteSoundClip.connect( this.mainGainNode );
    this.shareFractionalizeSoundClip = new SoundClip( shareFractionalizeSound_mp3 );
    this.shareFractionalizeSoundClip.connect( this.mainGainNode );
  }

  public play(): void {
    this.whooshSoundClip.play();
    this.shareFractionalizeSoundClip.play( 0.55 );
    this.shareCompleteSoundClip.play( 1.25 );
  }

  public stop(): void {
    this.whooshSoundClip.stop();
    this.shareFractionalizeSoundClip.stop();
    this.shareCompleteSoundClip.stop();
  }
}

meanShareAndBalance.register( 'FairShareNotepadNode', FairShareNotepadNode );