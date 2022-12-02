// Copyright 2022, University of Colorado Boulder

/**
 * Shows the table at the bottom of the screen
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import labDesk_png from '../../../images/labDesk_png.js';

export default class TableNode extends Node {

  public constructor( providedOptions?: StrictOmit<NodeOptions, 'children'> ) {

    const table = new Image( labDesk_png, { scale: 0.5 } );
    const tableBottom = new Rectangle( 28, 25, table.width - 54, 2000, {
      fill: '#b59373',
      stroke: 'black',
      lineWidth: 2
    } );

    // REVIEW: optionize?
    const options = combineOptions<NodeOptions>( { children: [ tableBottom, table ] }, providedOptions );
    super( options );
  }
}

meanShareAndBalance.register( 'TableNode', TableNode );