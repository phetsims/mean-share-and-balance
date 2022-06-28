// Copyright 2022, University of Colorado Boulder

//REVIEW Incorrect doc. This is not a base class for PipeNode. It's the model for the pipe.
//REVIEW Needs more description - what is a "pipe", etc.
/**
 * Base class for Pipe Node
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type StateObject = {
  x: number;
  y: number;
}

type SelfOptions = {
  //REVIEW non-obvious options are supposed to be documented where defined, and these are not obvious to the reviewer
  //REVIEW if x and y are the pipe's position, then position: Vector2 is preferable
  x: number;
  y: number;
  isOpen?: boolean;
};

//REVIEW Shouldn't 'phetioType' | 'phetioDynamicElement' be omitted from PhetioObjectOptions?
export type PipeModelOptions = SelfOptions & PhetioObjectOptions;

export default class PipeModel extends PhetioObject {

  //REVIEW non-obvious fields are supposed to be documented where declared, and these are not obvious to the reviewer
  public readonly isOpenProperty: BooleanProperty;
  public readonly isCurrentlyClickedProperty = new BooleanProperty( false );
  //REVIEW if x and y are the pipe's position, then position: Vector2 is preferable
  public readonly x: number;
  public readonly y: number;

  public static PipeModelIO: IOType<PipeModel>;

  public constructor( providedOptions?: PipeModelOptions ) {
    const options = optionize<PipeModelOptions, SelfOptions, PhetioObjectOptions>()( {
      isOpen: false,
      phetioType: PipeModel.PipeModelIO,
      //REVIEW replace with PickRequired<PhetioObjectOptions, 'tandem'>
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.isOpenProperty = new BooleanProperty( options.isOpen, {
      tandem: options.tandem.createTandem( 'isOpenProperty' )
    } );

    this.x = options.x;
    this.y = options.y;
  }

  public override dispose(): void {
    super.dispose();
    this.isOpenProperty.dispose();
    this.isCurrentlyClickedProperty.dispose();
  }
}

PipeModel.PipeModelIO = new IOType<PipeModel>( 'PipeModelIO', {
  valueType: PipeModel,
  toStateObject: ( pipeModel: PipeModel ) => ( {
    x: pipeModel.x,
    y: pipeModel.y
  } ),
  stateToArgsForConstructor: ( stateObject: StateObject ) => {
    return [ stateObject.x, stateObject.y ];
  },
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  }
} );

meanShareAndBalance.register( 'PipeModel', PipeModel );