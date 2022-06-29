// Copyright 2022, University of Colorado Boulder


/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  x: number;
  y: number;
}

type ChocolateOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>

export default class Chocolate extends PhetioObject {

  public readonly x: number;
  public readonly y: number;
  public readonly chocolateBarNumberProperty: NumberProperty;

  public constructor( providedOptions: ChocolateOptions ) {
    super( providedOptions );

    this.x = providedOptions.x;
    this.y = providedOptions.y;
    this.chocolateBarNumberProperty = new NumberProperty( 1, { range: new Range( 0, 10 ) } );

  }
}

meanShareAndBalance.register( 'Chocolate', Chocolate );