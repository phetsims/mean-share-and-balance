// Copyright 2024, University of Colorado Boulder

/**
 * DualSoundClip is a sound generator that combines two sound clips and allows the user to set the relative mix between
 * them.  This was created specifically for the needs of the Mean: Share and Balance simulation, and has not been
 * generalized for other uses.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';

class DualSoundClip extends SoundGenerator implements TSoundPlayer {

  private readonly soundClipA: SoundClip;
  private readonly soundClipB: SoundClip;

  public constructor( wrappedAudioBufferA: WrappedAudioBuffer, wrappedAudioBufferB: WrappedAudioBuffer, crossMix: number ) {

    assert && assert( crossMix >= 0 && crossMix <= 1, 'crossMix must be between 0 and 1 (inclusive)' );

    super();

    this.soundClipA = new SoundClip( wrappedAudioBufferA, {
      initialOutputLevel: 1 - crossMix,
      rateChangesAffectPlayingSounds: false
    } );
    this.soundClipA.connect( this.soundSourceDestination );
    this.soundClipB = new SoundClip( wrappedAudioBufferB, {
      initialOutputLevel: crossMix,
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

meanShareAndBalance.register( 'DualSoundClip', DualSoundClip );

export default DualSoundClip;