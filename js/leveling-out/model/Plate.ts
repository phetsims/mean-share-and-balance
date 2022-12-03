// Copyright 2022, University of Colorado Boulder


/**
 * Model for the upper representation of chocolate stacks. Tracks whether a stack should be active, it's line placement, and position
 * relative to other stacks.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
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

type PlateOptions = SelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate extends PhetioObject {

  // REVIEW: Add a base class that factors out position, isActiveProperty and linePlacement
  public readonly position: Vector2;

  public readonly isActiveProperty: Property<boolean>;

  // the plate's index
  public readonly linePlacement: number;

  public constructor( providedOptions: PlateOptions ) {
    const options = optionize<PlateOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );

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