// Copyright 2024, University of Colorado Boulder

/**
 * BeamTiltSoundGenerator is a sound generator for balance beam.  It creates a sound somewhat like a creaking door, and
 * the pitch varies with the tilt angle of the beam.
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
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';

type SelfOptions = EmptySelfOptions;
type BeamTiltSoundGeneratorOptions = SoundGeneratorOptions & SelfOptions;

// constants
const MIN_TIME_BETWEEN_CREAK_PLAYS = 90; // in ms
const PITCH_VARIATION_RANGE = new Range( 1, 2 );
const EXPECTED_ANGLE_RANGE = new Range( 0, 0.45 ); // empirically determined based on model behavior

class BeamTiltSoundGenerator extends SoundGenerator {

  public constructor( beamTiltProperty: TReadOnlyProperty<number>,
                      meanValueProperty: TReadOnlyProperty<number | null>,
                      meanPredictionFulcrumValueProperty: TReadOnlyProperty<number>,
                      beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: BeamTiltSoundGeneratorOptions ) {

    super( providedOptions );

    const creakSoundClip = new SoundClip( boundaryReached_mp3, { rateChangesAffectPlayingSounds: false } );
    creakSoundClip.connect( this.mainGainNode );
    let timeOfLastPlay = Number.NEGATIVE_INFINITY;

    beamTiltProperty.lazyLink( tiltAngle => {
      if ( !ResetAllButton.isResettingAllProperty.value &&
           !beamSupportsPresentProperty.value &&
           phet.joist.elapsedTime > timeOfLastPlay + MIN_TIME_BETWEEN_CREAK_PLAYS &&
           meanValueProperty.value !== meanPredictionFulcrumValueProperty.value ) {

        // Calculate the playback rate (aka pitch) for the individual creak sound based on the beam's angle.
        const normalizedAngle = EXPECTED_ANGLE_RANGE.getNormalizedValue( Math.abs( tiltAngle ) );
        const playbackRate = PITCH_VARIATION_RANGE.expandNormalizedValue( normalizedAngle );
        creakSoundClip.setPlaybackRate( playbackRate, 0 );

        // Play the creak sound.
        creakSoundClip.play();

        // Record the time so that we can prevent the individual sounds from being played too often.
        timeOfLastPlay = phet.joist.elapsedTime;
      }
    } );
  }
}

meanShareAndBalance.register( 'BeamTiltSoundGenerator', BeamTiltSoundGenerator );

export default BeamTiltSoundGenerator;