// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line.
 * Users are able to manipulate line to predict what they believe the mean is across visible objects.
 * Extends AccessibleSlider for alternative input.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Image, Line, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import pencil_png from '../../../images/pencil_png.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import NoiseGenerator, { NoiseGeneratorOptions } from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Utils from '../../../../dot/js/Utils.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import stepTimer from '../../../../axon/js/stepTimer.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = AccessibleSliderOptions & NodeOptions;
type PredictMeanNodeOptions =
  SelfOptions
  & StrictOmit<ParentOptions, 'pickable' | 'inputEnabled' | 'focusable' | 'cursor' | 'children'>
  & PickRequired<ParentOptions, 'tandem'>;

// Constants
const LINE_X_MARGIN = 10;

export default class PredictMeanSlider extends AccessibleSlider( Node, 0 ) {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Node;
  private readonly predictMeanGlow: Rectangle;

  public constructor( meanPredictionProperty: Property<number>, dragRange: Range,
                      createSuccessIndicatorMultilink: ( predictMeanLine: Path, successRectangle: Node ) => void,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PredictMeanNodeOptions ) {

    const options = providedOptions;

    const predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ), {
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN_WIDTH,
      stroke: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN,
      lineDash: [ 5, 3 ]
    } );

    const predictMeanHandle = new Image( pencil_png, {
      scale: 0.04,
      rotation: Math.PI / 4,
      centerY: predictMeanLine.centerY
    } );

    // Create elements that indicate a successful prediction of the mean.
    const predictMeanSuccessRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 10, {
      fill: MeanShareAndBalanceColors.predictMeanSuccessFillProperty,
      opacity: 0.5,
      cornerRadius: 2,
      visible: false,
      centerY: predictMeanLine.centerY
    } );
    createSuccessIndicatorMultilink( predictMeanLine, predictMeanSuccessRectangle );

    // Track predictMeanLine drag position.  This needs to be a Vector2, and creates the linkage to the Y value.
    const predictMeanPositionProperty = new Vector2Property( new Vector2( 0, meanPredictionProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      meanPredictionProperty.value = dragRange.constrainValue( predictMeanPosition.y );
    } );

    const dragListener = new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,

      // phet-io
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    const combinedOptions = combineOptions<ParentOptions>( {
      children: [ predictMeanSuccessRectangle, predictMeanLine, predictMeanHandle ],
      cursor: 'ns-resize'
    }, options );
    super( combinedOptions );

    meanPredictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.addInputListener( dragListener );
    this.predictMeanLine = predictMeanLine;
    this.predictMeanHandle = predictMeanHandle;
    this.predictMeanGlow = predictMeanSuccessRectangle;

    this.setPointerAreas();
    this.centerX = modelViewTransform.modelToViewX( 0 );

    // Add sound generation for the "predict mean" slider.
    const predictMeanSoundGenerator = new MeanPredictionChangeSoundGenerator( meanPredictionProperty );
    soundManager.addSoundGenerator( predictMeanSoundGenerator );
  }

  private setPointerAreas(): void {
    this.predictMeanLine.mouseArea = this.predictMeanLine.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanLine.touchArea = this.predictMeanLine.mouseArea;
    this.predictMeanHandle.mouseArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanHandle.touchArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }

  public updateLine( lineStart: number, lineEnd: number ): void {
    this.predictMeanLine.x1 = lineStart - LINE_X_MARGIN;
    this.predictMeanLine.x2 = lineEnd + LINE_X_MARGIN * 2;
    this.predictMeanGlow.setRectX( lineStart );
    this.predictMeanGlow.setRectWidth( lineEnd - lineStart );
    this.predictMeanHandle.left = this.predictMeanLine.right;
    this.setPointerAreas();
  }
}

// Define sound generator for the "predict mean" slider.
type MotionState = 'unchanging' | 'increasing' | 'decreasing';

// constants
const MAX_DRAG_SOUND_VOLUME = 0.5; // can be greater than 1 because filtering tends to reduce output a lot
const VELOCITY_REDUCTION_RATE = 20; // proportion per second, empirically determined for best sound
const STILLNESS_TIME = 0.064; // in seconds, if there are no angle updates for this long, the leg is considered still
const NOISE_CENTER_FREQUENCY = 1500; // Hz
const DIRECTION_FREQUENCY_DELTA = NOISE_CENTER_FREQUENCY * 0.1; // in Hz, difference for increasing vs decreasing changes
const MAX_CHANGE_RATE = 1; // in proportion/sec, see explanatory note where this is used
const MIN_SOUND_GAP = 0.05; // in seconds
const NOISE_START_TIME_CONSTANT = 0.01;
const NOISE_STOP_TIME_CONSTANT = 0.02;
const NOISE_LEVEL_CHANGE_TIME_CONSTANT = 0.1;
const NOISE_OFF_TIME = 0.05; // in seconds

class MeanPredictionChangeSoundGenerator extends NoiseGenerator {

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

    // Monitor the prediction value and update the noise output accordingly.
    meanPredictionProperty.lazyLink( ( newPrediction, oldPrediction ) => {
      const now = this.audioContext.currentTime;

      // Update the rate of change and determine the motion state.
      let newMotionState: MotionState = 'unchanging';
      if ( ResetAllButton.isResettingAllProperty.value ) {

        // This case indicates that a reset caused the change, so set the change rate to 0.
        this.predictionChangeRate = 0;
        this.motionState = 'unchanging';
      }
      else if ( this.changeRateUpdateTime !== null ) {
        this.predictionChangeRate = Utils.clamp(
          ( newPrediction - oldPrediction ) / ( now - this.changeRateUpdateTime ),
          -MAX_CHANGE_RATE,
          MAX_CHANGE_RATE
        );

        newMotionState = this.predictionChangeRate > 0 ? 'increasing' : 'decreasing';
      }

      // Update the state of sound generation (on or off).
      if ( newMotionState !== 'unchanging' ) {

        if ( newMotionState !== this.motionState && this.motionState !== 'unchanging' ) {

          // The motion changed directions without stopping in between, so set a countdown that will create a sound gap.
          this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
          this.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {
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
      }
      else {
        if ( this.isPlaying ) {
          this.stop( now + NOISE_OFF_TIME );
        }
      }

      // Set the filter value that controls whether the sound for increasing or decreasing values is heard.
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

meanShareAndBalance.register( 'PredictMeanSlider', PredictMeanSlider );