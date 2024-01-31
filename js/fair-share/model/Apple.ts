// Copyright 2024, University of Colorado Boulder

/**
 * The Apple class models an item that can appear on plates in the notepad of the Fair Share screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Snack, { SnackOptions } from '../../common/model/Snack.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';

type SelfOptions = EmptySelfOptions;
type AppleOptions = SelfOptions & SnackOptions;

export default class Apple extends Snack {

  public readonly fraction: Fraction;

  public constructor( providedOptions: AppleOptions ) {
    const options = optionize<AppleOptions, SelfOptions, SnackOptions>()( {}, providedOptions );
    super( options );
    this.fraction = new Fraction( 1, 1 );
  }
}

meanShareAndBalance.register( 'Apple', Apple );