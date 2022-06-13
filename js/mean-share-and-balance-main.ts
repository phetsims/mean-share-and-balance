// Copyright 2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import meanShareAndBalanceStrings from './meanShareAndBalanceStrings.js';
import IntroScreen from './intro/IntroScreen.js';

const meanShareAndBalanceTitleString = meanShareAndBalanceStrings[ 'mean-share-and-balance' ].title;

const simOptions: SimOptions = {

  //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
  credits: {
    leadDesign: '',
    softwareDevelopment: 'Marla Schulz, Sam Reid',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  },
  hasKeyboardHelpContent: true
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( meanShareAndBalanceTitleString, [
    new IntroScreen( { tandem: Tandem.ROOT.createTandem( 'levelingOutScreen' ) } )
  ], simOptions );
  sim.start();
} );