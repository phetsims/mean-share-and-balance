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
import TProperty from '../../../../axon/js/TProperty.js';

type SelfOptions = {
  isInitiallyActive?: boolean;
  initialXPosition?: number;
  linePlacement: number;
  startingNumberOfSnacks?: number;
};

type PlateOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Plate extends PhetioObject {

  // Whether the cup is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The X position of the center of this plate relative to the center of the table.
  public readonly xPositionProperty: TProperty<number>;

  // The number of snacks (candy bars or apples) on this plate.
  public readonly snackNumberProperty: Property<number>;

  // The plate's index, 0-indexed.  This is primarily used for debugging.
  public readonly linePlacement: number;

  public constructor( providedOptions: PlateOptions ) {

    const options = optionize<PlateOptions, SelfOptions, PhetioObjectOptions>()( {
      isInitiallyActive: false,
      initialXPosition: 0,
      phetioState: false,
      startingNumberOfSnacks: 1
    }, providedOptions );

    super( options );

    this.isActiveProperty = new BooleanProperty( options.isInitiallyActive, {

      // phet-io
      tandem: options.tandem.createTandem( 'isActiveProperty' ),

      // Takes its value from LevelingOutModel.numberOfPeopleProperty, so cannot be independently adjusted.
      phetioReadOnly: true
    } );
    this.xPositionProperty = new NumberProperty( options.initialXPosition );

    this.snackNumberProperty = new NumberProperty( options.startingNumberOfSnacks, {

      range: new Range( 0, 10 ),

      // phet-io
      tandem: options.tandem.createTandem( 'snackNumberProperty' )
    } );

    this.linePlacement = options.linePlacement;
  }

  // LinePlacement and position never changes and hence doesn't need to be reset.
  public reset(): void {

    // The snack number property needs to be reset before the isActiveProperty, so that notepad snacks are updated
    // correctly in listeners before arriving to the isActiveProperty listeners when setting Phet-io state.
    this.snackNumberProperty.reset();
    this.isActiveProperty.reset();
  }

  // Width of the plate (aka diameter) in screen coordinates.
  public static readonly WIDTH = 45;
}

meanShareAndBalance.register( 'Plate', Plate );