// Copyright 2022-2024, University of Colorado Boulder

/**
 * MeanPredictionChangeSoundGenerator is used to produce a sound for the movement of the pencil and the line that
 * represents the predicted mean on the notepad.  This sound generator uses filtered noise as the sound source and
 * changes the volume and center frequency of the filter based on the rate and direction of the pencil's movement.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import stepTimer from '../../../../axon/js/stepTimer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import isResettingAllProperty from '../../../../scenery-phet/js/isResettingAllProperty.js';
import NoiseGenerator, { NoiseGeneratorOptions } from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type MotionState = 'unchanging' | 'increasing' | 'decreasing';

// constants
const MAX_DRAG_SOUND_VOLUME = 0.5; // can be greater than 1 because filtering tends to reduce output a lot
const VELOCITY_REDUCTION_RATE = 20; // proportion per second, empirically determined for best sound
const STILLNESS_TIME = 0.064; // in seconds, amount of time with no movement before the prediction line is considered still
const NOISE_CENTER_FREQUENCY = 1500; // in Hz
const DIRECTION_FREQUENCY_DELTA = NOISE_CENTER_FREQUENCY * 0.1; // in Hz, difference for increasing vs decreasing changes
const MAX_CHANGE_RATE = 1; // in proportion/sec, see explanatory note where this is used
const MIN_SOUND_GAP = 0.05; // in seconds
const NOISE_START_TIME_CONSTANT = 0.01;
const NOISE_STOP_TIME_CONSTANT = 0.02;
const NOISE_LEVEL_CHANGE_TIME_CONSTANT = 0.1;
const NOISE_OFF_TIME = 0.05; // in seconds

class MeanPredictionChangeSoundGenerator extends NoiseGenerator {

  private changeRateUpdateTime: number;
  private soundStartCountdown = 0;
  private motionState: MotionState = 'unchanging';

  // the rate at which the prediction value is changing over time
  private predictionChangeRate = 0;

  /**
   * @param meanPredictionProperty - the predicted mean value, which is generally set by dragging a pencil image
   * @param providedOptions
   */
  public constructor( meanPredictionProperty: TReadOnlyProperty<number>, providedOptions?: NoiseGeneratorOptions ) {

    const options = combineOptions<NoiseGeneratorOptions>( {
        noiseType: 'brown',
        centerFrequency: NOISE_CENTER_FREQUENCY,
        qFactor: 2,
        initialOutputLevel: 0
      },
      providedOptions
    );

    super( options );

    this.changeRateUpdateTime = this.audioContext.currentTime;

    // Turn off sound generation when a reset occurs.
    isResettingAllProperty.lazyLink( () => {
      this.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
      this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
      this.predictionChangeRate = 0;
      this.motionState = 'unchanging';
    } );

    // Monitor the prediction value and update the sound output accordingly.  This will often initiate the sound
    // generation, and the step function will turn it off later once the interaction ends.
    meanPredictionProperty.lazyLink( ( newPrediction, oldPrediction ) => {

      if ( !isResettingAllProperty.value ) {

        const now = this.audioContext.currentTime;

        // Limit the max time change value used in the rate change calculation.  This is needed because there could be
        // an arbitrarily long time between the start and end of a set of prediction changes, and large time values lead
        // to small rate change values, which can cause odd behavior for things like keyboard interaction.
        const maxDeltaTime = 0.5; // in seconds, empirically determined
        const deltaTime = Math.min( now - this.changeRateUpdateTime, maxDeltaTime );

        this.predictionChangeRate = Utils.clamp(
          ( newPrediction - oldPrediction ) / deltaTime,
          -MAX_CHANGE_RATE,
          MAX_CHANGE_RATE
        );
        const newMotionState: MotionState = this.predictionChangeRate > 0 ? 'increasing' : 'decreasing';

        // Update the state of sound generation.
        if ( newMotionState !== this.motionState && this.motionState !== 'unchanging' ) {

          // The motion changed directions without stopping in between, so set a countdown that will create a sound gap.
          this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
          this.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {

          // Set the output level of the sound based on the change rate.  Start the sound if needed.
          if ( !this.isPlaying ) {
            this.start();
            this.setOutputLevel( mapChangeRateToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
          }
          else {
            this.setOutputLevel( mapChangeRateToOutputLevel( this.predictionChangeRate ), NOISE_LEVEL_CHANGE_TIME_CONSTANT );
          }

          // Set the frequency of the drag sound.
          this.setBandpassFilterCenterFrequency( mapChangeRateToFilterFrequency( this.predictionChangeRate, newMotionState ) );
        }

        if ( this.motionState !== newMotionState ) {

          // Set the frequency based on the direction.
          let frequencyDelta = newMotionState === 'increasing' ? DIRECTION_FREQUENCY_DELTA : -DIRECTION_FREQUENCY_DELTA;

          // Add some randomization to the frequency delta so that back-and-forth motion sounds less repetitive.
          frequencyDelta = frequencyDelta * ( 1 - dotRandom.nextDouble() / 2 );

          // Set the filter value that controls whether the upward or downward dragging sound is heard.
          this.setBandpassFilterCenterFrequency( NOISE_CENTER_FREQUENCY + frequencyDelta, 0.01 );
        }

        // Update state variable for the timer to use and for next time through this function.
        this.changeRateUpdateTime = now;
        this.motionState = newMotionState;
      }
    } );

    // Hook up the time-dependent behavior to the global step timer.
    stepTimer.addListener( dt => {
      this.step( dt );
    } );
  }

  /**
   * The step function mostly detects when the monitored property stops changing and helps create the silence intervals
   * when the direction changes.
   */
  private step( dt: number ): void {

    // Check if the countdown used to keep sounds from running together is going.
    if ( this.soundStartCountdown > 0 ) {
      this.soundStartCountdown = Math.max( this.soundStartCountdown - dt, 0 );
      if ( this.soundStartCountdown === 0 && this.motionState !== 'unchanging' ) {
        this.setOutputLevel( mapChangeRateToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
      }
    }
    else if ( this.changeRateUpdateTime !== null &&
              this.audioContext.currentTime - this.changeRateUpdateTime > STILLNESS_TIME &&
              Math.abs( this.predictionChangeRate ) > 0 ) {

      // The value hasn't changed for a bit, so start to reduce the change rate, but don't do it all at once since that
      // isn't realistic and tends to cause gaps in the sound.
      const changeRateChange = ( this.predictionChangeRate > 0 ? -1 : 1 ) *
                               Math.min( dt * VELOCITY_REDUCTION_RATE, Math.abs( this.predictionChangeRate ) );
      this.predictionChangeRate = this.predictionChangeRate + changeRateChange;
      if ( this.predictionChangeRate === 0 ) {
        this.motionState = 'unchanging';
        this.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
        this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
      }
      else {
        this.setOutputLevel( mapChangeRateToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
      }
    }
  }
}

/**
 * Helper function to convert the change rate to an output level for the noise generator.
 */
const mapChangeRateToOutputLevel = ( changeRate: number ) => {
  const multiplier = Math.min( Math.pow( Math.abs( changeRate ) / MAX_CHANGE_RATE, 0.7 ), 1 );
  return MAX_DRAG_SOUND_VOLUME * multiplier;
};

/**
 * Helper function to convert the change rate to a center frequency values for the noise filter.
 */
const mapChangeRateToFilterFrequency = ( changeRate: number, direction: MotionState ) => {
  let minFrequency;
  if ( direction === 'increasing' ) {
    minFrequency = NOISE_CENTER_FREQUENCY - DIRECTION_FREQUENCY_DELTA;
  }
  else {
    minFrequency = NOISE_CENTER_FREQUENCY + DIRECTION_FREQUENCY_DELTA;
  }
  const multiplier = Math.abs( changeRate ) / MAX_CHANGE_RATE;
  return minFrequency + 500 * multiplier;
};

meanShareAndBalance.register( 'MeanPredictionChangeSoundGenerator', MeanPredictionChangeSoundGenerator );

export default MeanPredictionChangeSoundGenerator;