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

type BalancePointSceneModelOptions = SoccerSceneModelOptions;

const X_AXIS_RANGE = new Range(
  MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.min - 1,
  MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.max + 1
);
export const FULCRUM_HEIGHT = 0.7; // in meters
const PARTIAL_TILT_SPAN = 0.5; // in meters, distance from fulcrum to mean where beam tilts partially, not completely

export default class BalancePointSceneModel extends SoccerSceneModel {

  // Controls whether the column supports for the beam are present or not, fixing the beam in a horizontal position
  // when present, and allowing the beam to tilt when not.
  public readonly beamSupportsPresentProperty: BooleanProperty;

  public readonly totalKickDistanceProperty: TReadOnlyProperty<number>;
  public readonly targetNumberOfBallsProperty: Property<number>;
  public readonly fulcrumValueProperty: Property<number>;

  // The position of the balance beam is determined by the x and y values of the left and right end points of the line.
  // The x values never vary.
  public readonly leftBalanceBeamYValueProperty: Property<number>;
  public readonly leftBalanceBeamXValue = X_AXIS_RANGE.min;
  public readonly rightBalanceBeamYValueProperty: Property<number>;
  public readonly rightBalanceBeamXValue = X_AXIS_RANGE.max;

  public constructor( isMeanFulcrumFixedProperty: BooleanProperty,
                      options: BalancePointSceneModelOptions ) {

    const maxKicksProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

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
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'targetNumberOfBallsProperty' )
    } );

    this.targetNumberOfBallsProperty.lazyLink( ( newValue, oldValue ) => {
      const delta = newValue - oldValue;
      if ( delta > 0 ) {
        this.scheduleKicks( delta );
      }

        // TODO: JB am I creating a listener order dependency here? https://github.com/phetsims/mean-share-and-balance/issues/196
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

    this.fulcrumValueProperty = new NumberProperty( MeanShareAndBalanceConstants.FULCRUM_DEFAULT_POSITION, {
      tandem: options.tandem.createTandem( 'fulcrumValueProperty' )
    } );

    this.leftBalanceBeamYValueProperty = new NumberProperty( FULCRUM_HEIGHT, {
      tandem: options.tandem.createTandem( 'leftBalanceBeamYValueProperty' )
    } );
    this.rightBalanceBeamYValueProperty = new NumberProperty( FULCRUM_HEIGHT, {
      tandem: options.tandem.createTandem( 'rightBalanceBeamYValueProperty' )
    } );

    // Update the position of the beam as other aspects of the model change.
    Multilink.multilink(
      [
        this.beamSupportsPresentProperty,
        this.fulcrumValueProperty,
        this.meanValueProperty,
        isMeanFulcrumFixedProperty
      ],
      ( supportsPresent, fulcrumValue, mean, isFulcrumFixed ) => {

        const roundedMean = mean === null ?
                            null :
                            Utils.roundToInterval( mean, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL );

        // If the supports are present, if nothing is on the beam, or if the fulcrum is at the fixed mean position then
        // the beam is horizontal.
        if ( supportsPresent || mean === null || isFulcrumFixed || fulcrumValue === roundedMean ) {
          this.leftBalanceBeamYValueProperty.value = FULCRUM_HEIGHT;
          this.rightBalanceBeamYValueProperty.value = FULCRUM_HEIGHT;
        }
        else {

          // convenience variables
          const xMin = X_AXIS_RANGE.min;
          const xMax = X_AXIS_RANGE.max;
          const tiltedToLeft = mean < fulcrumValue;

          // Create a linear function for the line that represents where the beam is in model space.
          let linearFunctionForBeam;
          const distanceFromFulcrumToMean = Math.abs( fulcrumValue - mean );
          if ( distanceFromFulcrumToMean < PARTIAL_TILT_SPAN ) {
            const lowerEdgeHeight = ( 1 - distanceFromFulcrumToMean / PARTIAL_TILT_SPAN ) * FULCRUM_HEIGHT;
            linearFunctionForBeam = tiltedToLeft ?
                                    new LinearFunction( xMin, fulcrumValue, lowerEdgeHeight, FULCRUM_HEIGHT ) :
                                    new LinearFunction( fulcrumValue, xMax, FULCRUM_HEIGHT, lowerEdgeHeight );
          }
          else {
            linearFunctionForBeam = tiltedToLeft ?
                                    new LinearFunction( xMin, fulcrumValue, 0, FULCRUM_HEIGHT ) :
                                    new LinearFunction( fulcrumValue, xMax, FULCRUM_HEIGHT, 0 );
          }

          // Use the linear function to set the Y values of the beam's end points.
          this.leftBalanceBeamYValueProperty.value = linearFunctionForBeam.evaluate( xMin );
          this.rightBalanceBeamYValueProperty.value = linearFunctionForBeam.evaluate( xMax );
        }
      }
    );

    this.soccerBalls.forEach( soccerBall => {
      soccerBall.toneEmitter.addListener( value => {
        NumberTone.playValue( value );
      } );
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
    this.fulcrumValueProperty.reset();
    this.beamSupportsPresentProperty.reset();
  }
}

meanShareAndBalance.register( 'BalancePointSceneModel', BalancePointSceneModel );