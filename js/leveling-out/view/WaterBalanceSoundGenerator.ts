// Copyright 2024, University of Colorado Boulder

/**
 * TODO: Add docs, see https://github.com/phetsims/mean-share-and-balance/issues/171.
 *
 * @author John Blanco (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WrappedAudioBuffer from '../../../../tambo/js/WrappedAudioBuffer.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import soundConstants from '../../../../tambo/js/soundConstants.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';

type SelfOptions = {

  // time to wait before starting fade out if no activity, in seconds
  fadeStartDelay?: number;

  // duration of fade out, in seconds
  fadeTime?: number;

  // amount of time in seconds from full fade to stop of sound, done to avoid sonic glitches
  delayBeforeStop?: number;

  // If true, we will stop() when the sound is disabled. The stop uses the DEFAULT_LINEAR_GAIN_CHANGE_TIME as its delay
  // to match the fullyEnabledProperty link logic in SoundGenerator.
  stopOnDisabled?: boolean;
};
export type WaterBalanceSoundGeneratorOptions = SelfOptions & SoundClipOptions;

// constants
const CHANGE_THRESHOLD = 0.001;
const PLAYBACK_PITCH_RANGE = new Range( 0.5, 1 ); // 1 octave
const FILTER_FREQUENCY_RANGE = new Range( 100, 10000 );

class WaterBalanceSoundGenerator extends SoundClip {

  // duration of inactivity fade out
  private readonly fadeTime: number;

  // see docs in options type declaration
  private readonly delayBeforeStop: number;

  // the output level before fade out starts
  private readonly nonFadedOutputLevel: number;

  // countdown time used for fade out
  private remainingFadeTime: number;

  private readonly disposeWaterBalanceSoundGenerator: () => void;

  public constructor( meanProperty: TReadOnlyProperty<number>,
                      cupLevelProperty: TReadOnlyProperty<number>,
                      sound: WrappedAudioBuffer,
                      providedOptions?: WaterBalanceSoundGeneratorOptions ) {

    assert && assert(
      !providedOptions || !providedOptions.loop,
      'loop option should be supplied by WaterBalanceSoundGenerator'
    );

    // Create the filter whose frequency will be adjusted based on the overall distance of the cup levels from the mean.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext, {
      type: 'lowpass',
      Q: 1,
      frequency: 100
    } );

    const options = optionize<WaterBalanceSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      initialOutputLevel: 0.1,
      loop: true,
      trimSilence: true,
      fadeStartDelay: 0.2,
      fadeTime: 0.15,
      delayBeforeStop: 0.1,
      stopOnDisabled: false,
      additionalAudioNodes: [ lowPassFilter ],

      // By default, sound production is disabled during "reset all" operations.
      enableControlProperties: [ DerivedProperty.not( ResetAllButton.isResettingAllProperty ) ]
    }, providedOptions );

    super( sound, options );

    this.fadeTime = options.fadeTime;
    this.delayBeforeStop = options.delayBeforeStop;
    this.nonFadedOutputLevel = options.initialOutputLevel === undefined ? 1 : options.initialOutputLevel;
    this.remainingFadeTime = 0;

    // start with the output level at zero so that the initial sound generation has a bit of fade in
    this.setOutputLevel( 0, 0 );

    // Adjust the pitch based on the mean.
    meanProperty.link( mean => {
      const normalizedValue = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE.getNormalizedValue( mean );
      const playbackRate = PLAYBACK_PITCH_RANGE.expandNormalizedValue( normalizedValue );
      this.setPlaybackRate( playbackRate );
    } );

    // A listener that starts the sound when the level of one or more of the water glasses change.
    const levelChangeListener = ( value: number, oldValue: number | null ) => {

      const delta = value - ( oldValue === null ? 0 : oldValue );

      // Update the sound generation when the value changes, but only if we enabled. This prevents the play() from
      // occurring at all.
      if ( this.fullyEnabled && Math.abs( delta ) > CHANGE_THRESHOLD ) {

        this.setOutputLevel( this.nonFadedOutputLevel );
        if ( !this.isPlaying && !isSettingPhetioStateProperty.value ) {
          this.play();
        }

        // Reset the fade countdown.
        this.remainingFadeTime = options.fadeStartDelay + options.fadeTime + this.delayBeforeStop;

        // Set the filter frequency based on how far the cups are from the mean.  The frequency range and calculation
        // used here were empirically determined and can be adjusted if needed.
        const distanceFromMean = Math.abs( value - meanProperty.value );
        assert && assert( distanceFromMean >= 0 && distanceFromMean <= 1, 'wait, how can this happen?' );
        const filterFrequency = FILTER_FREQUENCY_RANGE.expandNormalizedValue( Math.pow( 1 - distanceFromMean, 10 ) );
        lowPassFilter.frequency.cancelScheduledValues( 0 );
        lowPassFilter.frequency.setTargetAtTime( filterFrequency, 0, 0.015 );
      }
    };
    cupLevelProperty.lazyLink( levelChangeListener );

    if ( options.stopOnDisabled ) {
      this.fullyEnabledProperty.lazyLink( enabled => {
        !enabled && this.stop( soundConstants.DEFAULT_LINEAR_GAIN_CHANGE_TIME );
      } );
    }

    const stepListener = ( dt: number ) => this.step( dt );
    stepTimer.addListener( stepListener );

    // dispose function
    this.disposeWaterBalanceSoundGenerator = () => {
      meanProperty.unlink( levelChangeListener );
      stepTimer.removeListener( stepListener );
    };
  }

  public override dispose(): void {
    this.disposeWaterBalanceSoundGenerator();
    super.dispose();
  }

  /**
   * Step this sound generator, used for fading out the sound in the absence of change.
   * @param dt - change in time (i.e. delta time) in seconds
   */
  private step( dt: number ): void {

    if ( this.remainingFadeTime > 0 ) {
      this.remainingFadeTime = Math.max( this.remainingFadeTime - dt, 0 );

      if ( ( this.remainingFadeTime < this.fadeTime + this.delayBeforeStop ) && this.outputLevel > 0 ) {

        // the sound is fading out, adjust the output level
        const outputLevel = Math.max( ( this.remainingFadeTime - this.delayBeforeStop ) / this.fadeTime, 0 );
        this.setOutputLevel( outputLevel * this.nonFadedOutputLevel );
      }

      // fade out complete, stop playback
      if ( this.remainingFadeTime === 0 && this.isPlaying ) {
        this.stop( 0 );
      }
    }
  }

  /**
   * stop any in-progress sound generation
   */
  public reset(): void {
    this.stop( 0 );
    this.remainingFadeTime = 0;
  }
}

meanShareAndBalance.register( 'WaterBalanceSoundGenerator', WaterBalanceSoundGenerator );

export default WaterBalanceSoundGenerator;