// Copyright 2024, University of Colorado Boulder

/**
 * NumberSpinnerSoundPlayer plays customs sounds for the intro and sharing screens number spinners.
 * The pitch of the sound is determined by the value of the number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import Property from '../../../../axon/js/Property.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';

export default class NumberSpinnerSoundPlayer {
  private readonly soundClip: SoundClip;

  public constructor( public readonly numberProperty: Property<number>,
                      sound: WrappedAudioBuffer ) {
    this.soundClip = new SoundClip( sound );

    soundManager.addSoundGenerator( this.soundClip );
  }

  private toPlaybackRate( value: number ): number {
    assert && assert( value >= 0 && value <= 18, `value ${value} is out of range` );
    const step =
      value === 1 ? -2 :
      value === 2 ? -1 :
      value === 3 ? 0 :
      value === 4 ? 1 :
      value === 5 ? 2 :
      value === 6 ? 3 :
      value === 7 ? 4 :
      -1;

    return Math.pow( 2, step / 12 );
  }

  public play(): void {
    const playbackRate = this.toPlaybackRate( this.numberProperty.value );
    this.soundClip.setPlaybackRate( playbackRate );
    this.soundClip.play();
  }

  public stop(): void {
    this.soundClip.stop();
  }
}

meanShareAndBalance.register( 'NumberSpinnerSoundPlayer', NumberSpinnerSoundPlayer );