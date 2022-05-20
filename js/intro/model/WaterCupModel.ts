// Copyright 2022, University of Colorado Boulder

/**
 * Abstract parent class for 2 & 3 water cup models.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = {
  x: number;
  y: number;
  waterHeightRange?: Range;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
};
export type WaterCupModelOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCupModel extends PhetioObject {
  readonly y: number;
  readonly waterLevelProperty: NumberProperty;
  readonly xProperty: NumberProperty;
  static WaterCupModelIO: IOType<WaterCupModel>;
  waterHeightRange: Range;

  constructor( providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, Omit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      phetioType: WaterCupModel.WaterCupModelIO,
      phetioDynamicElement: true,
      waterHeightRange: new Range( 0, 1 )
    }, providedOptions );
    super( options );

    this.xProperty = new NumberProperty( options.x );
    this.y = options.y;
    this.waterHeightRange = options.waterHeightRange;
    this.waterLevelProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, combineOptions<NumberPropertyOptions>( {
      range: new Range( 0, 1 ),
      tandem: options.tandem.createTandem( 'waterLevelProperty' )
    }, options.waterLevelPropertyOptions ) );
  }

  override dispose(): void {
    super.dispose();
    this.waterLevelProperty.dispose();
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