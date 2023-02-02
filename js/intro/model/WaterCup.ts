// Copyright 2022-2023, University of Colorado Boulder

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
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Property from '../../../../axon/js/Property.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = {
  position: Vector2; // the cups x & y position in the view
  isActive: boolean;
  waterHeightRange?: Range;
  waterLevel?: number;
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
  linePlacement: number;
};

export type WaterCupModelOptions = SelfOptions;

export default class WaterCup {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x and y positions for the cup in the view.
  public readonly position: Vector2;

  // The amount of water contained in the cup. 0 is empty, and 1 is full.
  public readonly waterLevelProperty: NumberProperty;

  // This determines the allowed drag range in the slider control
  public readonly enabledRangeProperty: Property<Range>;

  public readonly linePlacement: number;

  public constructor( tandem: Tandem, providedOptions: WaterCupModelOptions ) {

    const options = optionize<WaterCupModelOptions, StrictOmit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      waterHeightRange: new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ),
      waterLevel: MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT
    }, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {
      // phet-io
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );
    this.position = options.position;
    this.linePlacement = options.linePlacement;

    // When a 3D cup's slider is changed enabledRangeProperty is updated accordingly.
    this.enabledRangeProperty = new Property<Range>( new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ), {
      valueComparisonStrategy: 'equalsFunction'
    } );
    this.waterLevelProperty = new NumberProperty( options.waterLevel, combineOptions<NumberPropertyOptions>( {
      range: new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ),

      // phet-io
      tandem: tandem.createTandem( 'waterLevelProperty' )
    }, options.waterLevelPropertyOptions ) );

    this.isActiveProperty.lazyLink( isActive => this.partialReset() );
  }

  // these properties are the only ones that should be reset when a cup is no longer active
  private partialReset(): void {
    this.enabledRangeProperty.reset();
    this.waterLevelProperty.reset();
  }

  public reset(): void {
    this.partialReset();
    this.isActiveProperty.reset();
  }
}

meanShareAndBalance.register( 'WaterCup', WaterCup );