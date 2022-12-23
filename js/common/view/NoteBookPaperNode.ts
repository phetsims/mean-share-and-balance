// Copyright 2022, University of Colorado Boulder

/**
 * Contains the image and scaling for the notebook paper background for the upper data representations
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, Rectangle, Image } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import notepadRing_png from '../../../images/notepadRing_png.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';

export default class NoteBookPaperNode extends Node {

  public constructor() {

    const paperStackNode = new Node();
    const paperWidth = 720;
    const paperHeight = 240;
    const paperStackHeight = 4;
    const stackOffset = 3;

    for ( let i = paperStackHeight; i > 0; i-- ) {
      const xOffset = i * -stackOffset;
      const yOffset = i * stackOffset;
      const paper = new Rectangle( xOffset, yOffset, paperWidth, paperHeight, {
        fill: MeanShareAndBalanceColors.paperColorProperty,
        stroke: 'black',
        cornerRadius: 10
      } );
      paperStackNode.addChild( paper );
    }

    const rings: Array<Node> = [];
    const numberOfRings = 8;

    _.times( numberOfRings, ( i: number ) => {
      const x = i * ( ( paperWidth - 20 ) / numberOfRings ) + 30;
      const image = new Image( notepadRing_png, { x: x, y: -21.5, scale: 0.8 } );
      rings.push( image );
    } );

    super( { children: [ paperStackNode, ...rings ], centerY: MeanShareAndBalanceConstants.NOTEBOOK_PAPER_CENTER_Y } );
  }
}

meanShareAndBalance.register( 'NoteBookPaperNode', NoteBookPaperNode );