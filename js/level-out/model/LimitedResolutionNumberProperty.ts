// Copyright 2024, University of Colorado Boulder

/**
 * LimitedResolutionNumberProperty is an extension of the NumberProperty class that limits the resolution of the numeric
 * value that can be contained based on a provided interval value.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty, { NumberPropertyOptions } from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

export default class LimitedResolutionNumberProperty extends NumberProperty {

  // the interval to be used for the rounding that is done when setting the value
  private readonly roundingInterval: number;

  public constructor( initialValue: number, roundingInterval: number, providedOptions?: NumberPropertyOptions ) {

    // Make sure the provided initial value doesn't already need rounding.
    assert && assert(
      Utils.roundToInterval( initialValue, roundingInterval ) === initialValue,
      'initial value doesn\'t meet rounding constraint'
    );

    const options = combineOptions<NumberPropertyOptions>( {}, providedOptions );

    super( initialValue, options );

    this.roundingInterval = roundingInterval;
  }

  public override set value( newValue: number ) {
    newValue = Utils.roundToInterval( newValue, this.roundingInterval );
    super.set( newValue );
  }

  public override get value(): number {
    return super.value;
  }

  public override set( value: number ): void {
    value = Utils.roundToInterval( value, this.roundingInterval );
    super.set( value );
  }
}

meanShareAndBalance.register( 'LimitedResolutionNumberProperty', LimitedResolutionNumberProperty );