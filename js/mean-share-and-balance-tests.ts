// Copyright 2022, University of Colorado Boulder

/**
 * Unit tests for Mean: Share and Balance
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import IntroModel from './intro/model/IntroModel.js';
import WaterCup from './intro/model/WaterCup.js';
import MeanShareAndBalanceConstants from './common/MeanShareAndBalanceConstants.js';
import Vector2 from '../../dot/js/Vector2.js';
import Tandem from '../../tandem/js/Tandem.js';

const introModel = new IntroModel( { tandem: Tandem.OPT_OUT } );
const position = new Vector2( 50, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y );

function testApproximatelyEquals( actual: number[], expected: number[], tolerance: number, assert: Assert, message: string ): void {
  assert.equal( actual.length, expected.length, message );

  let failed = false;
  for ( let i = 0; i < actual.length; i++ ) {


    if ( Math.abs( actual[ i ] - expected[ i ] ) > tolerance ) {
      failed = true;
    }
  }
  assert.ok( !failed, message + ', expected = ' + expected + ', actual = ' + actual );
}

QUnit.test( 'distribute ripple', assert => {
  function testDistribution( waterLevels: number[], waterDelta: number, expectedLevels: number[], message: string ): void {
    const connectedCups = waterLevels.map( ( waterLevel, index ) => {
      return new WaterCup( Tandem.OPT_OUT, { isActive: true, waterLevel: waterLevel, linePlacement: index, position: position } );
    } );
    introModel[ 'distributeWaterRipple' ]( connectedCups, connectedCups[ 2 ], waterDelta );

    const actual = connectedCups.map( cup => cup.waterLevelProperty.value );
    testApproximatelyEquals( actual, expectedLevels, 1E-8, assert, message );
  }

  testDistribution( [ 0, 0, 1, 0, 0 ], 1, [ 0.06, 0.2, 1, 0.2, 0.06 ], 'center cup rippling out, first pass' );
  // testDistribution( [ 0, 0.1, 0.8, 0.1, 0 ], [ 0.01, 0.17, 0.64, 0.17, 0.01 ], 'center cup rippling out, second pass' );
  // testDistribution( [ 0.01, 0.17, 0.64, 0.17, 0.01 ], [ 0.027, 0.217, 0.512, 0.217, 0.027 ], 'center cup rippling out, second pass' );

} );

qunitStart();