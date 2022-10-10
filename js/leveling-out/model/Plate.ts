// Copyright 2022, University of Colorado Boulder


/**
 * REVIEW: Update docs
 * The amount of chocolate bars is tracked through chocolateBarsNumberProperty
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';

// REVIEW: These options look identical to PersonOptions, and seem overlapped with options in ChocolateBar
type SelfOptions = {
  position: Vector2;
  isActive: boolean;
  linePlacement: number;
};

type PlateOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate {

  // REVIEW: Add a base class that factors out position, isActiveProperty and linePlacement
  public readonly position: Vector2;

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

    this.linePlacement = options.linePlacement;
  }

  public reset(): void {
    this.isActiveProperty.reset();
  }
}

meanShareAndBalance.register( 'Plate', Plate );