// Copyright 2024, University of Colorado Boulder

/**
 * PartyTableNode renders an image of a table with a tablecloth over it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import partyTable_svg from '../../../images/partyTable_svg.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type PartyTableNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class PartyTableNode extends Node {

  public constructor( providedOptions?: PartyTableNodeOptions ) {
    const partyTableImage = new Image( partyTable_svg, { maxWidth: 780 } );

    const options = optionize<PartyTableNodeOptions, SelfOptions, NodeOptions>()(
      {
        children: [ partyTableImage ],
        y: MeanShareAndBalanceConstants.PARTY_TABLE_Y
      },
      providedOptions );
    super( options );
  }
}

meanShareAndBalance.register( 'PartyTableNode', PartyTableNode );