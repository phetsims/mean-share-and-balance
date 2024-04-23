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
const CHANGE_THRESHOLD = 0.001;
const PLAYBACK_PITCH_RANGE = new Range( 0.5, 1.3 ); // empirically determined to get desired behavior
const FILTER_FREQUENCY_RANGE = new Range( 200, 10000 );

class WaterBalanceSoundGenerator extends SoundClip {

  // duration of inactivity fade out
  private readonly fadeTime: number;

  // see docs in options type declaration
  private readonly fadeStartDelay: number;

  // see docs in options type declaration
  private readonly delayBeforeStop: number;

  // the output level before fade out starts
  private readonly nonFadedOutputLevel: number;

  // countdown time used for fade out
  private remainingFadeTime: number;

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
      Q: 1,
      frequency: 100
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
    this.fadeTime = options.fadeTime;
    this.delayBeforeStop = options.delayBeforeStop;
    this.nonFadedOutputLevel = options.initialOutputLevel === undefined ? 1 : options.initialOutputLevel;
    this.remainingFadeTime = 0;

    // Start with the output level at zero so that the initial sound can fade in.
    this.setOutputLevel( 0, 0 );

    // Adjust the pitch of the underlying sound based on the mean.
    const meanChangeListener = ( mean: number ) => {
      const normalizedValue = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE.getNormalizedValue( mean );
      const playbackRate = PLAYBACK_PITCH_RANGE.expandNormalizedValue( normalizedValue );
      this.setPlaybackRate( playbackRate );
    };
    meanProperty.link( meanChangeListener );

    // Define a listener that starts or continues the sound based on changes to the max deviation from the mean.
    const maxDeviationFromMeanChangeListener = ( deviation: number, oldDeviation: number | null ) => {

      // parameter checking
      assert && assert( deviation >= 0 && deviation <= 1, 'invalid max deviation value' );

      const delta = deviation - ( oldDeviation === null ? 0 : oldDeviation );

      if ( this.fullyEnabled && Math.abs( delta ) > CHANGE_THRESHOLD ) {

        // If we are already playing sound when this change occurred, continue it.  If we aren't but the change occurred
        // with the pipes open, start producing sound.
        if ( this.isPlaying || arePipesOpenProperty.value ) {
          this.startOrContinueSoundProduction();
        }

        // Set the filter frequency based on the max deviation are from the mean.  The frequency range and calculation
        // used here were empirically determined and can be adjusted if needed.
        const filterFrequency = FILTER_FREQUENCY_RANGE.expandNormalizedValue( Math.pow( 1 - deviation, 4 ) );
        lowPassFilter.frequency.cancelScheduledValues( 0 );
        lowPassFilter.frequency.setTargetAtTime( filterFrequency, 0, 0.015 );
      }
    };

    // Create a derived property that calculates the max deviation of a cup from the mean value.
    const maxDeviationFromMeanProperty: TReadOnlyProperty<number> = DerivedProperty.deriveAny(
      [
        ...cups.map( cup => cup.waterLevelProperty ),
        ...cups.map( cup => cup.isActiveProperty ),
        meanProperty
      ],
      () => {
        const activeCups = cups.filter( cup => cup.isActiveProperty.value );
        return activeCups.reduce(
          ( previousMax, currentCup ) => Math.max(
            previousMax,
            Math.abs( currentCup.waterLevelProperty.value - meanProperty.value )
          ),
          0
        );
      }
    );

    // Handle changes to the max deviation value.
    maxDeviationFromMeanProperty.lazyLink( maxDeviationFromMeanChangeListener );

    // Initiate sound production any time the pipes are opened or closed.
    arePipesOpenProperty.lazyLink( () => {
      this.startOrContinueSoundProduction();
    } );

    // Hook up the step listener that will fade out the sound after a certain amount of inactivity.
    const stepListener = ( dt: number ) => this.step( dt );
    stepTimer.addListener( stepListener );

    // dispose function
    this.disposeWaterBalanceSoundGenerator = () => {
      meanProperty.unlink( meanChangeListener );
      maxDeviationFromMeanProperty.unlink( maxDeviationFromMeanChangeListener );
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
    this.remainingFadeTime = this.fadeStartDelay + this.fadeTime + this.delayBeforeStop;
  }

  /**
   * Step this sound generator, which will fade out the sound over time if remainingFadeTime isn't increased.
   * @param dt - change in time (i.e. delta time) in seconds
   */
  private step( dt: number ): void {

    if ( this.remainingFadeTime > 0 ) {
      this.remainingFadeTime = Math.max( this.remainingFadeTime - dt, 0 );

      if ( ( this.remainingFadeTime < this.fadeTime + this.delayBeforeStop ) && this.outputLevel > 0 ) {

        // The sound is fading out, so adjust the output level downwards.
        const outputLevel = Math.max( ( this.remainingFadeTime - this.delayBeforeStop ) / this.fadeTime, 0 );
        this.setOutputLevel( outputLevel * this.nonFadedOutputLevel );
      }

      // Fade out complete, stop playback.
      if ( this.remainingFadeTime === 0 && this.isPlaying ) {
        this.stop( 0 );
      }
    }
  }

  /**
   * Stop any in-progress sound generation.
   */
  public reset(): void {
    this.stop( 0 );
    this.remainingFadeTime = 0;
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