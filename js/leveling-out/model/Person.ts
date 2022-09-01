// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  isActive: boolean;
  position: Vector2;
  linePlacement: number;
};

type PersonOptions = SelfOptions & PickRequired<PhetioObject, 'tandem'>;

export default class Person {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;
  // The x and y positions for the person in the view.
  public readonly position: Vector2;
  // The amount of chocolate bars the person brought
  public readonly chocolateNumberProperty: Property<number>;
  // the persons index
  public readonly linePlacement: number;

  public constructor( providedOptions?: PersonOptions ) {

    const options = optionize<PersonOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {
      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty
      phetioReadOnly: true
    } );
    this.position = options.position;

    this.chocolateNumberProperty = new NumberProperty( 1 );

    this.linePlacement = options.linePlacement;

    this.isActiveProperty.lazyLink( isActive => this.chocolateNumberProperty.reset() );
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.chocolateNumberProperty.reset();
  }
}

meanShareAndBalance.register( 'Person', Person );