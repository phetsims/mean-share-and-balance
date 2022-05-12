// Copyright 2022, University of Colorado Boulder

/**
 * Base class for the 2D water cup, containing water level data point
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
type WaterCup2DModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCup2DModel extends AbstractWaterCupModel {
  static WaterCup2DModelIO: IOType<WaterCup2DModel>;
  constructor( providedOptions: WaterCup2DModelOptions ) {

    const options = optionize<WaterCup2DModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: WaterCup2DModel.WaterCup2DModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );
    super( options );
  }

  override dispose(): void {
    super.dispose();
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