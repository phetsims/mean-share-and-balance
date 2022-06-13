// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2 & 3 water cup models.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
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

type stateObject = {
  x: number;
  y: number;
};

export type WaterCupModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCupModel extends PhetioObject {
  public readonly x: number;
  public readonly y: number;
  public readonly waterLevelProperty: NumberProperty;
  public readonly resetEmitter: Emitter;

  // This determines the allowed drag range in the slider control
  public readonly enabledRangeProperty: Property<Range>;

  public static WaterCupModelIO: IOType<WaterCupModel>;

  public constructor( providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, StrictOmit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
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

  public reset(): void {
    this.resetEmitter.emit();
    this.enabledRangeProperty.reset();
    this.waterLevelProperty.reset();
  }

  public override dispose(): void {
    super.dispose();
    this.waterLevelProperty.dispose();
    this.enabledRangeProperty.dispose();
    this.resetEmitter.dispose();
  }
}

WaterCupModel.WaterCupModelIO = new IOType<WaterCupModel>( 'WaterCupModelIO', {
  valueType: WaterCupModel,
  toStateObject: ( waterCupModel: WaterCupModel ) => ( {
    x: waterCupModel.x
  } ),
  stateToArgsForConstructor: ( stateObject: stateObject ) => {
    return [ stateObject.x ];
  },
  stateSchema: {
    x: NumberIO
  }
} );