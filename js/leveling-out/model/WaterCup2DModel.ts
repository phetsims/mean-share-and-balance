// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 2D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Range from '../../../../dot/js/Range.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  x: number;
};
type WaterCup2DModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCup2DModel extends PhetioObject {
  readonly y = 200;
  readonly waterLevelProperty: NumberProperty;
  static WaterCup2DModelIO: IOType<WaterCup2DModel>;
  readonly xProperty: NumberProperty;

  constructor( providedOptions: WaterCup2DModelOptions ) {

    const options = optionize<WaterCup2DModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: WaterCup2DModel.WaterCup2DModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );
    super( options );
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      range: new Range( 0, 1 )
    } );
    this.xProperty = new NumberProperty( options.x );
  }
}

WaterCup2DModel.WaterCup2DModelIO = new IOType<WaterCup2DModel>( 'WaterCup2DModelIO', {
  valueType: WaterCup2DModel,
  toStateObject: ( waterCupModel: WaterCup2DModel ) => ( {} ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ 0 ];
  },
  stateSchema: {
    // initialPlaceInLine: NumberIO
  }
} );

meanShareAndBalance.register( 'WaterCup2DModel', WaterCup2DModel );