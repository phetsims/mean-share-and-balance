// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, Rectangle } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';

export default class NoteBookPaperNode extends Node {

  public constructor() {
    const background = new Rectangle( 0, 0, 720, 250, { fill: 'lightBlue' } );
    super( { children: [ background ], centerY: MeanShareAndBalanceConstants.PLATE_CHOCOLATE_CENTER_Y - 75 } );
  }
}

meanShareAndBalance.register( 'NoteBookPaperNode', NoteBookPaperNode );