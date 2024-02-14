// Copyright 2023, University of Colorado Boulder
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
import JoistStrings from '../../../../joist/js/JoistStrings.js';

type BalancePointSceneModelOptions = SoccerSceneModelOptions;
export default class BalancePointSceneModel extends SoccerSceneModel {

  public readonly totalKickDistanceProperty: TReadOnlyProperty<number>;

  public constructor( options: BalancePointSceneModelOptions ) {
    const maxKicksProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      tandem: options.tandem.createTandem( 'maxKicksProperty' )
    } );

    const kickDistributionStrategy = new KickDistributionStrategy(
      'randomSkew',
      null,
      null
    );

    const kickRange = new Range( 0, 10 );

    const createSoccerBall = ( isFirstSoccerBall: boolean, tandem: Tandem ) => {
      return new SoccerBall( isFirstSoccerBall, tandem );
    };

    // TODO: replace with actual region and culture property, see: https://github.com/phetsims/mean-share-and-balance/issues/152
    const tempRegionAndCultureProperty = new Property(
      new RegionAndCulturePortrayal(
        JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
        'usa'
      ) );

    super(
      maxKicksProperty,
      [ 7 ],
      kickDistributionStrategy,
      kickRange,
      createSoccerBall,
      tempRegionAndCultureProperty,
      options
    );
    const valueDependencies = this.soccerBalls.map( ball => ball.valueProperty );
    const phaseDependencies = this.soccerBalls.map( ball => ball.soccerBallPhaseProperty );
    this.totalKickDistanceProperty = DerivedProperty.deriveAny( [ ...valueDependencies, ...phaseDependencies ], () => {
      const activeBalls = this.getActiveSoccerBalls();
      return activeBalls.length > 0 ? _.sumBy( this.getActiveSoccerBalls(), ball => ball.valueProperty.value! ) : 0;
    } );
  }
}

meanShareAndBalance.register( 'BalancePointSceneModel', BalancePointSceneModel );