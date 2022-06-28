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
  //REVIEW non-obvious options are supposed to be documented where defined, and these are not obvious to the reviewer
  x: number;
  y: number;
  waterHeightRange?: Range;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
};

type stateObject = {
  x: number;
  y: number;
};

//REVIEW Shouldn't 'phetioType' | 'phetioDynamicElement' be omitted from PhetioObjectOptions?
export type WaterCupModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCupModel extends PhetioObject {

  //REVIEW non-obvious fields are supposed to be documented where declared, and these are not obvious to the reviewer
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
      waterHeightRange: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX )
    }, providedOptions );
    super( options );

    this.x = options.x;
    this.y = options.y;
    this.resetEmitter = new Emitter();
    //REVIEW document why reentrant:true is needed here, because we typically try to avoid that
    this.enabledRangeProperty = new Property<Range>( new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ), { reentrant: true } );
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, combineOptions<NumberPropertyOptions>( {
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ),
      tandem: options.tandem.createTandem( 'waterLevelProperty' ),

      // Changing the adapterProperty calls changeWaterLevel, which changes the level of waterLevelProperty,
      // which in turn can change the adapterProperty again.
      reentrant: true
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