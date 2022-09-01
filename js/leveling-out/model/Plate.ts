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
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  position: Vector2;
  isActive: boolean;
  linePlacement: number;
};

type PlateOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate {

  public readonly position: Vector2;

  // The number of chocolate bars on the plate
  public readonly chocolateBarsNumberProperty: Property<number>;
  public readonly isActiveProperty: Property<boolean>;

  // the plate's index
  public readonly linePlacement: number;

  public constructor( providedOptions: PlateOptions ) {
    const options = optionize<PlateOptions, EmptySelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    this.isActiveProperty = new BooleanProperty( options.isActive, {
      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty
      phetioReadOnly: true
    } );

    this.position = options.position;

    this.chocolateBarsNumberProperty = new NumberProperty( 1, {
      range: new Range( 0, 10 ),
      tandem: options.tandem.createTandem( 'chocolateBarsNumberProperty' )
    } );

    this.linePlacement = options.linePlacement;
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.chocolateBarsNumberProperty.reset();
  }
}

meanShareAndBalance.register( 'Plate', Plate );