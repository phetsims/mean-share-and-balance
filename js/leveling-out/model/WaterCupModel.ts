// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2 & 3 water cup models.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import IOType from '../../../../tandem/js/types/IOType.js';

type SelfOptions = {
  x: number;
  y: number;
};
export type AbstractWaterCupModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCupModel extends PhetioObject {
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;
  readonly xProperty: NumberProperty;
  static WaterCupModelIO: IOType<WaterCupModel>;

  constructor( providedOptions: AbstractWaterCupModelOptions ) {
    super( providedOptions );

    this.xProperty = new NumberProperty( providedOptions.x );
    this.y = providedOptions.y;
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      range: new Range( 0, 1 )
    } );
  }
}

WaterCupModel.WaterCupModelIO = new IOType<WaterCupModel>( 'WaterCupModelIO', {
  valueType: WaterCupModel,
  toStateObject: ( waterCupModel: WaterCupModel ) => ( {} ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ 0 ];
  },
  stateSchema: {
    // initialPlaceInLine: NumberIO
  }
} );