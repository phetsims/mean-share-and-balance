// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  isActive: boolean;
  position: Vector2;
};

type PersonOptions = SelfOptions & PickRequired<PhetioObject, 'tandem'>;

export default class Person {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;
  // The x and y positions for the person in the view.
  public readonly position: Vector2;

  public constructor( providedOptions?: PersonOptions ) {

    const options = optionize<PersonOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {
      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty
      phetioReadOnly: true
    } );

    this.position = options.position;
  }
}

meanShareAndBalance.register( 'Person', Person );