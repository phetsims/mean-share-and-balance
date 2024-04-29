// Copyright 2024, University of Colorado Boulder

/**
 * Sound generator for the water cup levels.  The pitch of the tone is scaled based on the mean value of all the cups,
 * and a lowpass filter is applied that passes more frequencies as the cups get closer to the mean value and less as
 * they get further away.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import SoundClip, { SoundClipOptions } from '../../../../tambo/js/sound-generators/SoundClip.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import stepTimer from '../../../../axon/js/stepTimer.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import phetAudioContext from '../../../../tambo/js/phetAudioContext.js';
import Cup from '../model/Cup.js';
import waterBalanceFluteChordLoop_mp3 from '../../../sounds/waterBalanceFluteChordLoop_mp3.js';
import Multilink from '../../../../axon/js/Multilink.js';

type SelfOptions = {

  // time to wait before starting fade out if no activity, in seconds
  fadeStartDelay?: number;

  // duration of fade out, in seconds
  fadeTime?: number;

  // amount of time in seconds from full fade to stop of sound, done to avoid sonic glitches
  delayBeforeStop?: number;
};
export type WaterBalanceSoundGeneratorOptions = SelfOptions & SoundClipOptions;

// constants
const MEAN_DEVIATION_CHANGE_THRESHOLD = 0.001; // empirically determined
const PLAYBACK_PITCH_RANGE = new Range( 0.5, 1.3 ); // empirically determined to get desired behavior

// The NOMINAL_CENTER_FREQUENCY value is used to set the value of the cutoff filter, and should be the frequency where
// the most energy is present in the supplied sound.  This will need adjustment if the underlying sound is changed.
const NOMINAL_CENTER_FREQUENCY = 800;

class WaterBalanceSoundGenerator extends SoundClip {

  // duration of inactivity fade out
  private readonly fadeOutTime: number;

  // see docs in options type declaration
  private readonly fadeStartDelay: number;

  // see docs in options type declaration
  private readonly delayBeforeStop: number;

  // the output level before fade out starts
  private readonly nonFadedOutputLevel: number;

  // countdown time used for fade out
  private remainingFadeOutTime: number;

  private readonly disposeWaterBalanceSoundGenerator: () => void;

  public constructor( meanProperty: TReadOnlyProperty<number>,
                      cups: Cup[],
                      arePipesOpenProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: WaterBalanceSoundGeneratorOptions ) {

    assert && assert(
      !providedOptions || !providedOptions.loop,
      'loop option should be supplied by WaterBalanceSoundGenerator'
    );

    // Create the filter whose frequency will be adjusted based on the max deviation of the cup levels from the mean.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext, {
      type: 'lowpass',
      Q: 5,
      frequency: 100 // arbitrary initial value - this is adjusted as water levels change
    } );

    const options = optionize<WaterBalanceSoundGeneratorOptions, SelfOptions, SoundClipOptions>()( {
      loop: true,
      trimSilence: true,
      fadeStartDelay: 0.1,
      fadeTime: 0.1,
      delayBeforeStop: 0.1,
      additionalAudioNodes: [ lowPassFilter ],

      // By default, sound production is disabled during "reset all" operations.
      enableControlProperties: [ DerivedProperty.not( ResetAllButton.isResettingAllProperty ) ]
    }, providedOptions );

    super( waterBalanceFluteChordLoop_mp3, options );

    // Initialize the variable that will be used to fade the sound in and out.
    this.fadeStartDelay = options.fadeStartDelay;
    this.fadeOutTime = options.fadeTime;
    this.delayBeforeStop = options.delayBeforeStop;
    this.nonFadedOutputLevel = options.initialOutputLevel === undefined ? 1 : options.initialOutputLevel;
    this.remainingFadeOutTime = 0;

    // Start with the output level at zero so that the initial sound can fade in.
    this.setOutputLevel( 0, 0 );

    let previousMaxDeviationFromMean = 0;

    const multilink = Multilink.multilinkAny(
      [
        ...cups.map( cup => cup.waterLevelProperty ),
        ...cups.map( cup => cup.isActiveProperty ),
        meanProperty
      ],
      () => {

        // Adjust the playback rate, and thus the pitch, of the underlying sound based on the mean value.
        const normalizedValue = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE.getNormalizedValue( meanProperty.value );
        const playbackRate = PLAYBACK_PITCH_RANGE.expandNormalizedValue( normalizedValue );
        if ( this.playbackRate !== playbackRate ) {
          this.setPlaybackRate( playbackRate );
        }

        // Determine which cup is most different from the mean and what the amount of that difference is.
        const activeCups = cups.filter( cup => cup.isActiveProperty.value );
        const maxDeviationFromMean = activeCups.reduce(
          ( previousMax, currentCup ) => Math.max(
            previousMax,
            Math.abs( currentCup.waterLevelProperty.value - meanProperty.value )
          ),
          0
        );

        const deltaMaxDeviationFromMean = maxDeviationFromMean - previousMaxDeviationFromMean;

        if ( this.fullyEnabled && Math.abs( deltaMaxDeviationFromMean ) > MEAN_DEVIATION_CHANGE_THRESHOLD ) {

          // If we are already playing sound when this change occurred, continue it.  If we aren't but the change
          // occurred with the pipes open, start producing sound.
          if ( this.isPlaying || arePipesOpenProperty.value ) {
            this.startOrContinueSoundProduction();
          }

          // Set the cutoff frequency of the lowpass filter based on the mean and the max deviation from it.  The intent
          // here is to produce a more filtered sound when far from the mean, and less filtered when all cups are close
          // to it.

          const filterFrequencyRange = new Range(
            playbackRate * NOMINAL_CENTER_FREQUENCY / 2,
            10000
          );
          const filterFrequency = filterFrequencyRange.expandNormalizedValue(

            // The exponent in the calculation below was empirically determined.  Higher values make the effect of the
            // filter more obvious more quickly, so audible differences can be heard for smaller deviations from the
            // mean.  Smaller values of the exponent spread the audible change out over the range more evenly.
            Math.pow( 1 - maxDeviationFromMean, 10 )
          );
          lowPassFilter.frequency.cancelScheduledValues( 0 );
          lowPassFilter.frequency.setTargetAtTime( filterFrequency, 0, 0.015 );
        }

        // Update the history for the next pass.
        previousMaxDeviationFromMean = maxDeviationFromMean;
      }
    );

    // Initiate sound production any time the pipes are opened or closed.
    arePipesOpenProperty.lazyLink( () => {
      this.startOrContinueSoundProduction();
    } );

    // Hook up the step listener that will fade out the sound after a certain amount of inactivity.
    const stepListener = ( dt: number ) => this.step( dt );
    stepTimer.addListener( stepListener );

    // dispose function
    this.disposeWaterBalanceSoundGenerator = () => {
      multilink.dispose();
      stepTimer.removeListener( stepListener );
    };
  }

  /**
   * Start the sound production if it's not already happening, or cause it to continue if already playing by resetting
   * the amount of remaining fade time.
   */
  private startOrContinueSoundProduction(): void {
    this.setOutputLevel( this.nonFadedOutputLevel );
    if ( !this.isPlaying && !isSettingPhetioStateProperty.value ) {
      this.play();
    }

    // Reset the fade countdown to its max value.
    this.remainingFadeOutTime = this.fadeStartDelay + this.fadeOutTime + this.delayBeforeStop;
  }

  /**
   * Step this sound generator, which will fade out the sound over time if remainingFadeOutTime isn't increased.
   * @param dt - change in time (i.e. delta time) in seconds
   */
  private step( dt: number ): void {

    if ( this.remainingFadeOutTime > 0 ) {
      this.remainingFadeOutTime = Math.max( this.remainingFadeOutTime - dt, 0 );

      if ( ( this.remainingFadeOutTime < this.fadeOutTime + this.delayBeforeStop ) && this.outputLevel > 0 ) {

        // The sound is fading out - adjust the output level downwards.
        const outputLevel = Math.max( ( this.remainingFadeOutTime - this.delayBeforeStop ) / this.fadeOutTime, 0 );
        this.setOutputLevel( outputLevel * this.nonFadedOutputLevel );
      }

      // Fade out complete, stop playback.
      if ( this.remainingFadeOutTime === 0 && this.isPlaying ) {
        this.stop( 0 );
      }
    }
  }

  /**
   * Stop any in-progress sound generation.
   */
  public reset(): void {
    this.stop( 0 );
    this.remainingFadeOutTime = 0;
  }

  /**
   * Release any potentially leak-inducing references.
   */
  public override dispose(): void {
    this.disposeWaterBalanceSoundGenerator();
    super.dispose();
  }
}

meanShareAndBalance.register( 'WaterBalanceSoundGenerator', WaterBalanceSoundGenerator );

export default WaterBalanceSoundGenerator;