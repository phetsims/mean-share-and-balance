// Copyright 2022, University of Colorado Boulder

/**
 * Query parameters supported by the Mean: Share and Balance simulation.
 * Running with ?log will print these query parameters and their values to the console at startup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

const SCHEMA_MAP = {
  showAnimation: {
    type: 'boolean',
    defaultValue: true
  }
} as const;

const MeanShareAndBalanceQueryParameters = QueryStringMachine.getAll( SCHEMA_MAP );
export default MeanShareAndBalanceQueryParameters;

meanShareAndBalance.register( 'MeanShareAndBalanceQueryParameters', MeanShareAndBalanceQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.meanShareAndBalance.MeanShareAndBalanceQueryParameters' );