// Copyright 2022, University of Colorado Boulder


/**
 * The model for the chocolate each person or plate has.
 * The amount of chocolate bars is tracked through chocolateBarsNumberProperty
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';

type SelfOptions = {
  x: number;
  y: number;
}

type StateObject = {
  x: number;
  y: number;
}

type ChocolateOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>

export default class Chocolate extends PhetioObject {

  public readonly x: number;
  public readonly y: number;
  public readonly chocolateBarsNumberProperty: NumberProperty;

  public static ChocolateIO: IOType<Chocolate>;

  public constructor( providedOptions: ChocolateOptions ) {
    const options = optionize<ChocolateOptions, EmptyObjectType, PhetioObjectOptions>()( {
      phetioType: Chocolate.ChocolateIO
    }, providedOptions );
    super( options );

    this.x = providedOptions.x;
    this.y = providedOptions.y;
    this.chocolateBarsNumberProperty = new NumberProperty( 1, { range: new Range( 0, 10 ) } );

  }
}

Chocolate.ChocolateIO = new IOType<Chocolate>( 'ChocolateIO', {
  valueType: Chocolate,
  toStateObject: ( chocolate: Chocolate ) => ( {
    x: chocolate.x
  } ),
  stateToArgsForConstructor: ( stateObject: StateObject ) => {
    return [ stateObject.x ];
  },
  stateSchema: {
    x: NumberIO
  }
} );

meanShareAndBalance.register( 'Chocolate', Chocolate );