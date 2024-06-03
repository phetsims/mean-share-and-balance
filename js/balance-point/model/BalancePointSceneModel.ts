// Copyright 2024, University of Colorado Boulder
/**
 * The BalancePointSceneModel has the soccer ball information for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerSceneModel, { SoccerSceneModelOptions } from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import Range from '../../../../dot/js/Range.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import NumberTone from '../../../../soccer-common/js/model/NumberTone.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BalancePointModel from './BalancePointModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type BalancePointSceneModelOptions = SoccerSceneModelOptions;

// The range for the beam extends one meter beyond that of the soccer balls in both directions.
const X_AXIS_RANGE = new Range(
  MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.min - 1,
  MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.max + 1
);
export const FULCRUM_HEIGHT = 0.7; // in meters
const PARTIAL_TILT_SPAN = 0.5; // in meters, distance from fulcrum to mean where beam tilts partially, not completely
const BEAM_ROTATION_RATE = Math.PI / 4; // in radians/sec, empirically determined to look reasonably good

export default class BalancePointSceneModel extends SoccerSceneModel {

  public readonly totalKickDistanceProperty: TReadOnlyProperty<number>;
  public readonly targetNumberOfBallsProperty: Property<number>;
  public readonly meanPredictionFulcrumValueProperty: Property<number>;

  // Controls whether the column supports for the beam are present or not, fixing the beam in a horizontal position
  // when present, and allowing the beam to tilt when not.
  public readonly beamSupportsPresentProperty: BooleanProperty;

  // The position of the balance beam is determined by the x and y values of the left and right end points of the line.
  // The x values never vary.
  public readonly leftBalanceBeamYValueProperty: Property<number>;
  public readonly leftBalanceBeamXValue = X_AXIS_RANGE.min;
  public readonly rightBalanceBeamYValueProperty: Property<number>;
  public readonly rightBalanceBeamXValue = X_AXIS_RANGE.max;

  // The target value for the left balance beam Y position.  This is used in the step function to animate the motion
  // of the beam in some situations.
  private targetLeftBalanceBeamYValue = FULCRUM_HEIGHT;

  public constructor( isMeanFulcrumFixedProperty: BooleanProperty,
                      maxKicksProperty: Property<number>,
                      providedOptions: BalancePointSceneModelOptions ) {

    const options = optionize<BalancePointSceneModelOptions, EmptySelfOptions, SoccerSceneModelOptions>()( {
      isDisposable: false
    }, providedOptions );

    const kickDistributionStrategy = new KickDistributionStrategy(
      'randomSkew',
      null,
      'right',
      {
        rightSkewedData: [ 0, 25, 45, 30, 18, 12, 10, 5, 4, 4, 4 ],
        valuesRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
        tandem: options.tandem.createTandem( 'kickDistributionStrategy' )
      }
    );

    const kickRange = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE;

    const createSoccerBall = ( isFirstSoccerBall: boolean, tandem: Tandem ) => {
      return new SoccerBall( isFirstSoccerBall, tandem );
    };

    super(
      maxKicksProperty,
      [ 7 ],
      kickDistributionStrategy,
      kickRange,
      createSoccerBall,
      options
    );
    this.beamSupportsPresentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'beamSupportsPresentProperty' )
    } );

    const valueDependencies = this.soccerBalls.map( ball => ball.valueProperty );
    const phaseDependencies = this.soccerBalls.map( ball => ball.soccerBallPhaseProperty );
    const positionDependencies = this.soccerBalls.map( ball => ball.positionProperty );
    this.totalKickDistanceProperty = DerivedProperty.deriveAny( [ ...valueDependencies, ...phaseDependencies, ...positionDependencies ], () => {
      const activeBalls = this.getSortedStackedObjects();
      return activeBalls.length > 0 ? _.sumBy( this.getSortedStackedObjects(), ball => ball.valueProperty.value! ) : 0;
    }, {
      tandem: options.tandem.createTandem( 'totalKickDistanceProperty' ),
      phetioValueType: NumberIO,
      phetioReadOnly: true,
      phetioState: false
    } );

    this.targetNumberOfBallsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_SOCCER_BALLS, {
      range: BalancePointModel.numberOfKicksRangeProperty,
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'targetNumberOfBallsProperty' )
    } );

    this.targetNumberOfBallsProperty.lazyLink( ( newValue, oldValue ) => {
      const delta = newValue - oldValue;
      if ( delta > 0 ) {
        this.scheduleKicks( delta );
      }

      // During reset or PhET-iO state setting the number of active balls may already match the target number value
      else if ( delta < 0 && this.getKickedBalls().length !== newValue ) {
        const ballsToRemove = -delta;
        const numberOfBallsToRemoveFromQueue = Math.min( ballsToRemove, this.numberOfQueuedKicksProperty.value );
        const numberOfBallsToRemoveFromField = ballsToRemove - numberOfBallsToRemoveFromQueue;

        // Remove balls from the queue first, and then if any balls to remove remain, remove them from the field.
        this.numberOfQueuedKicksProperty.value -= numberOfBallsToRemoveFromQueue;
        _.times( numberOfBallsToRemoveFromField, () => this.regressLine() );
      }
    } );

    this.meanPredictionFulcrumValueProperty = new NumberProperty( MeanShareAndBalanceConstants.FULCRUM_DEFAULT_POSITION, {
      tandem: options.tandem.createTandem( 'meanPredictionFulcrumValueProperty' ),
      range: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE
    } );

    this.leftBalanceBeamYValueProperty = new NumberProperty( FULCRUM_HEIGHT, {
      tandem: options.tandem.createTandem( 'leftBalanceBeamYValueProperty' ),
      phetioReadOnly: true
    } );
    this.rightBalanceBeamYValueProperty = new NumberProperty( FULCRUM_HEIGHT, {
      tandem: options.tandem.createTandem( 'rightBalanceBeamYValueProperty' ),
      phetioReadOnly: true
    } );

    // Update the position of the beam as other aspects of the model change.
    Multilink.multilink(
      [
        this.beamSupportsPresentProperty,
        this.meanPredictionFulcrumValueProperty,
        this.meanValueProperty,
        isMeanFulcrumFixedProperty
      ],
      ( supportsPresent, fulcrumValue, mean, isFulcrumFixed ) => {

        // If the supports are present, if nothing is on the beam, or if the fulcrum is at the fixed mean state, then
        // the beam is horizontal.
        if ( supportsPresent || mean === null || isFulcrumFixed ) {
          this.leftBalanceBeamYValueProperty.value = FULCRUM_HEIGHT;
          this.rightBalanceBeamYValueProperty.value = FULCRUM_HEIGHT;
          this.targetLeftBalanceBeamYValue = FULCRUM_HEIGHT;
        }
        else {

          // The fulcrum is accurate to one tenth of a meter. Round the fulcrum and mean values to that precision.
          const roundedFulcrumValue = Utils.roundToInterval( fulcrumValue, 0.1 );
          const roundedMeanValue = Utils.roundToInterval( mean, 0.1 );

          // convenience variables
          const xMin = X_AXIS_RANGE.min;
          const xMax = X_AXIS_RANGE.max;
          const tiltedToLeft = roundedMeanValue < roundedFulcrumValue;

          // Create a linear function for the line as it is before making any changes.
          const linearFunctionForPreviousBeamPosition = new LinearFunction(
            xMin,
            xMax,
            this.leftBalanceBeamYValueProperty.value,
            this.rightBalanceBeamYValueProperty.value
          );

          // Determine whether the top of the fulcrum is still in contact with the beam.  If it is, that means the beam
          // line can be rotated to the new position, which means it can be animated.
          const fulcrumTipInContactWithOldBeamLine = Utils.equalsEpsilon(
            linearFunctionForPreviousBeamPosition.evaluate( roundedFulcrumValue ),
            FULCRUM_HEIGHT,
            1E-8
          );

          // Create a linear function for the line that represents where the beam should be in model space.  This
          // calculation is for the final position based on the items on the beam and whether the fulcrum is close to
          // the balance point.
          let linearFunctionForNewBeamPosition;
          const distanceFromFulcrumToMean = Math.abs( roundedFulcrumValue - roundedMeanValue );
          if ( distanceFromFulcrumToMean < PARTIAL_TILT_SPAN ) {
            const lowerEdgeHeight = ( 1 - distanceFromFulcrumToMean / PARTIAL_TILT_SPAN ) * FULCRUM_HEIGHT;
            linearFunctionForNewBeamPosition = tiltedToLeft ?
                                               new LinearFunction( xMin, roundedFulcrumValue, lowerEdgeHeight, FULCRUM_HEIGHT ) :
                                               new LinearFunction( roundedFulcrumValue, xMax, FULCRUM_HEIGHT, lowerEdgeHeight );
          }
          else {
            linearFunctionForNewBeamPosition = tiltedToLeft ?
                                               new LinearFunction( xMin, roundedFulcrumValue, 0, FULCRUM_HEIGHT ) :
                                               new LinearFunction( roundedFulcrumValue, xMax, FULCRUM_HEIGHT, 0 );
          }

          // Use the linear function to figure out where the ends of the beam should be.
          this.targetLeftBalanceBeamYValue = linearFunctionForNewBeamPosition.evaluate( xMin );

          // Determine whether to move instantly to the new position or let the step function move there more gradually
          // in order to animate the tilting motion.
          if ( !fulcrumTipInContactWithOldBeamLine ) {

            // The new fulcrum position is not in contact with the old beam, so we can't rotate the beam into the new
            // position.  In this case, we set the new position values right away.
            this.leftBalanceBeamYValueProperty.value = linearFunctionForNewBeamPosition.evaluate( xMin );
            this.rightBalanceBeamYValueProperty.value = linearFunctionForNewBeamPosition.evaluate( xMax );
          }
        }
      }
    );

    this.soccerBalls.forEach( soccerBall => {
      soccerBall.toneEmitter.addListener( value => {
        NumberTone.playValue( value );
      } );
    } );

    maxKicksProperty.link( maxKicks => {
      this.clearData();
      BalancePointModel.numberOfKicksRangeProperty.value = new Range(
        BalancePointModel.numberOfKicksRangeProperty.value.min,
        maxKicks
      );
    } );
  }

  private getKickedBalls(): SoccerBall[] {
    return this.soccerBalls.filter( ball =>
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.FLYING ||
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKING ||
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED
    );
  }

  private regressLine(): void {

    this.activeKickIndexProperty.value = this.targetNumberOfBallsProperty.value;
    this.kickers[ this.activeKickIndexProperty.value ].readyToKick();

    // Remove last kicked ball from field
    const kickedBalls = this.getKickedBalls();

    const lastBall = kickedBalls[ kickedBalls.length - 1 ];

    const lastBallValue = lastBall.valueProperty.value;
    lastBall.soccerBallPhaseProperty.value = SoccerBallPhase.INACTIVE;

    // A ball is only given a value right before it lands. If we remove a ball while flying we do not need to
    // reorganize the stack.
    if ( lastBallValue !== null ) {
      const stack = this.getStackAtValue( lastBallValue );
      this.reorganizeStack( stack );
    }

    // Set the next ball to be READY
    const unkickedBalls = this.soccerBalls.filter( ball =>
                          ball.soccerBallPhaseProperty.value === SoccerBallPhase.INACTIVE ||
                          ball.soccerBallPhaseProperty.value === SoccerBallPhase.READY ) || null;
    if ( unkickedBalls ) {

      // There should only be one "ready" ball at a time.
      unkickedBalls.forEach( ( ball, i ) => {
        this.soccerBalls.indexOf( ball ) < this.maxKicksProperty.value && i === 0 ?
        ball.soccerBallPhaseProperty.value = SoccerBallPhase.READY :
        ball.soccerBallPhaseProperty.value = SoccerBallPhase.INACTIVE;
      } );
    }
  }

  public override step( dt: number ): void {

    // If the balance beam isn't at the target position, move it toward the target.
    const leftEdgeDistanceFromTarget = this.leftBalanceBeamYValueProperty.value - this.targetLeftBalanceBeamYValue;
    if ( leftEdgeDistanceFromTarget !== 0 ) {
      const rotationSign = leftEdgeDistanceFromTarget > 0 ? 1 : -1;
      const leftEdgePoint = new Vector2( X_AXIS_RANGE.min, this.leftBalanceBeamYValueProperty.value );
      const fulcrumTipPoint = new Vector2( this.meanPredictionFulcrumValueProperty.value, FULCRUM_HEIGHT );
      const rotatedLeftEdgePoint = leftEdgePoint.rotatedAboutPoint(
        fulcrumTipPoint,
        rotationSign * BEAM_ROTATION_RATE * dt
      );
      const rotatedBeamLineFunction = new LinearFunction(
        rotatedLeftEdgePoint.x,
        this.meanPredictionFulcrumValueProperty.value,
        rotatedLeftEdgePoint.y,
        FULCRUM_HEIGHT
      );
      if ( rotationSign > 0 && rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.min ) < this.targetLeftBalanceBeamYValue ||
           rotationSign < 0 && rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.min ) > this.targetLeftBalanceBeamYValue ) {

        // Rotating by the full amount per step would go past the target value, so just go directly to the target.
        this.leftBalanceBeamYValueProperty.value = this.targetLeftBalanceBeamYValue;
        const linearFunctionForTargetValue = new LinearFunction(
          X_AXIS_RANGE.min,
          this.meanPredictionFulcrumValueProperty.value,
          this.targetLeftBalanceBeamYValue,
          FULCRUM_HEIGHT
        );
        this.rightBalanceBeamYValueProperty.value = linearFunctionForTargetValue.evaluate( X_AXIS_RANGE.max );
      }
      else {

        // Rotate the end points by the full amount of rotation for this step.
        this.leftBalanceBeamYValueProperty.value = rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.min );
        this.rightBalanceBeamYValueProperty.value = rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.max );
      }
    }
    super.step( dt );
  }

  /**
   * Clear data is only called in the Balance Point Screen when the region and culture is changed.
   */
  public override clearData(): void {
    this.targetNumberOfBallsProperty.reset();
    super.clearData();
  }

  public override reset(): void {
    super.reset();
    this.targetNumberOfBallsProperty.reset();
    this.meanPredictionFulcrumValueProperty.reset();
    this.beamSupportsPresentProperty.reset();
  }
}

meanShareAndBalance.register( 'BalancePointSceneModel', BalancePointSceneModel );