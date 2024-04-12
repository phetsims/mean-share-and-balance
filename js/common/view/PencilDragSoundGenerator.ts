// Copyright 2018-2024, University of Colorado Boulder

/**
 * Sound generator used to produce a sound for the movement of the pencil that is used for making mean predictions on
 * the notepad.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import NoiseGenerator, { NoiseGeneratorOptions } from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

// constants
const MAX_DRAG_SOUND_VOLUME = 2; // can be greater than 1 because filtering tends to reduce output a lot
const VELOCITY_REDUCTION_RATE = 50; // amount per second, empirically determined for best sound
const STILLNESS_TIME = 0.064; // in seconds, if there are no angle updates for this long, the leg is considered still
const NOISE_CENTER_FREQUENCY = 1300; // Hz
const DIRECTION_FREQUENCY_DELTA = NOISE_CENTER_FREQUENCY / 8; // max difference for increasing vs decreasing changes
const MAX_LEG_ANGULAR_VELOCITY = 3 * Math.PI; // in radians/sec, see explanatory note where this is used
const MIN_SOUND_GAP = 0.05; // in seconds
const NOISE_START_TIME_CONSTANT = 0.01;
const NOISE_STOP_TIME_CONSTANT = 0.02;
const NOISE_LEVEL_CHANGE_TIME_CONSTANT = 0.1;
const NOISE_OFF_TIME = 0.05; // in seconds

type MotionState = 'unchanging' | 'increasing' | 'decreasing';

class PencilDragSoundGenerator extends NoiseGenerator {

  private changeRateUpdateTime: number | null = null;
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

    // monitor the leg angle and adjust the noise output accordingly
    meanPredictionProperty.lazyLink( ( newLegAngle, oldLegAngle ) => {
      const now = this.audioContext.currentTime;

      // update the angular velocity of the leg and determine the motion state
      let newMotionState: MotionState = 'unchanging';
      if ( ResetAllButton.isResettingAllProperty.value ) {

        // This case indicates that a reset caused the change, so set the velocity to 0.
        this.predictionChangeRate = 0;
      }
      else if ( this.changeRateUpdateTime !== null ) {

        // set the angular velocity of the leg, but keep it limited to the max allowed value
        this.predictionChangeRate = Utils.clamp(
          ( newLegAngle - oldLegAngle ) / ( now - this.changeRateUpdateTime ),
          -MAX_LEG_ANGULAR_VELOCITY,
          MAX_LEG_ANGULAR_VELOCITY
        );

        // update the motion state
        newMotionState = this.predictionChangeRate > 0 ? 'increasing' : 'decreasing';
      }

      // update the state of sound generation (on or off)
      if ( newMotionState !== 'unchanging' ) {

        if ( newMotionState !== this.motionState && this.motionState !== 'unchanging' ) {

          // the leg switched directions without stopping in between, so set a countdown that will create a sound gap
          this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
          this.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {
          if ( !this.isPlaying ) {
            this.start();
            this.setOutputLevel( mapVelocityToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
          }
          else {
            this.setOutputLevel( mapVelocityToOutputLevel( this.predictionChangeRate ), NOISE_LEVEL_CHANGE_TIME_CONSTANT );
          }

          // Set the frequency of the drag sound.
          this.setBandpassFilterCenterFrequency( mapVelocityToFilterFrequency( this.predictionChangeRate, newMotionState ) );
        }
      }
      else {
        if ( this.isPlaying ) {
          this.stop( now + NOISE_OFF_TIME );
        }
      }

      // set the filter value that controls whether the forward or backward dragging sound is heard
      if ( this.motionState !== newMotionState ) {

        // set the frequency based on the direction
        let frequencyDelta = newMotionState === 'increasing' ? DIRECTION_FREQUENCY_DELTA : -DIRECTION_FREQUENCY_DELTA;

        // add some randomization to the frequency delta so that back-and-forth motion sounds less repetitive
        frequencyDelta = frequencyDelta * ( 1 - dotRandom.nextDouble() / 2 );

        // set the filter value that controls whether the forward or backward dragging sound is heard
        this.setBandpassFilterCenterFrequency( NOISE_CENTER_FREQUENCY + frequencyDelta, 0.01 );
      }

      // update state variable for the timer to use and for next time through this method
      this.changeRateUpdateTime = now;
      this.motionState = newMotionState;
    } );

    // Hook up the time-dependent behavior to the global stepper.
    stepTimer.addListener( dt => {
      this.step( dt );
    } );
  }

  /**
   * step function that mostly detects when the leg stops moving and helps create the silence intervals when the foot
   * drag changes direction
   */
  private step( dt: number ): void {

    // check if the countdown used to keep sounds from running together is going
    if ( this.soundStartCountdown > 0 ) {
      this.soundStartCountdown = Math.max( this.soundStartCountdown - dt, 0 );
      if ( this.soundStartCountdown === 0 && this.motionState !== 'unchanging' ) {
        this.setOutputLevel( mapVelocityToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
      }
    }
    else if ( this.changeRateUpdateTime !== null &&
              this.audioContext.currentTime - this.changeRateUpdateTime > STILLNESS_TIME &&
              Math.abs( this.predictionChangeRate ) > 0 ) {

      // The leg angle hasn't changed for a bit, so start to reduce the angular velocity, but don't do it all at once
      // since that isn't realistic and tends to cause gaps in the sound.
      const angularVelocityChange = ( this.predictionChangeRate > 0 ? -1 : 1 ) *
                                    Math.min( dt * VELOCITY_REDUCTION_RATE, Math.abs( this.predictionChangeRate ) );
      this.predictionChangeRate = this.predictionChangeRate + angularVelocityChange;
      if ( this.predictionChangeRate === 0 ) {
        this.motionState = 'unchanging';
        this.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
        this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
      }
      else {
        this.setOutputLevel( mapVelocityToOutputLevel( this.predictionChangeRate ), NOISE_START_TIME_CONSTANT );
      }
    }
  }

}

// helper function to convert the angular velocity of the leg to an output level for the noise generator
const mapVelocityToOutputLevel = ( angularVelocityOfLeg: number ) => {
  const multiplier = Math.min( Math.pow( Math.abs( angularVelocityOfLeg ) / MAX_LEG_ANGULAR_VELOCITY, 0.7 ), 1 );
  return MAX_DRAG_SOUND_VOLUME * multiplier;
};

// helper function to convert the angular velocity of the leg to a center frequency values for the noise filter
const mapVelocityToFilterFrequency = ( angularVelocityOfLeg: number, direction: MotionState ) => {
  let minFrequency;
  if ( direction === 'increasing' ) {
    minFrequency = NOISE_CENTER_FREQUENCY - DIRECTION_FREQUENCY_DELTA;
  }
  else {
    minFrequency = NOISE_CENTER_FREQUENCY + DIRECTION_FREQUENCY_DELTA;
  }
  const multiplier = Math.abs( angularVelocityOfLeg ) / MAX_LEG_ANGULAR_VELOCITY;
  return minFrequency + 500 * multiplier;
};

meanShareAndBalance.register( 'PencilDragSoundGenerator', PencilDragSoundGenerator );

export default PencilDragSoundGenerator;