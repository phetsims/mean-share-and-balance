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

type SelfOptions = {};
export type PipeModelOptions = SelfOptions & PhetioObjectOptions;

export default class PipeModel extends PhetioObject {

  readonly isOpenProperty: BooleanProperty;
  readonly x: number;
  readonly y: number;
  static PipeModelIO: IOType<PipeModel>;

  constructor( x: number, y: number, providedOptions?: PipeModelOptions ) {
    const options = optionize<PipeModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: PipeModel.PipeModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.isOpenProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isOpenProperty' )
    } );
    // TODO: Should these be options?  Be consistent with WaterCupModel either way
    this.x = x;
    this.y = y;
  }

  override dispose(): void {
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
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ stateObject.x, stateObject.y ];
  },
  stateSchema: {
    x: NumberIO,
    y: NumberIO
  }
} );

meanShareAndBalance.register( 'PipeModel', PipeModel );