// Copyright 2022, University of Colorado Boulder

/**
 * Base class for Pipe Node
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
  x: number;
  y: number;
  isOpen?: boolean;
};
export type PipeModelOptions = SelfOptions & PhetioObjectOptions;

export default class PipeModel extends PhetioObject {

  public readonly isOpenProperty: BooleanProperty;
  public readonly x: number;
  public readonly y: number;
  public static PipeModelIO: IOType<PipeModel>;

  public constructor( providedOptions?: PipeModelOptions ) {
    const options = optionize<PipeModelOptions, SelfOptions, PhetioObjectOptions>()( {
      isOpen: false,
      phetioType: PipeModel.PipeModelIO,
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