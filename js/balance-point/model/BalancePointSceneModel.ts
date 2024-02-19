// Copyright 2024, University of Colorado Boulder
/**
 * The BalancePointSceneModel has the soccer ball information for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerSceneModel, { SoccerSceneModelOptions } from '../../../../soccer-common/js/model/SoccerSceneModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DerivedProperty, NumberProperty, Property, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import KickDistributionStrategy from '../../../../soccer-common/js/model/KickDistributionStrategy.js';
import Range from '../../../../dot/js/Range.js';
import SoccerBall from '../../../../soccer-common/js/model/SoccerBall.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';
import Utils from '../../../../dot/js/Utils.js';

type BalancePointSceneModelOptions = SoccerSceneModelOptions;
export default class BalancePointSceneModel extends SoccerSceneModel {

  public readonly totalKickDistanceProperty: TReadOnlyProperty<number>;
  public readonly numberOfKickedBallsProperty: Property<number>;

  public constructor( regionAndCulturePortrayalProperty: Property<RegionAndCulturePortrayal>, options: BalancePointSceneModelOptions ) {
    const maxKicksProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

    const kickDistributionStrategy = new KickDistributionStrategy(
      'randomSkew',
      null,
      'right'
    );

    const kickRange = new Range( 0, 10 );

    const createSoccerBall = ( isFirstSoccerBall: boolean, tandem: Tandem ) => {
      return new SoccerBall( isFirstSoccerBall, tandem );
    };

    super(
      maxKicksProperty,
      [ 7 ],
      kickDistributionStrategy,
      kickRange,
      createSoccerBall,
      regionAndCulturePortrayalProperty,
      options
    );
    const valueDependencies = this.soccerBalls.map( ball => ball.valueProperty );
    const phaseDependencies = this.soccerBalls.map( ball => ball.soccerBallPhaseProperty );
    const positionDependencies = this.soccerBalls.map( ball => ball.positionProperty );
    this.totalKickDistanceProperty = DerivedProperty.deriveAny( [ ...valueDependencies, ...phaseDependencies, ...positionDependencies ], () => {
      const activeBalls = this.getSortedStackedObjects();
      return activeBalls.length > 0 ? _.sumBy( this.getSortedStackedObjects(), ball => ball.valueProperty.value! ) : 0;
    } );

    this.numberOfKickedBallsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_SOCCER_BALLS, {
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'numberOfKickedBallsProperty' )
    } );

    this.numberOfKickedBallsProperty.lazyLink( ( newValue, oldValue ) => {
      const delta = newValue - oldValue;
      if ( delta > 0 ) {
        this.scheduleKicks( delta );
      }
      else if ( delta < 0 ) {
        this.regressLine();
      }
    } );
  }

  private regressLine(): void {
    this.activeKickIndexProperty.value = Utils.clamp( this.activeKickIndexProperty.value - 1, 0, this.maxKicksProperty.value - 1 );

    // Remove last kicked ball from field
    const kickedBalls = this.getActiveSoccerBalls().filter( ball => {
      return ball.soccerBallPhaseProperty.value === SoccerBallPhase.FLYING ||
             ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKING ||
             ball.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED;
    } );

    const lastBall = kickedBalls[ kickedBalls.length - 1 ];
    const lastBallValue = lastBall.valueProperty.value!;
    lastBall.soccerBallPhaseProperty.value = SoccerBallPhase.INACTIVE;

    const stack = this.getStackAtValue( lastBallValue );
    this.reorganizeStack( stack );

    // Set the next ball to be READY
    const unkickedBalls = this.soccerBalls.filter( ball =>
                          ball.soccerBallPhaseProperty.value === SoccerBallPhase.INACTIVE ||
                          ball.soccerBallPhaseProperty.value === SoccerBallPhase.READY ) || null;
    if ( unkickedBalls[ 0 ] && this.soccerBalls.indexOf( unkickedBalls[ 0 ] ) < this.maxKicksProperty.value ) {
      unkickedBalls[ 0 ].soccerBallPhaseProperty.value = SoccerBallPhase.READY;
    }
  }

  public override reset(): void {
    this.numberOfKickedBallsProperty.reset();
  }
}

meanShareAndBalance.register( 'BalancePointSceneModel', BalancePointSceneModel );