// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import MeanShareAndBalanceScreen from './mean-share-and-balance/MeanShareAndBalanceScreen.js';
import meanShareAndBalanceStrings from './meanShareAndBalanceStrings.js';

const meanShareAndBalanceTitleString = meanShareAndBalanceStrings[ 'mean-share-and-balance' ].title;

const simOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( meanShareAndBalanceTitleString, [
    new MeanShareAndBalanceScreen( { tandem: Tandem.ROOT.createTandem( 'meanShareAndBalanceScreen' ) } )
  ], simOptions );
  sim.start();
} );