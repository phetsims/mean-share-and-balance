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
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  position: Vector2; // the cups x & y position in the view
  isActive?: boolean;
  isResettingProperty?: Property<boolean>;
  waterHeightRange?: Range;
  waterLevel?: number;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
  linePlacement: number;
};

type StateObject = {
  position: Vector2;
};

export type WaterCupModelOptions =
  SelfOptions
  & PhetioObjectOptions
  & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class WaterCup extends PhetioObject {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x and y positions for the cup in the view.
  public readonly position: Vector2;

  // The amount of water contained in the cup. 0 is empty, and 1 is full.
  public readonly waterLevelProperty: NumberProperty;

  // This determines the allowed drag range in the slider control
  public readonly enabledRangeProperty: Property<Range>;

  public readonly linePlacement: number;

  public static WaterCupModelIO: IOType<WaterCup>;
  private isResettingProperty: Property<boolean>;

  public constructor( providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, StrictOmit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      waterHeightRange: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ),
      isActive: false,
      isResettingProperty: new BooleanProperty( false ),
      waterLevel: MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT,
      phetioType: WaterCup.WaterCupModelIO
    }, providedOptions );
    super( options );

    this.isActiveProperty = new BooleanProperty( options.isActive );
    this.position = options.position;
    this.isResettingProperty = options.isResettingProperty;
    this.linePlacement = options.linePlacement;

    // When a 3D cup's slider is changed enabledRangeProperty is updated accordingly.
    // If the range shrinks, an out of range adapterProperty will be constrained updating the waterLevels of 2D and 3D cups,
    // which may trigger another change in this enabledRangeProperty requiring reentrant: true
    this.enabledRangeProperty = new Property<Range>( new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ), {
      reentrant: true,
      useDeepEquality: true
    } );
    this.waterLevelProperty = new NumberProperty( options.waterLevel, combineOptions<NumberPropertyOptions>( {
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ),
      tandem: options.tandem.createTandem( 'waterLevelProperty' ),

      // Changing the adapterProperty calls changeWaterLevel, which changes the level of waterLevelProperty,
      // which in turn can change the adapterProperty again.
      reentrant: true
    }, options.waterLevelPropertyOptions ) );

    this.isActiveProperty.lazyLink( isActive => this.partialReset() );
  }

  // these properties are the only ones that should be reset when a cup is no longer active
  private partialReset(): void {
    this.isResettingProperty.set( true );
    this.enabledRangeProperty.reset();
    this.waterLevelProperty.reset();
    this.isResettingProperty.set( false );
  }

  public reset(): void {
    this.partialReset();
    this.isActiveProperty.reset();
  }

  public override dispose(): void {
    super.dispose();
    this.waterLevelProperty.dispose();
    this.enabledRangeProperty.dispose();
  }
}

WaterCup.WaterCupModelIO = new IOType<WaterCup>( 'WaterCupModelIO', {
  valueType: WaterCup,
  toStateObject: ( waterCupModel: WaterCup ) => ( {
    position: waterCupModel.position
  } ),
  stateToArgsForConstructor: ( stateObject: StateObject ) => {
    return [ stateObject.position ];
  },
  stateSchema: {}
} );

meanShareAndBalance.register( 'WaterCup', WaterCup );