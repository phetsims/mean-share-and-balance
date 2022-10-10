// Copyright 2022, University of Colorado Boulder

/**
 * Individual chocolate bars in the paper (upper) representation.
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from './Plate.js';

type ChocolateBarOptions = {
  isActive: boolean;
  plate: Plate;
  position: Vector2;
};

type StateType = 'plate' | 'dragging' | 'animating';

// Total number of chocolate bars allocated, for debugging
let count = 0;

export default class ChocolateBar {

  public readonly isActiveProperty: Property<boolean>;
  public readonly parentPlateProperty: Property<Plate>;
  public readonly positionProperty: Property<Vector2>;
  public readonly stateProperty: Property<StateType>;

  // For debugging
  public readonly index = count++;

  public constructor( providedOptions: ChocolateBarOptions ) {

    // REVIEW: Should these be phet-io instrumented?  Perhaps yes, but with phetioState: false and phetioReadonly: false?
    this.isActiveProperty = new BooleanProperty( providedOptions.isActive );
    this.parentPlateProperty = new Property( providedOptions.plate );

    // REVIEW: These may need phetioState: true
    this.positionProperty = new Property( providedOptions.position );
    this.stateProperty = new Property<StateType>( 'plate' );
  }

  public reset(): void {
    // NOTE: Do not reset the isActiveProperty because it is managed by the container
    this.positionProperty.reset();
    this.stateProperty.reset();
    this.parentPlateProperty.reset();
  }
}

meanShareAndBalance.register( 'ChocolateBar', ChocolateBar );