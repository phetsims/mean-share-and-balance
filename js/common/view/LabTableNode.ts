// Copyright 2022-2025, University of Colorado Boulder

/**
 * Shows the table at the bottom of the screen. A rectangle extends the bottom of the table in narrow aspect ratios.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import labDesk_svg from '../../../images/labDesk_svg.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';

type SelfOptions = EmptySelfOptions;

type TableNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;
export default class LabTableNode extends Node {

  public constructor( providedOptions?: TableNodeOptions ) {

    const table = new Image( labDesk_svg, { maxWidth: 780 } );
    const tableBottom = new Rectangle( 34, 25, table.width - 68, 2000, {
      fill: MeanShareAndBalanceColors.labTableFillColorProperty,
      stroke: 'black',
      lineWidth: 2
    } );

    const options = optionize<TableNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ tableBottom, table ],
      isDisposable: false
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'LabTableNode', LabTableNode );