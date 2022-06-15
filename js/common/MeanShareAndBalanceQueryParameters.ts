// Copyright 2022, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

const SCHEMA_MAP = {
  //TODO add schemas for query parameters

  // REVIEW: I recommend deleting this file and usages until the sim starts to need query parameters.
};

const MeanShareAndBalanceQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );

// The schema map is a read-only part of the public API, in case schema details (e.g. validValues) are needed elsewhere.
MeanShareAndBalanceQueryParameters.SCHEMA_MAP = SCHEMA_MAP;

meanShareAndBalance.register( 'MeanShareAndBalanceQueryParameters', MeanShareAndBalanceQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.meanShareAndBalance.MeanShareAndBalanceQueryParameters' );

export default MeanShareAndBalanceQueryParameters;