// Copyright 2024-2025, University of Colorado Boulder

/**
 * The BalancePointSceneModel has the soccer ball information for the balance point screen as well as the information
 * needed to render the balance beam.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import NumberTone from '../../../../soccer-common/js/model/NumberTone.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import SoccerSceneModel, { SoccerSceneModelOptions } from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import BalancePointModel from './BalancePointModel.js';

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

  // The total kick distance is the sum of the values of all the soccer balls that have been kicked and have landed
  // on the field.
  public readonly totalKickDistanceProperty: TReadOnlyProperty<number>;

  // The target number of balls property is tied to the number of balls spinner and displays the desired number of
  // balls that a user wants to have on the field. Due to animation, this number may not reflect the number of balls
  // actually on the field.
  public readonly targetNumberOfBallsProperty: Property<number>;

  // The mean prediction fulcrum value property is the value that the fulcrum is at when being controlled by a user.
  public readonly meanPredictionFulcrumValueProperty: Property<number>;

  // Controls whether the column supports for the beam are present or not, fixing the beam in a horizontal position
  // when present, and allowing the beam to tilt when not.
  public readonly beamSupportsPresentProperty: BooleanProperty;

  // The position of the balance beam is determined by the x and y values of the left and right end points of the line.
  // The x values never vary.  The Y values need to be an atomic unit so that they can be changed simultaneously.
  public readonly leftBalanceBeamXValue = X_AXIS_RANGE.min;
  public readonly rightBalanceBeamXValue = X_AXIS_RANGE.max;
  public readonly balanceBeamEndpointYValuesProperty: Property<BalanceBeamEndpointYValues>;

  // The target value for the left balance beam Y position.  This is used in the step function to animate the motion
  // of the beam in some situations.
  private targetLeftBalanceBeamYValue = FULCRUM_HEIGHT;

  /**
   * @param isMeanFulcrumFixedProperty - Property that determines whether the fulcrum auto updates to the mean value,
   * or is controlled by the user.
   *
   * @param maxKicksProperty - Property that determines the maximum number of kicks that can be made.
   * @param providedOptions
   */
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
        // The distribution of values for the soccer balls is right skewed.
        // The values were provided by pedagogical designers.
        rightSkewedData: [ 8, 12, 15, 18, 12, 2, 2, 2, 2, 2, 2 ],
        probabilityByDistanceDocumentationValues: '[0,1,3,5,7,3,1,0,0,0,1]',
        distanceByIndexDocumentationValues: '[5,9,10,2,7,3,4]',
        valuesRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
        maxKicks: MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS,

        // phet-io
        tandem: options.tandem.createTandem( 'kickDistributionStrategy' ),
        phetioFeatured: true
      }
    );

    const kickRange = MeanShareAndBalanceConstants.SOCCER_BALL_RANGE;

    const createSoccerBall = ( isFirstSoccerBall: boolean, tandem: Tandem ) => {
      return new SoccerBall( isFirstSoccerBall, kickRange, tandem );
    };

    super(
      maxKicksProperty,
      [ 7 ],
      kickDistributionStrategy,
      kickRange,
      createSoccerBall,
      options
    );

    // Create Properties
    const valueDependencies = this.soccerBalls.map( ball => ball.valueProperty );
    const phaseDependencies = this.soccerBalls.map( ball => ball.soccerBallPhaseProperty );
    const positionDependencies = this.soccerBalls.map( ball => ball.positionProperty );
    this.totalKickDistanceProperty = DerivedProperty.deriveAny( [ ...valueDependencies, ...phaseDependencies, ...positionDependencies ], () => {
      const activeBalls = this.getSortedStackedObjects();
      return activeBalls.length > 0 ? _.sumBy( this.getSortedStackedObjects(), ball => ball.valueProperty.value! ) : 0;
    }, {
      tandem: options.tandem.createTandem( 'totalKickDistanceProperty' ),
      phetioValueType: NumberIO,
      phetioState: false,
      phetioFeatured: true
    } );

    this.targetNumberOfBallsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_SOCCER_BALLS, {
      numberType: 'Integer',
      range: BalancePointModel.NUMBER_OF_KICKS_RANGE_PROPERTY,

      // phet-io
      phetioDocumentation: 'This NumberProperty is tied to the number of balls spinner and displays the desired number of balls on the field. Due to animation, this number may not reflect the number of balls that are actually on the field.',
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'targetNumberOfBallsProperty' )
    } );
    this.meanPredictionFulcrumValueProperty = new NumberProperty( MeanShareAndBalanceConstants.FULCRUM_DEFAULT_POSITION, {
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'meanPredictionFulcrumValueProperty' ),
      range: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE
    } );
    this.beamSupportsPresentProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'beamSupportsPresentProperty' )
    } );
    this.balanceBeamEndpointYValuesProperty = new Property<BalanceBeamEndpointYValues>(
      new BalanceBeamEndpointYValues( FULCRUM_HEIGHT, FULCRUM_HEIGHT ),
      {
        tandem: options.tandem.createTandem( 'balanceBeamEndpointYValuesProperty' ),
        phetioValueType: BalanceBeamEndpointYValues.BalanceBeamEndpointYValuesIO,
        phetioReadOnly: true
      }
    );

    // Listen to Properties
    this.targetNumberOfBallsProperty.lazyLink( ( newValue, oldValue ) => {
      const delta = newValue - oldValue;
      if ( delta > 0 ) {
        this.scheduleKicks( delta );
      }
      else if ( delta < 0 && ( this.getKickedBalls().length + this.numberOfQueuedKicksProperty.value ) !== newValue ) {

        // During reset or PhET-iO state setting the number of active balls may already match the target number value
        const ballsToRemove = -delta;
        const numberOfBallsToRemoveFromQueue = Math.min( ballsToRemove, this.numberOfQueuedKicksProperty.value );
        const numberOfBallsToRemoveFromField = ballsToRemove - numberOfBallsToRemoveFromQueue;

        // Remove balls from the queue first, and then if any balls to remove remain, remove them from the field.
        this.numberOfQueuedKicksProperty.value -= numberOfBallsToRemoveFromQueue;
        _.times( numberOfBallsToRemoveFromField, () => this.regressLine() );
      }
    } );

    // Define a closure that will instantly set the balance beam to the level position.
    const setBalanceBeamToLevel = () => {
      this.targetLeftBalanceBeamYValue = FULCRUM_HEIGHT;
      this.balanceBeamEndpointYValuesProperty.reset();
    };

    // Define a closure that will update the position of the balance beam and that will allow the change to be animated
    // (via the step function) if possible.
    const updateBalanceBeamTilt = ( animateIfPossible = true ) => {

      // convenience variables
      const fulcrumValue = this.meanPredictionFulcrumValueProperty.value;
      const mean = this.meanValueProperty.value === null ? 0 : this.meanValueProperty.value;
      const xMin = X_AXIS_RANGE.min;
      const xMax = X_AXIS_RANGE.max;

      // The fulcrum is accurate to one tenth of a meter. Round the fulcrum and mean values to that precision.
      const roundedFulcrumValue = Utils.roundToInterval( fulcrumValue, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL );
      const roundedMeanValue = Utils.roundToInterval( mean, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL );

      const tiltedToLeft = roundedMeanValue < roundedFulcrumValue;

      // Create a linear function for the line as it is before making any changes.
      const linearFunctionForPreviousBeamPosition = new LinearFunction(
        xMin,
        xMax,
        this.balanceBeamEndpointYValuesProperty.value.left,
        this.balanceBeamEndpointYValuesProperty.value.right
      );

      // Determine whether the top of the fulcrum is still in contact with the beam.  If it is, that means the beam
      // line can be rotated to the new position, which means it can potentially be animated.
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

      // Use the linear function to figure out where the left end of the beam should be.
      this.targetLeftBalanceBeamYValue = linearFunctionForNewBeamPosition.evaluate( xMin );

      // If the change in the beam's position should be animated, the actual position is not updated here - it is left
      // to the step function to do so.  However, if animation is not desired or not possible, do the update now.
      if ( !animateIfPossible || !fulcrumTipInContactWithOldBeamLine ) {
        this.balanceBeamEndpointYValuesProperty.value = new BalanceBeamEndpointYValues(
          linearFunctionForNewBeamPosition.evaluate( xMin ),
          linearFunctionForNewBeamPosition.evaluate( xMax )
        );
      }
    };

    let fulcrumFixedStateAtLastBeamPositionUpdate = isMeanFulcrumFixedProperty.value;

    // Update the position of the beam as aspects of the underlying model change.
    Multilink.multilink(
      [
        this.beamSupportsPresentProperty,
        this.meanPredictionFulcrumValueProperty,
        this.meanValueProperty,
        isMeanFulcrumFixedProperty
      ],
      ( beamSupportsPresent, meanPredictionFulcrumValue, meanValue, isMeanFulcrumFixed ) => {

        // If the supports are present, if nothing is on the beam, or if the fulcrum is fixed, the beam should be level.
        if ( beamSupportsPresent || meanValue === null || isMeanFulcrumFixed ) {
          setBalanceBeamToLevel();
        }
        else {
          const animateTiltChange = !isMeanFulcrumFixed &&
                                    fulcrumFixedStateAtLastBeamPositionUpdate === isMeanFulcrumFixed;
          updateBalanceBeamTilt( animateTiltChange );
        }

        // Update state for next pass.
        fulcrumFixedStateAtLastBeamPositionUpdate = isMeanFulcrumFixed;
      }
    );

    // Adjust the level of the sound played when the soccer balls are dragged on the field.
    NumberTone.setValueOutputLevel( 0.1 );

    this.soccerBalls.forEach( soccerBall => {
      soccerBall.toneEmitter.addListener( value => {
        NumberTone.playValue( value );
      } );
    } );

    maxKicksProperty.link( maxKicks => {
      this.clearData();
      BalancePointModel.NUMBER_OF_KICKS_RANGE_PROPERTY.value = new Range(
        BalancePointModel.NUMBER_OF_KICKS_RANGE_PROPERTY.value.min,
        maxKicks
      );
    } );
  }

  /**
   * Get a boolean value indicating whether the beam is at the target position.  This is essentially a way to tell if
   * the beam is animating to a new position.
   */
  public isBeamInTargetPosition(): boolean {
    return this.targetLeftBalanceBeamYValue === this.balanceBeamEndpointYValuesProperty.value.left;
  }

  private getKickedBalls(): SoccerBall[] {
    return this.soccerBalls.filter( ball =>
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.FLYING ||
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKING ||
      ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED
    );
  }

  /**
   * Regress the kickers line by removing the last kicked ball from the field.
   */
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

    // Set the next ball to be READY.
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
    const leftEdgeDistanceFromTarget = this.balanceBeamEndpointYValuesProperty.value.left -
                                       this.targetLeftBalanceBeamYValue;
    if ( leftEdgeDistanceFromTarget !== 0 ) {
      const rotationSign = leftEdgeDistanceFromTarget > 0 ? 1 : -1;
      const leftEdgePoint = new Vector2( X_AXIS_RANGE.min, this.balanceBeamEndpointYValuesProperty.value.left );
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
        const leftBalanceBeamYValue = this.targetLeftBalanceBeamYValue;
        const linearFunctionForTargetValue = new LinearFunction(
          X_AXIS_RANGE.min,
          this.meanPredictionFulcrumValueProperty.value,
          this.targetLeftBalanceBeamYValue,
          FULCRUM_HEIGHT
        );
        const rightBalanceBeamYValue = linearFunctionForTargetValue.evaluate( X_AXIS_RANGE.max );
        this.balanceBeamEndpointYValuesProperty.value = new BalanceBeamEndpointYValues(
          leftBalanceBeamYValue,
          rightBalanceBeamYValue
        );
      }
      else {

        // Rotate the end points by the full amount of rotation for this step.
        this.balanceBeamEndpointYValuesProperty.value = new BalanceBeamEndpointYValues(
          rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.min ),
          rotatedBeamLineFunction.evaluate( X_AXIS_RANGE.max )
        );
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

    // The max number of kicks should still be respected after clearing data.
    const max = this.maxKicksProperty.value;
    this.targetNumberOfBallsProperty.value = Math.min( max, this.targetNumberOfBallsProperty.value );
    BalancePointModel.NUMBER_OF_KICKS_RANGE_PROPERTY.value = new Range( BalancePointModel.NUMBER_OF_KICKS_RANGE_PROPERTY.value.min, max );
  }

  public override reset(): void {
    super.reset();
    this.meanPredictionFulcrumValueProperty.reset();
    this.beamSupportsPresentProperty.reset();
  }
}

type BalanceBeamEndpointYValuesStateObject = {
  left: number;
  right: number;
};

export class BalanceBeamEndpointYValues {

  public readonly left: number;
  public readonly right: number;

  public constructor( left: number, right: number ) {
    this.left = left;
    this.right = right;
  }

  /**
   * Serializes this BalanceBeamEndpointYValues instance.
   */
  public toStateObject(): BalanceBeamEndpointYValuesStateObject {
    return {
      left: this.left,
      right: this.right
    };
  }

  /**
   * Deserializes a BalanceBeamEndpointYValues.
   */
  private static fromStateObject( stateObject: BalanceBeamEndpointYValuesStateObject ): BalanceBeamEndpointYValues {
    return new BalanceBeamEndpointYValues( stateObject.left, stateObject.right );
  }

  /**
   * Handles serialization of BalanceBeamEndpointYValues. It implements 'Data Type Serialization', as described in
   * https://github.com/phetsims/phet-io/blob/main/doc/phet-io-instrumentation-technical-guide.md#serialization.
   */
  public static readonly BalanceBeamEndpointYValuesIO = new IOType<IntentionalAny, IntentionalAny>( 'BalanceBeamEndpointYValuesIO', {
    valueType: BalanceBeamEndpointYValues,
    documentation: 'Left and right Y values for the endpoints of the balance beam.',
    stateSchema: {
      left: NumberIO,
      right: NumberIO
    },
    toStateObject: translationAndRotation => translationAndRotation.toStateObject(),
    fromStateObject: stateObject => BalanceBeamEndpointYValues.fromStateObject( stateObject )
  } );
}

meanShareAndBalance.register( 'BalancePointSceneModel', BalancePointSceneModel );