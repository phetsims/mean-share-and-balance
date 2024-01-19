// Copyright 2022-2024, University of Colorado Boulder

/**
 * Individual chocolate bars in the paper (upper) representation.
 * These chocolate bars are draggable therefore their position, and parentPlate are important.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import ReferenceIO from '../../../../tandem/js/types/ReferenceIO.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from './Plate.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type ChocolateBarOptions = {
  isActive: boolean;
  plate: Plate;
  position: Vector2;
} & PickRequired<PhetioObjectOptions, 'tandem'>;

type StateType = 'plate' | 'dragging' | 'animating';

// Total number of chocolate bars allocated, for debugging
let count = 0;

export default class ChocolateBar {

  public readonly isActiveProperty: Property<boolean>;
  public readonly parentPlateProperty: Property<Plate>;
  public readonly positionProperty: Property<Vector2>;
  public readonly stateProperty: Property<StateType>;

  // For debugging
  public readonly index = count++;

  public constructor( providedOptions: ChocolateBarOptions ) {

    this.isActiveProperty = new BooleanProperty( providedOptions.isActive, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true,
      phetioState: false
    } );

    this.parentPlateProperty = new Property( providedOptions.plate, {

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'parentPlateProperty' ),
      phetioReadOnly: true,
      phetioValueType: ReferenceIO( IOType.ObjectIO )
    } );

    // REVIEW: These may need phetioState: true
    this.positionProperty = new Property( providedOptions.position );
    this.stateProperty = new Property<StateType>( 'plate' );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.stateProperty.reset();
    this.parentPlateProperty.reset();
    this.isActiveProperty.reset();
  }
}

meanShareAndBalance.register( 'ChocolateBar', ChocolateBar );