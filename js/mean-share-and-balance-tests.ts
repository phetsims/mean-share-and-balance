// Copyright 2022-2024, University of Colorado Boulder

/**
 * Unit tests for Mean: Share and Balance
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import LevelOutModel from './level-out/model/LevelOutModel.js';
import Cup from './level-out/model/Cup.js';
import Tandem from '../../tandem/js/Tandem.js';

const levelOutModel = new LevelOutModel( { tandem: Tandem.OPT_OUT } );
const xPosition = 50;

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

// Test the distributeWaterRipple method to ensure the water levels are evenly distributing across the connected cups.
// The closest cups will receive water first, and then the water will ripple out to the other connected cups.
QUnit.test( 'distribute ripple', assert => {
  function testDistribution( waterLevels: number[], waterDelta: number, expectedLevels: number[], message: string ): void {
    const connectedCups = waterLevels.map( ( waterLevel, index ) => {
      return new Cup( Tandem.OPT_OUT, {
        isActive: true,
        waterLevel: waterLevel,
        linePlacement: index,
        xPosition: xPosition,
        isTableCup: false
      } );
    } );
    levelOutModel[ 'distributeWaterRipple' ]( connectedCups, connectedCups[ 2 ], waterDelta );

    const actual = connectedCups.map( cup => cup.waterLevelProperty.value );
    testApproximatelyEquals( actual, expectedLevels, 1E-8, assert, message );
  }

  testDistribution( [ 0, 0, 1, 0, 0 ], 1, [ 0.06, 0.2, 1, 0.2, 0.06 ], 'center cup rippling out, first pass' );
} );

qunitStart();