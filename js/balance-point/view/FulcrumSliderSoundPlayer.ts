// Copyright 2024, University of Colorado Boulder

/**
 * FulcrumSliderSoundPlayer is used to produce sounds when the fulcrum beneath the balance beam is moved by the user.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ValueChangeSoundPlayer, { ValueChangeSoundPlayerOptions } from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import brightMarimbaShort_mp3 from '../../../../tambo/sounds/brightMarimbaShort_mp3.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import boundaryReached_mp3 from '../../../../tambo/sounds/boundaryReached_mp3.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';

type SelfOptions = EmptySelfOptions;
type FulcrumSliderSoundPlayerOptions = SelfOptions & ValueChangeSoundPlayerOptions;

const MIN_TIME_BETWEEN_SOUNDS = 0.08; // in seconds
const MAX_POSSIBLE_DISTANCE_FROM_MEAN = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength();
const PITCH_VARIATION_RANGE = new Range( 1, 1.5 );

// TODO: If we use PARTIAL_TILT_SPAN it should be made available from BalancePointSceneModel, see https://github.com/phetsims/mean-share-and-balance/issues/216.
const PARTIAL_TILT_SPAN = 0.5;

class FulcrumSliderSoundPlayer extends ValueChangeSoundPlayer {

  private readonly soundClip: SoundClip;
  private timeOfLastPlay = Number.NEGATIVE_INFINITY;
  private valueAtLastPlay;

  public constructor( private readonly fulcrumValueProperty: Property<number>,
                      private readonly beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
                      private readonly meanValueProperty: TReadOnlyProperty<number | null>,
                      providedOptions?: ValueChangeSoundPlayerOptions ) {

    const options = optionize<FulcrumSliderSoundPlayerOptions, SelfOptions, ValueChangeSoundPlayerOptions>()( {
      numberOfMiddleThresholds: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength() * 2 - 1
    }, providedOptions );

    super( new Property( MeanShareAndBalanceConstants.SOCCER_BALL_RANGE ), options );

    this.valueAtLastPlay = fulcrumValueProperty.value;

    // Create a sound clip to use for movement of the fulcrum when the pillars are off and one or more balls are present
    // on the beam.
    if ( MeanShareAndBalanceQueryParameters.beamSoundMode === 0 || MeanShareAndBalanceQueryParameters.beamSoundMode === 1 ) {
      this.soundClip = new SoundClip( brightMarimbaShort_mp3, {
        initialOutputLevel: 0.1,
        rateChangesAffectPlayingSounds: false
      } );
    }
    else {
      this.soundClip = new SoundClip( boundaryReached_mp3, {
        initialOutputLevel: 0.4,
        rateChangesAffectPlayingSounds: false
      } );
    }

    // Add the sound clip to sound manager ourself.
    soundManager.addSoundGenerator( this.soundClip );
  }

  /**
   * Override the playSoundIfThresholdReached method so that different sounds can be produced when pillars are gone.
   */
  public override playSoundIfThresholdReached( newValue: number, oldValue: number ): void {

    // Use the default sound production method when the beams are present or if there are no balls on the beam.
    if ( this.beamSupportsPresentProperty.value || this.meanValueProperty.value === null ) {
      super.playSoundIfThresholdReached( newValue, oldValue );
    }
    else if ( this.meanValueProperty ) {

      // convenience variable
      const mean = this.meanValueProperty.value;

      // Play the "success" sound whenever the mean is reached or crossed regardless of the timing.
      if ( this.valueAtLastPlay < mean && newValue >= mean || this.valueAtLastPlay > mean && newValue <= mean ) {
        this.soundClip.setPlaybackRate( 2, 0 );
        this.soundClip.play();
        this.timeOfLastPlay = phet.joist.elapsedTime;
        this.valueAtLastPlay = newValue;
      }
      else if ( newValue !== this.valueAtLastPlay &&
                phet.joist.elapsedTime > this.timeOfLastPlay + MIN_TIME_BETWEEN_SOUNDS * 1000 ) {

        if ( MeanShareAndBalanceQueryParameters.beamSoundMode === 0 ||
             MeanShareAndBalanceQueryParameters.beamSoundMode === 2 ) {

          // Adjust the pitch in a linear fashion based on distance from the mean.
          const normalizedDistanceFromMean = Math.abs( this.fulcrumValueProperty.value - this.meanValueProperty.value ) /
                                             MAX_POSSIBLE_DISTANCE_FROM_MEAN;
          let playbackRate;
          if ( Utils.equalsEpsilon( normalizedDistanceFromMean, 0, 0.005 ) ) {
            playbackRate = 2;
          }
          else {
            playbackRate = PITCH_VARIATION_RANGE.expandNormalizedValue( 1 - normalizedDistanceFromMean );
          }
          this.soundClip.setPlaybackRate( playbackRate, 0 );
          this.soundClip.play();
        }
        else {

          // Play the nominal pitch outside the partial tilt span, then higher pitches within this span, with the
          // highest in the middle.
          let playbackRate;
          const distanceFromMean = Math.abs( this.fulcrumValueProperty.value - this.meanValueProperty.value );
          if ( distanceFromMean > PARTIAL_TILT_SPAN ) {
            playbackRate = 1;
          }
          else {
            playbackRate = PITCH_VARIATION_RANGE.expandNormalizedValue( 1 - ( distanceFromMean / PARTIAL_TILT_SPAN ) );
          }
          this.soundClip.setPlaybackRate( playbackRate, 0 );
          this.soundClip.play();
        }

        this.timeOfLastPlay = phet.joist.elapsedTime;
        this.valueAtLastPlay = newValue;
      }
    }
  }
}

meanShareAndBalance.register( 'FulcrumSliderSoundPlayer', FulcrumSliderSoundPlayer );

export default FulcrumSliderSoundPlayer;