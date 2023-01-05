// Copyright 2022-2023, University of Colorado Boulder

/**
 * The model representing the container for chocolates in the bottom representation.
 * Tracks the position of a person and their plate, as well as how many chocolate bars they have brought
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
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

// REVIEW: Perhaps rename this to TablePlate?  Since it is more about the stack itself?  This relates to the
// questions about how to https://github.com/phetsims/mean-share-and-balance/issues/119
export default class Person {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x and y positions for the person in the view. This specifies relative spacing between the people, and
  // another container centers the group.
  public readonly position: Vector2;

  // The amount of chocolate bars the person brought
  public readonly chocolateNumberProperty: Property<number>;

  // the person's index - 0-indexed
  public readonly linePlacement: number;

  public constructor( providedOptions?: PersonOptions ) {

    const options = optionize<PersonOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {

      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty, so cannot be independently adjusted
      phetioReadOnly: true
    } );
    this.position = options.position;

    this.chocolateNumberProperty = new NumberProperty( options.isActive ? 1 : 0, {

      range: new Range( 0, 10 ),

      // phet-io
      tandem: options.tandem.createTandem( 'chocolateNumberProperty' )
    } );

    this.linePlacement = options.linePlacement;

    // When the person becomes inactive, delete their chocolates. When a person becomes active, they arrive with 1 chocolate
    this.isActiveProperty.lazyLink( isActive => this.chocolateNumberProperty.set( isActive ? 1 : 0 ) );
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.chocolateNumberProperty.reset();

    // linePlacement never changes and hence doesn't need to be reset
    // position never changes
  }
}

meanShareAndBalance.register( 'Person', Person );