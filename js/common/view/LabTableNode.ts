// Copyright 2022-2024, University of Colorado Boulder

/**
 * Shows the table at the bottom of the screen
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import labDesk_svg from '../../../images/labDesk_svg.js';

type SelfOptions = EmptySelfOptions;

type TableNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;
export default class LabTableNode extends Node {

  public constructor( providedOptions?: TableNodeOptions ) {

    const table = new Image( labDesk_svg, { maxWidth: 780 } );
    const tableBottom = new Rectangle( 34, 25, table.width - 68, 2000, {
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

meanShareAndBalance.register( 'LabTableNode', LabTableNode );