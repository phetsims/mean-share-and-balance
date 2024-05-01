// Copyright 2024, University of Colorado Boulder

/**
 * BeamTiltSoundGenerator is a sound generator for the angle of tilt of the balance beam.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import SoundGenerator, { SoundGeneratorOptions } from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import boundaryReached_mp3 from '../../../../tambo/sounds/boundaryReached_mp3.js';
import Range from '../../../../dot/js/Range.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';
import generalSoftClick_mp3 from '../../../../tambo/sounds/generalSoftClick_mp3.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';

type SelfOptions = EmptySelfOptions;
type BeamTiltSoundGeneratorOptions = SoundGeneratorOptions & SelfOptions;

class BeamTiltSoundGenerator extends SoundGenerator {

  public constructor( beamTiltProperty: TReadOnlyProperty<number>,
                      providedOptions?: BeamTiltSoundGeneratorOptions ) {

    super( providedOptions );

    let audioBuffer;
    if ( MeanShareAndBalanceQueryParameters.beamSoundMode === 4 ) {
      audioBuffer = boundaryReached_mp3;
    }
    else {
      audioBuffer = generalSoftClick_mp3;
    }
    const soundClip = new SoundClip( audioBuffer, { rateChangesAffectPlayingSounds: false } );
    soundClip.connect( this.mainGainNode );
    let timeOfLastPlay = Number.NEGATIVE_INFINITY;
    const minTimeBetweenPlays = 50;
    const pitchVariationRange = new Range( 1, 2 );
    const expectedAngleRange = new Range( 0, 0.45 );
    beamTiltProperty.lazyLink( tiltAngle => {
      if ( !ResetAllButton.isResettingAllProperty.value &&
           phet.joist.elapsedTime > timeOfLastPlay + minTimeBetweenPlays ) {

        const normalizedAngle = expectedAngleRange.getNormalizedValue( Math.abs( tiltAngle ) );
        const playbackRate = pitchVariationRange.expandNormalizedValue( normalizedAngle );
        soundClip.setPlaybackRate( playbackRate, 0 );
        soundClip.play();
        timeOfLastPlay = phet.joist.elapsedTime;
      }
    } );
  }
}

meanShareAndBalance.register( 'BeamTiltSoundGenerator', BeamTiltSoundGenerator );

export default BeamTiltSoundGenerator;