// Copyright 2022, University of Colorado Boulder

/**
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

export default class ChocolateBar {

  public readonly isActiveProperty: Property<boolean>;
  public parentPlateProperty: Property<Plate>;
  public readonly positionProperty: Property<Vector2>;
  public readonly stateProperty: Property<StateType>;

  public constructor( providedOptions: ChocolateBarOptions ) {

    this.isActiveProperty = new BooleanProperty( providedOptions.isActive );
    this.parentPlateProperty = new Property( providedOptions.plate );
    this.positionProperty = new Property( providedOptions.position );
    this.stateProperty = new Property<StateType>( 'plate' );

    this.isActiveProperty.link( isActive => {
      !isActive && this.reset();
    } );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.stateProperty.reset();
    this.parentPlateProperty.reset();
  }
}

meanShareAndBalance.register( 'ChocolateBar', ChocolateBar );