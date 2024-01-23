// Copyright 2023, University of Colorado Boulder

/**
 * PartyTableNode renders an image of a table with a tablecloth over it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, Image, NodeOptions } from '../../../../scenery/js/imports.js';
import partyTable_png from '../../../images/partyTable_png.js';

export default class PartyTableNode extends Node {

  public constructor( providedOptions?: NodeOptions ) {
    const partyTableImage = new Image( partyTable_png, { scale: 0.32 } );
    super( {
      children: [ partyTableImage ]
    } );
  }
}

meanShareAndBalance.register( 'PartyTableNode', PartyTableNode );