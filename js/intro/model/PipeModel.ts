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
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  x: number; // the x-position of the pipe in the view
  y: number; // the y-position of the pipe in the view
  isOpen?: boolean;
};

export type PipeModelOptions = SelfOptions & StrictOmit<PhetioObjectOptions, 'phetioType' | 'phetioDynamicElement'>;

export default class PipeModel extends PhetioObject {

  // Whether pipe is enabled in view and data calculations
  public readonly isEnabledProperty: BooleanProperty;
  // Property tracks whether pipe's valve is open or not.
  public readonly isOpenProperty: BooleanProperty;
  // Property tracks if the pipe's valve is in a clicked state.
  public readonly isCurrentlyClickedProperty = new BooleanProperty( false );
  // The x and y positions of the pipe in the view.
  public readonly x: number;
  public readonly y: number;

  public static PipeModelIO: IOType<PipeModel>;

  public constructor( providedOptions?: PipeModelOptions ) {
    const options = optionize<PipeModelOptions, SelfOptions, PhetioObjectOptions>()( {
      isOpen: false,
      tandem: Tandem.REQUIRED,
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.isEnabledProperty = new BooleanProperty( false );
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

meanShareAndBalance.register( 'PipeModel', PipeModel );