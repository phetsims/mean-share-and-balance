// Copyright 2022-2023, University of Colorado Boulder

/**
 * The model representing the container for candy bars in the bottom representation.
 * Tracks the position of a person and their notepadPlate, as well as how many candy bars they have brought
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
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  isActive: boolean;
  position: Vector2;
  linePlacement: number;
};

type TablePlateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class TablePlate {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x and y positions for the person in the view. This specifies relative spacing between the people, and
  // another container centers the group.
  public readonly position: Vector2;

  // The amount of candy bar bars the person brought
  public readonly candyBarNumberProperty: Property<number>;

  // the person's index - 0-indexed
  public readonly linePlacement: number;

  public constructor( providedOptions?: TablePlateOptions ) {

    const options = optionize<TablePlateOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {

      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty, so cannot be independently adjusted
      phetioReadOnly: true
    } );
    this.position = options.position;

    this.candyBarNumberProperty = new NumberProperty( options.isActive ? 1 : 0, {

      range: new Range( 0, 10 ),

      // phet-io
      tandem: options.tandem.createTandem( 'candyBarNumberProperty' )
    } );

    this.linePlacement = options.linePlacement;

    // When the person becomes inactive, delete their candy bars. When a person becomes active, they arrive with 1 candy bar
    this.isActiveProperty.lazyLink( isActive => this.candyBarNumberProperty.set( isActive ? 1 : 0 ) );
  }

  // LinePlacement and position never changes and hence doesn't need to be reset.
  public reset(): void {
    this.isActiveProperty.reset();
    this.candyBarNumberProperty.reset();
  }
}

meanShareAndBalance.register( 'TablePlate', TablePlate );