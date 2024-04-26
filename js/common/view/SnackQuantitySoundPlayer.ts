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
import CrossFadeSoundClip from '../../level-out/view/CrossFadeSoundClip.js';
import glassLevelSoundA_mp3 from '../../../sounds/glassLevelSoundA_mp3.js';
import glassLevelSoundB_mp3 from '../../../sounds/glassLevelSoundB_mp3.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import candyBarWrapper01_mp3 from '../../../sounds/candyBarWrapper01_mp3.js';
import candyBarWrapper03_mp3 from '../../../sounds/candyBarWrapper03_mp3.js';
import candyBarWrapper02_mp3 from '../../../sounds/candyBarWrapper02_mp3.js';
import appleBeingSliced01_mp3 from '../../../sounds/appleBeingSliced01_mp3.js';
import appleBeingSliced02_mp3 from '../../../sounds/appleBeingSliced02_mp3.js';
import appleBeingSliced03_mp3 from '../../../sounds/appleBeingSliced03_mp3.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import candyBarWrapperWithTone01_mp3 from '../../../sounds/candyBarWrapperWithTone01_mp3.js';
import appleBeingSlicedWithTone01_mp3 from '../../../sounds/appleBeingSlicedWithTone01_mp3.js';
import candyBarWrapperWithTone02_mp3 from '../../../sounds/candyBarWrapperWithTone02_mp3.js';
import candyBarWrapperWithTone03_mp3 from '../../../sounds/candyBarWrapperWithTone03_mp3.js';
import appleBeingSlicedWithTone02_mp3 from '../../../sounds/appleBeingSlicedWithTone02_mp3.js';
import appleBeingSlicedWithTone03_mp3 from '../../../sounds/appleBeingSlicedWithTone03_mp3.js';
import Range from '../../../../dot/js/Range.js';
import MeanShareAndBalanceQueryParameters from '../MeanShareAndBalanceQueryParameters.js';

type SelfOptions = EmptySelfOptions;
type SnackQuantitySoundPlayerOptions = SoundGeneratorOptions & SelfOptions;

// TODO: Temporary type and constant for comparing possible sounds, see https://github.com/phetsims/mean-share-and-balance/issues/203;
type SoundGenerationMode = 'baseToneWithSoundEffect' | 'pitchedBasicSoundEffect' | 'pitchedSoundEffectWithTone';
const SOUND_EFFECT_PLAYBACK_RATE_RANGE = new Range( 0.7071, 1.414 );
const SOUND_EFFECT_OPTIONS: SoundClipOptions = {
  initialOutputLevel: 1,
  rateChangesAffectPlayingSounds: false
};

class SnackQuantitySoundPlayer extends SoundGenerator implements TSoundPlayer {

  // The "base sound" that is pitched and cross-faded to sound slightly different based on the plate index.
  private readonly crossFadeSoundClip: CrossFadeSoundClip;

  // The quantity of snacks on the plate, used to adjust the pitch of the generated sound.
  private readonly snackQuantityProperty: TReadOnlyProperty<number>;

  // The sound effects (e.g. apple being sliced) that are played with other sounds to create a snack-specific sound.
  private readonly soundEffects: SoundClip[];

  // TODO: Temporary for testing out sounds, see https://github.com/phetsims/mean-share-and-balance/issues/203.
  private readonly soundGenerationMode: SoundGenerationMode;

  private readonly soundEffectsWithHiddenTone: SoundClip[];

  // A record of the most recently played sound clip.
  private mostRecentlyPlayedSoundClip: SoundClip | null = null;

  public constructor( snackType: SnackType,
                      snackQuantityProperty: TReadOnlyProperty<number>,
                      plateIndex: number,
                      providedOptions?: SnackQuantitySoundPlayerOptions ) {

    const options = optionize<SnackQuantitySoundPlayerOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0.2
    }, providedOptions );

    super( options );

    if ( MeanShareAndBalanceQueryParameters.snackSound === 0 ) {
      this.soundGenerationMode = 'baseToneWithSoundEffect';
    }
    else if ( MeanShareAndBalanceQueryParameters.snackSound === 1 ) {
      this.soundGenerationMode = 'pitchedBasicSoundEffect';
    }
    else {
      this.soundGenerationMode = 'pitchedSoundEffectWithTone';
    }

    this.crossFadeSoundClip = new CrossFadeSoundClip(
      glassLevelSoundA_mp3,
      glassLevelSoundB_mp3,
      ( plateIndex + 1 ) / MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS,
      {
        initialOutputLevel: 0.5 // lower relative to the sound effect
      }
    );
    this.crossFadeSoundClip.connect( this.mainGainNode );

    this.soundEffects = snackType === 'candyBars' ?
      [
        new SoundClip( candyBarWrapper01_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapper02_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapper03_mp3, SOUND_EFFECT_OPTIONS )
      ] :
      [
        new SoundClip( appleBeingSliced01_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( appleBeingSliced02_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( appleBeingSliced03_mp3, SOUND_EFFECT_OPTIONS )
      ];

    for ( const soundClip of this.soundEffects ) {
      soundClip.connect( this.mainGainNode );
    }

    this.soundEffectsWithHiddenTone = snackType === 'candyBars' ?
      [
        new SoundClip( candyBarWrapperWithTone01_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapperWithTone02_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( candyBarWrapperWithTone03_mp3, SOUND_EFFECT_OPTIONS )
      ] :
      [
        new SoundClip( appleBeingSlicedWithTone01_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( appleBeingSlicedWithTone02_mp3, SOUND_EFFECT_OPTIONS ),
        new SoundClip( appleBeingSlicedWithTone03_mp3, SOUND_EFFECT_OPTIONS )
      ];

    for ( const soundClip of this.soundEffectsWithHiddenTone ) {
      soundClip.connect( this.mainGainNode );
    }

    // Adjust the playback rate of the sound based on the quantity of snacks.
    snackQuantityProperty.link( numberOfSnacks => {
      this.crossFadeSoundClip.setPlaybackRate(
        1 + numberOfSnacks / MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE
      );
    } );

    // Make the quantity Property available to the methods.
    this.snackQuantityProperty = snackQuantityProperty;
  }

  public play(): void {
    if ( this.soundGenerationMode === 'baseToneWithSoundEffect' ) {
      this.crossFadeSoundClip.play();
      const availableSoundEffects = this.mostRecentlyPlayedSoundClip ?
                                    _.without( this.soundEffects, this.mostRecentlyPlayedSoundClip ) :
                                    this.soundEffects;
      const soundEffect = dotRandom.sample( availableSoundEffects );
      if ( soundEffect ) {
        soundEffect.play();
        this.mostRecentlyPlayedSoundClip = soundEffect;
      }
    }
    else if ( this.soundGenerationMode === 'pitchedBasicSoundEffect' ) {
      const availableSoundEffects = this.mostRecentlyPlayedSoundClip ?
                                    _.without( this.soundEffects, this.mostRecentlyPlayedSoundClip ) :
                                    this.soundEffects;
      const soundEffect = dotRandom.sample( availableSoundEffects );
      if ( soundEffect ) {
        soundEffect.setPlaybackRate(
          SnackQuantitySoundPlayer.getPlaybackRateForQuantity( this.snackQuantityProperty.value )
        );
        soundEffect.play();
        this.mostRecentlyPlayedSoundClip = soundEffect;
      }
    }
    else if ( this.soundGenerationMode === 'pitchedSoundEffectWithTone' ) {
      const availableSoundEffects = this.mostRecentlyPlayedSoundClip ?
                                    _.without( this.soundEffectsWithHiddenTone, this.mostRecentlyPlayedSoundClip ) :
                                    this.soundEffects;
      const soundEffectWithHiddenTone = dotRandom.sample( availableSoundEffects );

      if ( soundEffectWithHiddenTone ) {
        soundEffectWithHiddenTone.setPlaybackRate(
          SnackQuantitySoundPlayer.getPlaybackRateForQuantity( this.snackQuantityProperty.value )
        );
        soundEffectWithHiddenTone.play();
        this.mostRecentlyPlayedSoundClip = soundEffectWithHiddenTone;
      }
    }
  }

  public stop(): void {
    this.crossFadeSoundClip.stop();
  }

  private static getPlaybackRateForQuantity( numberOfSnacksOnPlate: number ): number {
    const normalizedValue = numberOfSnacksOnPlate / MeanShareAndBalanceConstants.MAX_NUMBER_OF_SNACKS_PER_PLATE;
    assert && assert( normalizedValue >= 0 && normalizedValue <= 1, 'unexpected value' );
    return SOUND_EFFECT_PLAYBACK_RATE_RANGE.expandNormalizedValue( normalizedValue );
  }
}

meanShareAndBalance.register( 'SnackQuantitySoundPlayer', SnackQuantitySoundPlayer );

export default SnackQuantitySoundPlayer;