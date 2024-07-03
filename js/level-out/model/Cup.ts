// Copyright 2022-2024, University of Colorado Boulder

/**
 * Class for table and notepad cup models.
 * A water cup holds a certain level of water that can be manipulated by the user.
 * A cup is empty when waterLevelProperty.value = 0, and full when waterLevelProperty.value = 1
 * Water level is controlled in the table view through a vertical slider.
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
import Tandem from '../../../../tandem/js/Tandem.js';
import Disposable from '../../../../axon/js/Disposable.js';
import LimitedResolutionNumberProperty from './LimitedResolutionNumberProperty.js';

type SelfOptions = {
  xPosition: number; // the cup's x position in the view
  isActive: boolean;
  waterHeightRange?: Range; // The range of water the cup can hold.
  waterLevel?: number; // Initial water level
  waterLevelPropertyOptions?: PickOptional<NumberPropertyOptions, 'phetioReadOnly'>;
  linePlacement: number;
  isTableCup: boolean;
};

export type CupOptions = SelfOptions;

// The rounding interval for the water level.  This exists to prevent values with many decimal places that take a very
// long time to equilibrate (which looks weird in phet-io), and are also annoying when read out by the screen reader.
// The value was empirically determined, please do not change without ample consideration.
// See https://github.com/phetsims/mean-share-and-balance/issues/227.
export const WATER_LEVEL_ROUNDING_INTERVAL = 0.0001;

export default class Cup {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The left x position for the cup in the view.
  public readonly xPositionProperty: Property<number>;

  // The amount of water contained in the cup. 0 is empty, and 1 is full.
  public readonly waterLevelProperty: LimitedResolutionNumberProperty;

  // This determines the allowed drag range in the slider control
  public readonly enabledRangeProperty: Property<Range>;

  public readonly linePlacement: number;

  public constructor( tandem: Tandem, providedOptions: CupOptions ) {

    const options = optionize<CupOptions, StrictOmit<SelfOptions, 'waterLevelPropertyOptions'>, PhetioObjectOptions>()( {
      waterHeightRange: new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ),
      waterLevel: MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT
    }, providedOptions );

    this.xPositionProperty = new NumberProperty( options.xPosition );
    this.linePlacement = options.linePlacement;

    // When a table cup's slider is changed enabledRangeProperty is updated accordingly.
    this.enabledRangeProperty = new Property<Range>( new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ), {
      valueComparisonStrategy: 'equalsFunction'
    } );
    this.waterLevelProperty = new LimitedResolutionNumberProperty(
      options.waterLevel,
      WATER_LEVEL_ROUNDING_INTERVAL,
      combineOptions<NumberPropertyOptions>( {
        range: new Range( MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ),

        // phet-io
        tandem: tandem.createTandem( 'waterLevelProperty' ),
        phetioFeatured: options.isTableCup
      }, options.waterLevelPropertyOptions )
    );

    this.isActiveProperty = new BooleanProperty( options.isActive, {
      tandem: tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );

    this.isActiveProperty.link( () => this.partialReset() );
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

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

meanShareAndBalance.register( 'Cup', Cup );