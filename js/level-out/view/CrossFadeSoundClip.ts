// Copyright 2024, University of Colorado Boulder

/**
 * CrossFadeSoundClip is a sound generator that combines two sound clips and allows the user to set the relative mix -
 * aka fade - between them.  This was created specifically for the needs of the Mean: Share and Balance simulation, and
 * has not been generalized for other uses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type CrossFadeSoundClipOptions = SoundGeneratorOptions & SelfOptions;

class CrossFadeSoundClip extends SoundGenerator implements TSoundPlayer {

  private readonly soundClipA: SoundClip;
  private readonly soundClipB: SoundClip;

  /**
   * @param wrappedAudioBufferA - audio buffer for sound A
   * @param wrappedAudioBufferB - audio buffer for sound A
   * @param crossFade - a number from 0 to 1, inclusive, where 0 indicates 100% sound A, 1 is 100% sound B, and other
   *                    values are proportionately in between
   * @param providedOptions
   */
  public constructor( wrappedAudioBufferA: WrappedAudioBuffer,
                      wrappedAudioBufferB: WrappedAudioBuffer,
                      crossFade: number,
                      providedOptions?: CrossFadeSoundClipOptions ) {

    assert && assert( crossFade >= 0 && crossFade <= 1, 'crossFade must be between 0 and 1 (inclusive)' );

    const options = optionize<CrossFadeSoundClipOptions, SelfOptions, SoundGeneratorOptions>()( {
      initialOutputLevel: 0.2
    }, providedOptions );

    super( options );

    this.soundClipA = new SoundClip( wrappedAudioBufferA, {
      initialOutputLevel: 1 - crossFade,
      rateChangesAffectPlayingSounds: false
    } );
    this.soundClipA.connect( this.soundSourceDestination );
    this.soundClipB = new SoundClip( wrappedAudioBufferB, {
      initialOutputLevel: crossFade,
      rateChangesAffectPlayingSounds: false
    } );
    this.soundClipB.connect( this.soundSourceDestination );
  }

  public play(): void {
    this.soundClipA.play();
    this.soundClipB.play();
  }

  public stop(): void {
    this.soundClipA.stop();
    this.soundClipB.stop();
  }

  public setPlaybackRate( playbackRate: number ): void {
    this.soundClipA.setPlaybackRate( playbackRate );
    this.soundClipB.setPlaybackRate( playbackRate );
  }

}

meanShareAndBalance.register( 'CrossFadeSoundClip', CrossFadeSoundClip );

export default CrossFadeSoundClip;