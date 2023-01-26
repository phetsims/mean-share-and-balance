// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for pipes and valves.
 * The pipes visually connect the 2D cup representations and the valves control whether water is shared or not.
 * When the valves are open the water flows between all connected cups, and when the valves are closed
 * water is not allowed to flow between cups.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  position: Vector2; // the x & y-position of the pipe in the view
  isActive?: boolean;
};

type StateObject = {
  position: Vector2;
};

export type PipeOptions =
  SelfOptions
  & StrictOmit<PhetioObjectOptions, 'phetioType'>
  & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Pipe extends PhetioObject {

  // Whether pipe is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;
  // Property tracks if the pipe's valve is in a clicked state.
  public readonly isCurrentlyClickedProperty = new BooleanProperty( false );
  // The x and y positions of the pipe in the view.
  public readonly position: Vector2;
  // Holds the valve node rotation value. Closed is 0, and open is Pi/2
  public readonly rotationProperty: Property<number>;
  public readonly arePipesOpenProperty: Property<boolean>;

  public constructor( arePipesOpenProperty: Property<boolean>, providedOptions?: PipeOptions ) {
    const options = optionize<PipeOptions, SelfOptions, PhetioObjectOptions>()( {
      isActive: false,

      // phet-io
      phetioType: Pipe.PipeIO
    }, providedOptions );

    super( options );

    this.rotationProperty = new NumberProperty( 0 );
    this.arePipesOpenProperty = arePipesOpenProperty;
    this.isActiveProperty = new BooleanProperty( options.isActive );

    this.position = options.position;
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.rotationProperty.reset();
  }

  // Valve animation
  public step( dt: number ): void {
    const currentRotation = this.rotationProperty.value;
    const targetRotation = this.arePipesOpenProperty.value ? Math.PI / 2 : 0;
    const delta = targetRotation - currentRotation;
    const rotationThreshold = Math.abs( this.rotationProperty.value - targetRotation ) * 0.4;
    const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    this.rotationProperty.value = rotationThreshold <= dt ? targetRotation : proposedRotation;
  }

  public static readonly PipeIO = new IOType<Pipe>( 'PipeIO', {
    valueType: Pipe,
    toStateObject: ( pipe: Pipe ) => ( {
      position: pipe.position
    } ),
    stateObjectToCreateElementArguments: ( stateObject: StateObject ) => {
      return [ stateObject.position ];
    },
    stateSchema: {
      position: Vector2.Vector2IO
    }
  } );
}


meanShareAndBalance.register( 'Pipe', Pipe );