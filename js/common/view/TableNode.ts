// Copyright 2022, University of Colorado Boulder

/**
 * Shows the table at the bottom of the screen
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import labDesk_png from '../../../images/labDesk_png.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';

type SelfOptions = EmptySelfOptions;

type TableNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;
export default class TableNode extends Node {

  public constructor( providedOptions?: TableNodeOptions ) {

    const table = new Image( labDesk_png, { scale: 0.5 } );
    const tableBottom = new Rectangle( 28, 25, table.width - 54, 2000, {
      fill: '#b59373',
      stroke: 'black',
      lineWidth: 2
    } );

    const options = optionize<TableNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ tableBottom, table ]
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'TableNode', TableNode );