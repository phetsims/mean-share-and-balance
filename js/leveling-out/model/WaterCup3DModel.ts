// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 3D water cup, containing water level data point
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AbstractWaterCupModel from './AbstractWaterCupModel.js';

type SelfOptions = {
  x: number;
  y: number;
};
type WaterCup3DModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCup3DModel extends AbstractWaterCupModel {
  static WaterCup3DModelIO: IOType<WaterCup3DModel>;

  constructor( providedOptions: WaterCup3DModelOptions ) {

    const options = optionize<WaterCup3DModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: WaterCup3DModel.WaterCup3DModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );
    super( options );
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