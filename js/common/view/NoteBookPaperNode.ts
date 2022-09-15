// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, Image } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import notebookPaperBackground_png from '../../../images/notebookPaperBackground_png.js';

export default class NoteBookPaperNode extends Node {

  public constructor() {
    const background = new Image( notebookPaperBackground_png, { scale: 0.48 } );
    super( { children: [ background ], centerY: MeanShareAndBalanceConstants.NOTEBOOK_PAPER_CENTER_Y } );
  }
}

meanShareAndBalance.register( 'NoteBookPaperNode', NoteBookPaperNode );