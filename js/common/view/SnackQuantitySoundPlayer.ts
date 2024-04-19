// Copyright 2024, University of Colorado Boulder

/**
 * SnackQuantitySoundPlayer is for producing sounds as snacks are added to or removed from plates.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { SnackType } from './SharingScreenView.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CrossFadeSoundClip from '../../level-out/view/CrossFadeSoundClip.js';
import glassLevelSoundA_mp3 from '../../../sounds/glassLevelSoundA_mp3.js';
import glassLevelSoundB_mp3 from '../../../sounds/glassLevelSoundB_mp3.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import candyBarWrapper01_mp3 from '../../../sounds/candyBarWrapper01_mp3.js';
import candyBarWrapper03_mp3 from '../../../sounds/candyBarWrapper03_mp3.js';
import candyBarWrapper02_mp3 from '../../../sounds/candyBarWrapper02_mp3.js';
import appleBeingSliced01_mp3 from '../../../sounds/appleBeingSliced01_mp3.js';
import appleBeingSliced02_mp3 from '../../../sounds/appleBeingSliced02_mp3.js';
import appleBeingSliced03_mp3 from '../../../sounds/appleBeingSliced03_mp3.js';
import dotRandom from '../../../../dot/js/dotRandom.js';

type SelfOptions = EmptySelfOptions;
type SnackQuantitySoundPlayerOptions = SoundGeneratorOptions & SelfOptions;

class SnackQuantitySoundPlayer extends SoundGenerator implements TSoundPlayer {

  // The "base sound" that is pitched and cross-faded to sound slightly different based on the plate index.
  private readonly crossFadeSoundClip: CrossFadeSoundClip;

  // The sound effects (e.g. apple being sliced) that are played with other sounds to create a snack-specific sound.
  private readonly soundEffects: SoundClip[];

  public constructor( snackType: SnackType,
                      snackQuantityProperty: TReadOnlyProperty<number>,
                      plateIndex: number,
                      providedOptions?: SnackQuantitySoundPlayerOptions ) {

    const options = optionize<SnackQuantitySoundPlayerOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0.2
    }, providedOptions );

    super( options );

    this.crossFadeSoundClip = new CrossFadeSoundClip(
      glassLevelSoundA_mp3,
      glassLevelSoundB_mp3,
      ( plateIndex + 1 ) / MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS,
      {
        // Set this to the full output level since it will be going through another gain stage that is locally set.
        initialOutputLevel: 1
      }
    );
    this.crossFadeSoundClip.connect( this.mainGainNode );

    this.soundEffects = snackType === 'candyBars' ?
      [
        new SoundClip( candyBarWrapper01_mp3 ),
        new SoundClip( candyBarWrapper02_mp3 ),
        new SoundClip( candyBarWrapper03_mp3 )
      ] :
      [
        new SoundClip( appleBeingSliced01_mp3 ),
        new SoundClip( appleBeingSliced02_mp3 ),
        new SoundClip( appleBeingSliced03_mp3 )
      ];

    for ( const soundClip of this.soundEffects ) {
      soundClip.connect( this.mainGainNode );
    }

    // Adjust the playback rate of the sound based on the quantity of snacks.
    snackQuantityProperty.link( numberOfSnacks => {
      this.crossFadeSoundClip.setPlaybackRate(
        1 + numberOfSnacks / MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
      );
    } );
  }

  public play(): void {
    this.crossFadeSoundClip.play();
    const soundEffect = dotRandom.sample( this.soundEffects );
    soundEffect && soundEffect.play();
  }

  public stop(): void {
    this.crossFadeSoundClip.stop();
  }
}

meanShareAndBalance.register( 'SnackQuantitySoundPlayer', SnackQuantitySoundPlayer );

export default SnackQuantitySoundPlayer;