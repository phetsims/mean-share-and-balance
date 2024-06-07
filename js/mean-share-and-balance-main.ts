// Copyright 2022-2024, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import MeanShareAndBalanceStrings from './MeanShareAndBalanceStrings.js';
import LevelOutScreen from './level-out/LevelOutScreen.js';
import DistributeScreen from './distribute/DistributeScreen.js';
import FairShareScreen from './fair-share/FairShareScreen.js';
import BalancePointScreen from './balance-point/BalancePointScreen.js';

const simOptions: SimOptions = {

  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Marla Schulz, Sam Reid',
    team: 'Kelly Findley, Marilyn Hartzell, Ariel Paul, Kathy Perkins, David Webb',
    qualityAssurance: 'Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer, Amanda McGarry'
    // soundDesign: '',
    // thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( MeanShareAndBalanceStrings[ 'mean-share-and-balance' ].titleStringProperty, [
    new LevelOutScreen( { tandem: Tandem.ROOT.createTandem( 'levelOutScreen' ) } ),
    new DistributeScreen( { tandem: Tandem.ROOT.createTandem( 'distributeScreen' ) } ),
    new FairShareScreen( { tandem: Tandem.ROOT.createTandem( 'fairShareScreen' ) } ),
    new BalancePointScreen(
      { tandem: Tandem.ROOT.createTandem( 'balancePointScreen' ) } )
  ], simOptions );
  sim.start();
} );