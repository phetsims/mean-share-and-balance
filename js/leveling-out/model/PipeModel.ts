// Copyright 2022, University of Colorado Boulder

/**
 * Base class for Pipe Node
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {

};
export type PipeModelOptions = SelfOptions & PhetioObjectOptions;

export default class PipeModel extends PhetioObject {

  readonly isOpenProperty: BooleanProperty;
  readonly xProperty: NumberProperty;
  readonly y: number;
  static PipeModelIO: IOType<PipeModel>;

  constructor( xProperty: NumberProperty, y: number, providedOptions?: PipeModelOptions ) {
    const options = optionize<PipeModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: PipeModel.PipeModelIO,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.isOpenProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isOpenProperty' )
    } );
    // Should these be options?
    this.xProperty = xProperty;
    this.y = y;
  }
}

PipeModel.PipeModelIO = new IOType<PipeModel>( 'PipeModelIO', {
  valueType: PipeModel,
  toStateObject: ( pipeModel: PipeModel ) => ( {} ),
  stateToArgsForConstructor: ( stateObject: any ) => {
    return [ 0 ];
  },
  stateSchema: {
    // initialPlaceInLine: NumberIO
  }
} );

meanShareAndBalance.register( 'PipeModel', PipeModel );