// Copyright 2022, University of Colorado Boulder

/**
 * Parent class for all water cups
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import WaterCup2DModel from './WaterCup2DModel.js';
import WaterCup3DModel from './WaterCup3DModel.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  x: number;
};
export type WaterCupModelOptions = SelfOptions & PhetioObjectOptions;

export default class WaterCupModel extends PhetioObject {
  readonly xProperty: NumberProperty;
  readonly waterLevelProperty: NumberProperty;
  //TODO determine if children actually needed
  readonly waterCup2DChild: WaterCup2DModel;
  readonly waterCup3DChild: WaterCup3DModel;
  static WaterCupModelIO: IOType<WaterCupModel>;

  constructor( providedOptions?: WaterCupModelOptions ) {
    const options = optionize<WaterCupModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: WaterCupModel.WaterCupModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.xProperty = new NumberProperty( options.x );
    this.waterLevelProperty = new NumberProperty( 0.5, {
      range: new Range( 0, 1 )
    } );

    this.waterCup2DChild = new WaterCup2DModel( this );
    this.waterCup3DChild = new WaterCup3DModel( this );
  }
}

WaterCupModel.WaterCupModelIO = new IOType<WaterCupModel>( 'WaterCupModelIO', {
  valueType: WaterCupModel
} );

meanShareAndBalance.register( 'WaterCupModel', WaterCupModel );