// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for pipes and valves.
 * The pipes visually connect the notepad cup representations and the valves control whether water is shared or not.
 * When the valves are open the water flows between all connected cups, and when the valves are closed
 * water is not allowed to flow between cups.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  xPosition: number; // the x position of the pipe in the view
  isActive?: boolean;
};

export type PipeOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Pipe {

  // Whether pipe is enabled in view and data calculations
  public readonly isActiveProperty: Property<boolean>;

  // The x position of the pipe in the view.
  public readonly xPositionProperty: Property<number>;

  // Holds the valve node rotation value. Closed is 0, and open is Pi/2
  public readonly rotationProperty = new NumberProperty( 0 );
  public readonly pipesOpenProperty: Property<boolean>;

  public constructor( pipesOpenProperty: Property<boolean>, providedOptions?: PipeOptions ) {
    const options = optionize<PipeOptions, SelfOptions, PhetioObjectOptions>()( {
      isActive: false
    }, providedOptions );

    this.pipesOpenProperty = pipesOpenProperty;
    this.isActiveProperty = new BooleanProperty( options.isActive, {
      tandem: options.tandem.createTandem( 'isActiveProperty' ),
      phetioReadOnly: true
    } );

    this.xPositionProperty = new NumberProperty( options.xPosition );
  }

  public reset(): void {
    this.isActiveProperty.reset();
    this.rotationProperty.reset();
  }

  // Valve animation
  public step( dt: number ): void {
    const currentRotation = this.rotationProperty.value;
    const targetRotation = this.pipesOpenProperty.value ? Math.PI / 2 : 0;
    const delta = targetRotation - currentRotation;
    const rotationThreshold = Math.abs( this.rotationProperty.value - targetRotation ) * 0.4;
    const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    this.rotationProperty.value = rotationThreshold <= dt ? targetRotation : proposedRotation;
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}


meanShareAndBalance.register( 'Pipe', Pipe );