// Copyright 2022, University of Colorado Boulder

/**
 * Unit tests for ratio-and-proportion.
 *
 * @author
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import IntroModel from './intro/model/IntroModel.js';
import WaterCup from './intro/model/WaterCup.js';
import MeanShareAndBalanceConstants from './common/MeanShareAndBalanceConstants.js';
import Vector2 from '../../dot/js/Vector2.js';
import Tandem from '../../tandem/js/Tandem.js';

const introModel = new IntroModel( { tandem: Tandem.OPT_OUT } );
const position = new Vector2( 50, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y );
const connectedCups = [ new WaterCup( { waterLevel: 0.5, linePlacement: 0, position: position, tandem: Tandem.OPT_OUT } ),
  new WaterCup( { waterLevel: 0.75, linePlacement: 1, position: position, tandem: Tandem.OPT_OUT } ),
  new WaterCup( { waterLevel: 0.25, linePlacement: 2, position: position, tandem: Tandem.OPT_OUT } )
];

QUnit.test( 'Can calculate amount of water to Distribute', assert => {
  const cup1WaterLevel = connectedCups[ 0 ].waterLevelProperty.value;
  const cup2WaterLevel = connectedCups[ 1 ].waterLevelProperty.value;
  const cup3WaterLevel = connectedCups[ 2 ].waterLevelProperty.value;

  let newWaterLevel = 1;
  const oldWaterLevel = 0.5;
  const waterDeltaAdd = newWaterLevel - oldWaterLevel;

  let waterDistributionAdd = introModel.calculateWaterDistribution( waterDeltaAdd, cup1WaterLevel );
  assert.deepEqual( waterDistributionAdd, 0.5, 'adding distribution matches' );

  waterDistributionAdd = introModel.calculateWaterDistribution( waterDeltaAdd, cup2WaterLevel );
  assert.deepEqual( waterDistributionAdd, 0.25, 'adding distribution over' );

  waterDistributionAdd = introModel.calculateWaterDistribution( waterDeltaAdd, cup3WaterLevel );
  assert.deepEqual( waterDistributionAdd, 0.5, 'adding distribution under' );

  newWaterLevel = 0;
  const waterDeltaRemove = newWaterLevel - oldWaterLevel;

  let waterDistributionRemove = introModel.calculateWaterDistribution( waterDeltaRemove, cup1WaterLevel );
  assert.deepEqual( waterDistributionRemove, -0.5, 'removing distribution matches' );

  waterDistributionRemove = introModel.calculateWaterDistribution( waterDeltaRemove, cup3WaterLevel );
  assert.deepEqual( waterDistributionRemove, -0.25, 'removing distribution over' );

  waterDistributionRemove = introModel.calculateWaterDistribution( waterDeltaRemove, cup2WaterLevel );
  assert.deepEqual( waterDistributionRemove, -0.5, 'removing distribution under' );
} );

QUnit.test( 'Can distribute water', assert => {
  let waterDelta = 0.5;

  introModel.distributeWater( connectedCups, connectedCups[ 0 ], waterDelta );
  assert.deepEqual( connectedCups[ 0 ].waterLevelProperty.value, 1, 'add distribution to 1 cup' );
  connectedCups[ 0 ].reset();

  introModel.distributeWater( connectedCups, connectedCups[ 1 ], waterDelta );
  assert.deepEqual( connectedCups[ 1 ].waterLevelProperty.value, 1, 'add distribution to 2 cups' );
  assert.deepEqual( connectedCups[ 0 ].waterLevelProperty.value, 0.75, 'add distribution to 2 cups' );
  assert.deepEqual( connectedCups[ 2 ].waterLevelProperty.value, 0.25, 'add distribution to 2 cups' );
  connectedCups[ 0 ].reset();
  connectedCups[ 1 ].reset();
  connectedCups[ 2 ].reset();

  waterDelta = -0.5;
  introModel.distributeWater( connectedCups, connectedCups[ 0 ], waterDelta );
  assert.deepEqual( connectedCups[ 0 ].waterLevelProperty.value, 0, 'remove distribution to 1 cup' );
  connectedCups[ 0 ].reset();

  introModel.distributeWater( connectedCups, connectedCups[ 2 ], waterDelta );
  assert.deepEqual( connectedCups[ 0 ].waterLevelProperty.value, 0.5, 'remove distribution to 2 cups' );
  assert.deepEqual( connectedCups[ 1 ].waterLevelProperty.value, 0.5, 'remove distribution to 2 cups' );
  assert.deepEqual( connectedCups[ 2 ].waterLevelProperty.value, 0, 'remove distribution to 2 cups' );
} );

qunitStart();