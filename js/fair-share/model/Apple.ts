// Copyright 2024, University of Colorado Boulder

/**
 * The Apple class models an apple that can appear on plates in the notepad of the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import Snack, { SnackOptions } from '../../common/model/Snack.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type AppleOptions = SelfOptions & SnackOptions;

export default class Apple extends Snack {

  // The fraction of an apple represented here.  Must be more than zero, less than or equal to 1.
  public readonly fractionProperty: Property<Fraction>;

  public constructor( providedOptions: AppleOptions ) {
    const options = optionize<AppleOptions, SelfOptions, SnackOptions>()( {}, providedOptions );
    super( options );
    this.fractionProperty = new Property<Fraction>( Fraction.ONE, {
      tandem: options.tandem.createTandem( 'fractionProperty' ),
      phetioReadOnly: true,
      phetioValueType: Fraction.FractionIO,
      phetioState: false
    } );

    // Make sure the fraction value isn't incorrectly set.
    this.fractionProperty.lazyLink( fraction => {
      assert && assert( fraction.value > 0, 'fraction must be greater than zero' );
      assert && assert( fraction.value <= 1, 'fraction must be less than or equal to 1' );
    } );
  }
}

meanShareAndBalance.register( 'Apple', Apple );