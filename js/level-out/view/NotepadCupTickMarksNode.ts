// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the ticks marks on notepad water cup nodes.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type TickMarksNodeOptions = WithRequired<NodeOptions, 'visibleProperty'>;

export default class NotepadCupTickMarksNode extends Node {

  public constructor( cupHeight: number, providedOptions: TickMarksNodeOptions ) {
    const options = optionize<TickMarksNodeOptions, EmptySelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );
    super( options );

    const tickLevels = [ 0.25, 0.5, 0.75 ];
    tickLevels.forEach( tickLevel => {
      const fraction = cupHeight * tickLevel;

      this.addTickMark( fraction );
    } );
  }

  // Creates and adds tick mark to node
  private addTickMark( fraction: number ): void {
    const tickMark = new Line( 0, fraction, 5, fraction, {
      stroke: 'black',
      lineWidth: 2
    } );
    this.addChild( tickMark );
  }
}

meanShareAndBalance.register( 'NotepadCupTickMarksNode', NotepadCupTickMarksNode );