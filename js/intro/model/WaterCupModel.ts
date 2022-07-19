// Copyright 2022, University of Colorado Boulder

/**
 * Class for 2D & 3D water cup models.
 * A water cup holds a certain level of water that can be manipulated by the user.
 * A cup is empty when waterLevelProperty.value = 0, and full when waterLevelProperty.value = 1
 * Water level is controlled in the 3D view representation through a vertical slider.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';
import Emitter from '../../../../axon/js/Emitter.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {
  x: number; // The cup's x-position in the view
  y: number; // THe cup's y-position in the view
  isActive?: boolean;
  waterHeightRange?: Range;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
};

type StateObject = {
  x: number;
  y: number;
};

export type WaterCupModelOptions =
  SelfOptions
  & PhetioObjectOptions
  & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCupModel extends PhetioObject {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: BooleanProperty;

  // The x and y positions for the cup in the view.
  public readonly x: number;
  public readonly y: number;

  // The amount of water contained in the cup. 0 is empty, and 1 is full.
  public readonly waterLevelProperty: NumberProperty;

  // Emits when reset is called
  public readonly resetEmitter: Emitter;

  // This determines the allowed drag range in the slider control
  public readonly enabledRangeProperty: Property<Range>;

  public static WaterCupModelIO: IOType<WaterCupModel>;

  public constructor( providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, StrictOmit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      waterHeightRange: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ),
      isActive: false,
      phetioType: WaterCupModel.WaterCupModelIO
    }, providedOptions );
    super( options );

    this.isActiveProperty = new BooleanProperty( options.isActive );
    this.x = options.x;
    this.y = options.y;
    this.resetEmitter = new Emitter();

    // When a 3D cup's slider is changed enabledRangeProperty is updated accordingly.
    // If the range shrinks, an out of range adapterProperty will be constrained updating the waterLevels of 2D and 3D cups,
    // which may trigger another change in this enabledRangeProperty requiring reentrant: true
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
    this.isActiveProperty.reset();
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
  stateToArgsForConstructor: ( stateObject: StateObject ) => {
    return [ stateObject.x ];
  },
  stateSchema: {
    x: NumberIO
  }
} );