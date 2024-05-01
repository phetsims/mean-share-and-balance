// Copyright 2024, University of Colorado Boulder

/**
 * SnackQuantitySoundPlayer is a sound player that is used to produce sounds when snacks are added to or removed from
 * plates.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { SnackType } from './SharingScreenView.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import candyBarWrapper01_mp3 from '../../../sounds/candyBarWrapper01_mp3.js';
import candyBarWrapper03_mp3 from '../../../sounds/candyBarWrapper03_mp3.js';
import candyBarWrapper02_mp3 from '../../../sounds/candyBarWrapper02_mp3.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import hollowThud_mp3 from '../../../../tambo/sounds/hollowThud_mp3.js';

type SelfOptions = EmptySelfOptions;
type SnackQuantitySoundPlayerOptions = SoundGeneratorOptions & SelfOptions;

// Constants
const SOUND_EFFECT_PLAYBACK_RATE_RANGE = new Range( 0.7071, 1.414 );
const CANDY_BAR_SOUND_EFFECT_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.7,
  rateChangesAffectPlayingSounds: false
};
const APPLE_SOUND_EFFECT_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 0.8,
  rateChangesAffectPlayingSounds: false
};

class SnackQuantitySoundPlayer extends SoundGenerator implements TSoundPlayer {

  // The quantity of snacks on the plate, used to adjust the pitch of the generated sound.
  private readonly snackQuantityProperty: TReadOnlyProperty<number>;

  // The sound effects (e.g. apple being sliced) that are played with other sounds to create a snack-specific sound.
  private readonly soundEffects: SoundClip[];

  // A record of the most recently played sound clip.
  private mostRecentlyPlayedSoundClip: SoundClip | null = null;

  public constructor( snackType: SnackType,
                      snackQuantityProperty: TReadOnlyProperty<number>,
                      providedOptions?: SnackQuantitySoundPlayerOptions ) {

    const options = optionize<SnackQuantitySoundPlayerOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0.2
    }, providedOptions );

    super( options );

    this.soundEffects = snackType === 'candyBars' ?
      [
        new SoundClip( candyBarWrapper01_mp3, CANDY_BAR_SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapper02_mp3, CANDY_BAR_SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapper03_mp3, CANDY_BAR_SOUND_EFFECT_OPTIONS )
      ] : [ new SoundClip( hollowThud_mp3, APPLE_SOUND_EFFECT_OPTIONS ) ];

    for ( const soundClip of this.soundEffects ) {
      soundClip.connect( this.mainGainNode );
    }

    // Make the quantity Property available to the methods.
    this.snackQuantityProperty = snackQuantityProperty;
  }

  public play(): void {

    let soundEffect = this.soundEffects[ 0 ];
    if ( this.soundEffects.length > 1 ) {
      const availableSoundEffects = this.mostRecentlyPlayedSoundClip ?
                                    _.without( this.soundEffects, this.mostRecentlyPlayedSoundClip ) :
                                    this.soundEffects;
      soundEffect = dotRandom.sample( availableSoundEffects );
    }

    soundEffect.setPlaybackRate(
      SnackQuantitySoundPlayer.getPlaybackRateForQuantity( this.snackQuantityProperty.value )
    );
    soundEffect.play();
    this.mostRecentlyPlayedSoundClip = soundEffect;
  }

  public stop(): void {
    this.soundEffects.forEach( soundEffect => soundEffect.stop() );
  }

  private static getPlaybackRateForQuantity( numberOfSnacksOnPlate: number ): number {
    const normalizedValue = numberOfSnacksOnPlate / MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE;
    assert && assert( normalizedValue >= 0 && normalizedValue <= 1, 'unexpected value' );
    return SOUND_EFFECT_PLAYBACK_RATE_RANGE.expandNormalizedValue( normalizedValue );
  }
}

meanShareAndBalance.register( 'SnackQuantitySoundPlayer', SnackQuantitySoundPlayer );

export default SnackQuantitySoundPlayer;