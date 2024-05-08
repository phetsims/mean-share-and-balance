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
import Utils from '../../../../dot/js/Utils.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import soundConstants from '../../../../tambo/js/soundConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // time to wait before starting fade out if no activity, in seconds
  fadeStartDelay?: number;

  // duration of fade out, in seconds
  fadeTime?: number;

  // amount of time in seconds from full fade to stop of sound, done to avoid sonic glitches
  delayBeforeStop?: number;
};
export type WaterBalanceSoundGeneratorOptions = SelfOptions & StrictOmit<SoundClipOptions, 'loop'>;

// constants
const MEAN_DEVIATION_CHANGE_THRESHOLD = 0.001; // empirically determined
const PLAYBACK_PITCH_RANGE = new Range( 0.5, 1.3 ); // empirically determined to get the specified behavior
const FILTER_FREQUENCY_RANGE = new Range( 200, 12000 );
const MAPPING_FUNCTION_POINT_1 = new Vector2( 0.4, 0.85 );
const MAPPING_FUNCTION_POINT_2 = new Vector2( 0.55, 0.1 );
const SMALLER_DEVIATION_LINEAR_FUNCTION = new LinearFunction(
  0,
  MAPPING_FUNCTION_POINT_1.x,
  1,
  MAPPING_FUNCTION_POINT_1.y
);
const LARGER_DEVIATION_LINEAR_FUNCTION = new LinearFunction(
  MAPPING_FUNCTION_POINT_2.x,
  1,
  MAPPING_FUNCTION_POINT_2.y,
  0
);
const MID_RANGE_DEVIATION_LINEAR_FUNCTION = new LinearFunction(
  MAPPING_FUNCTION_POINT_1.x,
  MAPPING_FUNCTION_POINT_2.x,
  MAPPING_FUNCTION_POINT_1.y,
  MAPPING_FUNCTION_POINT_2.y
);

// Verify that the point definitions from which the mapping function will be built are actually usable.
assert && assert(
MAPPING_FUNCTION_POINT_1.x > 0 &&
MAPPING_FUNCTION_POINT_1.x < MAPPING_FUNCTION_POINT_2.x &&
MAPPING_FUNCTION_POINT_1.y >= 0 &&
MAPPING_FUNCTION_POINT_1.y <= 1,
  'mapping function 1 does not appear to be usable, please check'
);
assert && assert(
MAPPING_FUNCTION_POINT_2.x > MAPPING_FUNCTION_POINT_1.x &&
MAPPING_FUNCTION_POINT_2.x < 1 &&
MAPPING_FUNCTION_POINT_2.y >= 0 &&
MAPPING_FUNCTION_POINT_2.y <= 1,
  'mapping function 2 does not appear to be usable, please check'
);

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
                      tableCups: Cup[],
                      notepadCups: Cup[],
                      arePipesOpenProperty: TReadOnlyProperty<boolean>,
                      providedOptions?: WaterBalanceSoundGeneratorOptions ) {

    // Create the filter whose frequency will be adjusted based on the max deviation of the cup levels from the mean.
    const lowPassFilter = new BiquadFilterNode( phetAudioContext, {
      type: 'lowpass',
      Q: 10,
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

    // Set up a listener that will update the max possible deviation from the mean when changes occur.
    let maxPossibleDeviationFromMean = 1;
    const updateMaxPossibleDeviation = ( mean: number ) => {

      // Compute the maximum possible deviation from the mean based on the table cups.  This identifies the value in
      // the cup that is furthest from the mean and calculates the difference.
      const activeCups = tableCups.filter( cup => cup.isActiveProperty.value );
      maxPossibleDeviationFromMean = activeCups.reduce(
        ( previousMax, currentCup ) => Math.max(
          previousMax,
          Math.abs( currentCup.waterLevelProperty.value - mean )
        ),
        0
      );

      assert && assert( maxPossibleDeviationFromMean >= 0 && maxPossibleDeviationFromMean <= 1,
        'the max possible deviation for a single cup from the mean should be between 0 and 1'
      );
    };
    meanProperty.link( updateMaxPossibleDeviation );

    // Create a closure function that maps the current max deviation from the mean for the notepad cups to a cutoff
    // frequency for the lowpass filter.  This uses a piecewise function defined by two points in a unit square.  It's
    // hard to describe in a comment, so please see
    // https://github.com/phetsims/mean-share-and-balance/issues/171#issuecomment-2099127519, which includes a diagram.
    const getFrequencyFromMaxDeviationFromMean = ( deviationFromMean: number ) => {

      // Scale the provided deviation value versus the max possible in the current state.
      const scaledDeviation = maxPossibleDeviationFromMean > 0 ?
                              Utils.clamp( deviationFromMean / maxPossibleDeviationFromMean, 0, 1 ) :
                              0;

      // Use the appropriate piece of the piecewise mapping function to come up with a normalized frequency value
      // between 0 and 1.
      let normalizedFrequency;
      if ( scaledDeviation < MAPPING_FUNCTION_POINT_1.x ) {
        normalizedFrequency = SMALLER_DEVIATION_LINEAR_FUNCTION.evaluate( scaledDeviation );
      }
      else if ( scaledDeviation > MAPPING_FUNCTION_POINT_2.x ) {
        normalizedFrequency = LARGER_DEVIATION_LINEAR_FUNCTION.evaluate( scaledDeviation );
      }
      else {
        normalizedFrequency = MID_RANGE_DEVIATION_LINEAR_FUNCTION.evaluate( scaledDeviation );
      }

      // Map the normalized value to an actual cutoff frequency.
      return FILTER_FREQUENCY_RANGE.expandNormalizedValue( normalizedFrequency );
    };

    // for tracking history
    let previousMaxDeviationFromMean = 0;

    // Set up a multilink to update the cutoff frequency for the low pass filter as water levels change.
    const multilink = Multilink.multilinkAny(
      [
        ...notepadCups.map( cup => cup.waterLevelProperty ),
        ...notepadCups.map( cup => cup.isActiveProperty ),
        meanProperty
      ],
      () => {

        // Adjust the playback rate, and thus the pitch, of the underlying sound based on the mean value.
        const normalizedValue = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE.getNormalizedValue( meanProperty.value );
        const playbackRate = PLAYBACK_PITCH_RANGE.expandNormalizedValue( normalizedValue );
        if ( this.playbackRate !== playbackRate ) {
          this.setPlaybackRate( playbackRate );
        }

        // Get the deviation from the mean for the notepad cup whose water level is furthest from it.
        const activeCups = notepadCups.filter( cup => cup.isActiveProperty.value );
        const maxDeviationFromMean = activeCups.reduce(
          ( previousMax, currentCup ) => Math.max(
            previousMax,
            Math.abs( currentCup.waterLevelProperty.value - meanProperty.value )
          ),
          0
        );

        // Calculate how much the max deviation from the mean has changed since the last time.
        const deltaMaxDeviationFromMean = maxDeviationFromMean - previousMaxDeviationFromMean;

        if ( this.fullyEnabled && Math.abs( deltaMaxDeviationFromMean ) > MEAN_DEVIATION_CHANGE_THRESHOLD ) {

          // If we are already playing sound when this change occurred, continue it.  If we aren't but the change
          // occurred with the pipes open, start producing sound.
          if ( this.isPlaying || arePipesOpenProperty.value ) {
            this.startOrContinueSoundProduction();
          }

          // Set the cutoff frequency of the lowpass filter based on the max deviation from the mean.  The intent here
          // is to produce a more filtered sound when far from the mean and less filtered when all cups are close to it.
          const filterFrequency = getFrequencyFromMaxDeviationFromMean( maxDeviationFromMean );
          lowPassFilter.frequency.cancelScheduledValues( 0 );
          lowPassFilter.frequency.setTargetAtTime( filterFrequency, 0, soundConstants.DEFAULT_PARAM_CHANGE_TIME_CONSTANT );
        }

        // Update the history for the next pass.
        previousMaxDeviationFromMean = maxDeviationFromMean;
      }
    );

    // Initiate sound production any time the pipes are opened or closed.
    arePipesOpenProperty.lazyLink( () => {
      if ( notepadCups.filter( cup => cup.isActiveProperty.value ).length > 1 ) {
        this.startOrContinueSoundProduction();
      }
    } );

    // Hook up the step listener that will fade out the sound after a certain amount of inactivity.
    const stepListener = ( dt: number ) => this.step( dt );
    stepTimer.addListener( stepListener );

    // dispose function
    this.disposeWaterBalanceSoundGenerator = () => {
      meanProperty.unlink( updateMaxPossibleDeviation );
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