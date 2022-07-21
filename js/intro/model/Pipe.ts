// Copyright 2022, University of Colorado Boulder

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
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  position: Vector2; // the x & y-position of the pipe in the view
  isOpen?: boolean;
  isActive?: boolean;
};

type StateObject = {
  position: Vector2;
};

export type PipeOptions = SelfOptions & StrictOmit<PhetioObjectOptions, 'phetioType'>;

export default class Pipe extends PhetioObject {

  // Whether pipe is enabled in view and data calculations
  public readonly isActiveProperty: BooleanProperty;
  // Property tracks whether pipe's valve is open or not.
  public readonly isOpenProperty: BooleanProperty;
  // Property tracks if the pipe's valve is in a clicked state.
  public readonly isCurrentlyClickedProperty = new BooleanProperty( false );
  // The x and y positions of the pipe in the view.
  public readonly position: Vector2;

  public static PipeIO: IOType<Pipe>;

  public constructor( providedOptions?: PipeOptions ) {
    const options = optionize<PipeOptions, SelfOptions, PhetioObjectOptions>()( {
      isOpen: false,
      isActive: false,
      tandem: Tandem.REQUIRED,
      phetioType: Pipe.PipeIO
    }, providedOptions );

    super( options );

    this.isActiveProperty = new BooleanProperty( options.isActive );
    this.isOpenProperty = new BooleanProperty( options.isOpen, {
      tandem: options.tandem.createTandem( 'isOpenProperty' )
    } );

    this.position = options.position;

    this.isActiveProperty.lazyLink( isActive => !isActive && this.reset() );
  }

  public reset(): void {
    this.isOpenProperty.reset();
    this.isActiveProperty.reset();
  }

  public override dispose(): void {
    super.dispose();
    this.isOpenProperty.dispose();
    this.isCurrentlyClickedProperty.dispose();
  }
}

Pipe.PipeIO = new IOType<Pipe>( 'PipeIO', {
  valueType: Pipe,
  toStateObject: ( pipe: Pipe ) => ( {
    position: pipe.position
  } ),
  stateToArgsForConstructor: ( stateObject: StateObject ) => {
    return [ stateObject.position ];
  },
  stateSchema: {}
} );

meanShareAndBalance.register( 'Pipe', Pipe );