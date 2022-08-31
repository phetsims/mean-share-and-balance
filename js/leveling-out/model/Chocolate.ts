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
};

type ChocolateOptions = SelfOptions & PhetioObjectOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Chocolate {

  public readonly position: Vector2;
  public readonly chocolateBarsNumberProperty: Property<number>;
  public readonly isActiveProperty: Property<boolean>;


  public constructor( providedOptions: ChocolateOptions ) {
    const options = optionize<ChocolateOptions, EmptySelfOptions, PhetioObjectOptions>()( {}, providedOptions );

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
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.chocolateBarsNumberProperty.reset();
  }
}

meanShareAndBalance.register( 'Chocolate', Chocolate );