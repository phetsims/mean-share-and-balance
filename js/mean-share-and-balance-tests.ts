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

function testApproximatelyEquals( actual: number[], expected: number[], tolerance: number, assert: Assert, message: string ) {
  assert.equal( actual.length, expected.length, message );

  let failed = false;
  for ( let i = 0; i < actual.length; i++ ) {


    if ( Math.abs( actual[ i ] - expected[ i ] ) > tolerance ) {
      failed = true;
    }
  }
  assert.ok( !failed, message + ', expected = ' + expected + ', actual = ' + actual );
}


QUnit.test( 'Can calculate amount of water to Distribute', assert => {
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( 0.1, 0.5 ), 0.1, 'adding distribution under' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( 0.2, 0.5 ), 0.2, 'adding distribution under' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( 0.5, 0.5 ), 0.5, 'adding distribution matches' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( 0.6, 0.5 ), 0.5, 'adding distribution over' );

  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( -0.1, 0.5 ), -0.1, 'removing distribution under' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( -0.2, 0.5 ), -0.2, 'removing distribution under' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( -0.5, 0.5 ), -0.5, 'removing distribution matches' );
  assert.deepEqual( introModel[ 'calculateWaterDistribution' ]( -0.6, 0.5 ), -0.5, 'removing distribution over' );
} );

QUnit.test( 'Can distribute water', assert => {

  function testDistribution( waterLevels: number[], waterDelta: number, index: number, expectedLevels: number[], message: string ): void {
    const connectedCups = waterLevels.map( ( waterLevel, index ) => {
      return new WaterCup( { waterLevel: waterLevel, linePlacement: index, position: position, tandem: Tandem.OPT_OUT } );
    } );
    introModel[ 'distributeWater' ]( connectedCups, connectedCups[ index ], waterDelta );

    const actual = connectedCups.map( cup => cup.waterLevelProperty.value );
    testApproximatelyEquals( actual, expectedLevels, 1E-8, assert, message );
  }

  testDistribution( [ 0.5, 0.75, 0.25 ], 0.5, 0, [ 1.0, 0.75, 0.25 ], 'One cup can accept all the water' );

  // TODO: Can the overflow water be evenly distributed to neighbors?
  testDistribution( [ 0.5, 0.75, 0.25 ], 0.5, 1, [ 0.75, 1.0, 0.25 ], 'Overflow water all goes to the lowest index neighbor' );
  testDistribution( [ 0.5, 0.75, 0.25 ], -0.5, 0, [ 0.0, 0.75, 0.25 ], 'One cup can lose all its water' );
  testDistribution( [ 0.5, 0.75, 0.25 ], -0.5, 2, [ 0.5, 0.5, 0.0 ], 'One cup can lose all its water' );
  testDistribution( [ 0.9, 1.0, 0 ], 0.2, 0, [ 1.0, 1.0, 0.1 ], 'Flowing two cups away' );

  testDistribution( [ 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.6 ], 1.0, 1, [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 ], 'Filling all the cups' );
  testDistribution( [ 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1 ], -0.7, 3, [ 0, 0, 0, 0, 0, 0, 0 ], 'Emptying all the cups' );
} );

qunitStart();