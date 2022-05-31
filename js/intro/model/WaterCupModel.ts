// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2 & 3 water cup models.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import OmitStrict from '../../../../phet-core/js/types/OmitStrict.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Property from '../../../../axon/js/Property.js';
import Emitter from '../../../../axon/js/Emitter.js';

type SelfOptions = {
  x: number;
  y: number;
  waterHeightRange?: Range;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
};
export type WaterCupModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCupModel extends PhetioObject {
  readonly x: number;
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;
  static WaterCupModelIO: IOType<WaterCupModel>;

  // This determines the allowed drag range in the slider control
  readonly enabledRangeProperty: Property<Range>;
  readonly resetEmitter: Emitter;

  constructor( providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, OmitStrict<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      phetioType: WaterCupModel.WaterCupModelIO,
      phetioDynamicElement: true,
      waterHeightRange: new Range( 0, 1 )
    }, providedOptions );
    super( options );

    this.x = options.x;
    this.y = options.y;
    this.resetEmitter = new Emitter();
    this.enabledRangeProperty = new Property<Range>( new Range( 0, 1 ), { reentrant: true } );
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, combineOptions<NumberPropertyOptions>( {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'waterLevelProperty' )
    }, options.waterLevelPropertyOptions ) );
  }

  reset(): void {
    this.resetEmitter.emit();
    this.enabledRangeProperty.reset();
    this.waterLevelProperty.reset();
  }

  override dispose(): void {
    super.dispose();
    this.waterLevelProperty.dispose();
  }
}

WaterCupModel.WaterCupModelIO = new IOType<WaterCupModel>( 'WaterCupModelIO', {
  valueType: WaterCupModel,
  toStateObject: ( waterCupModel: WaterCupModel ) => ( {
    x: waterCupModel.x
  } ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ stateObject.x ];
  },
  stateSchema: {
    x: NumberIO
  }
} );