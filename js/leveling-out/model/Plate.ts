// Copyright 2022-2024, University of Colorado Boulder

/**
 * The model element that represents the container for candy bars or cookies.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  isActive: boolean;
  xPosition: number;
  linePlacement: number;
};

type PlateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate extends PhetioObject {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x position of the plate in view coordinates.
  public readonly xPosition: number;

  // The number of snacks (candy bars or cookies) on this plate.
  public readonly snackNumberProperty: Property<number>;

  // The plate's index, 0-indexed.  This is primarily used for debugging.
  public readonly linePlacement: number;

  public constructor( providedOptions: PlateOptions ) {

    const options = optionize<PlateOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.isActiveProperty = new BooleanProperty( options.isActive, {

      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty, so cannot be independently adjusted.
      phetioReadOnly: true
    } );
    this.xPosition = options.xPosition;

    this.snackNumberProperty = new NumberProperty( options.isActive ? 1 : 0, {

      range: new Range( 0, 10 ),

      // phet-io
      tandem: options.tandem.createTandem( 'snackNumberProperty' )
    } );

    this.linePlacement = options.linePlacement;
  }

  // LinePlacement and position never changes and hence doesn't need to be reset.
  public reset(): void {
    this.isActiveProperty.reset();
    this.snackNumberProperty.reset();
  }
}

meanShareAndBalance.register( 'Plate', Plate );