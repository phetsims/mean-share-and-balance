// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 3D water cup, containing water level data point
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
type WaterCup3DModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCup3DModel extends PhetioObject {
  readonly y = 400;
  readonly waterLevelProperty: NumberProperty;
  static WaterCup3DModelIO: IOType<WaterCup3DModel>;
  xProperty: NumberProperty;

  constructor( providedOptions: WaterCup3DModelOptions ) {

    const options = optionize<WaterCup3DModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: WaterCup3DModel.WaterCup3DModelIO,
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

WaterCup3DModel.WaterCup3DModelIO = new IOType<WaterCup3DModel>( 'WaterCup3DModelIO', {
  valueType: WaterCup3DModel,
  toStateObject: ( waterCupModel: WaterCup3DModel ) => ( {} ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ 0 ];
  },
  stateSchema: {
    // initialPlaceInLine: NumberIO
  }
} );

meanShareAndBalance.register( 'WaterCup3DModel', WaterCup3DModel );