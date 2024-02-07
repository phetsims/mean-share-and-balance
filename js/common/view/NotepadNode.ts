// Copyright 2022-2024, University of Colorado Boulder

/**
 * Contains the image and scaling for the notebook paper background for the upper data representations
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, Image, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import notepadRing_png from '../../../images/notepadRing_png.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  readoutPatternStringProperty?: PatternStringProperty<{
    total: TReadOnlyProperty<number>;
    measurement: UnknownDerivedProperty<string>;
  }> | null;
};

type NotepadNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

const NOTEPAD_RING_BOTTOM = 33.5;

export default class NotepadNode extends Node {

  public constructor( providedOptions?: NotepadNodeOptions ) {

    const options = optionize<NotepadNodeOptions, SelfOptions, NodeOptions>()( {
      readoutPatternStringProperty: null
    }, providedOptions );

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
      const image = new Image( notepadRing_png, { x: x, bottom: NOTEPAD_RING_BOTTOM, scale: 0.8 } );
      rings.push( image );
    } );

    super( { children: [ paperStackNode, ...rings ], centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y } );

    if ( options.readoutPatternStringProperty ) {
      const readoutText = new Text( options.readoutPatternStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 200,
        fill: 'black'
      } );

      const readoutAlignBox = new AlignBox( readoutText, {
        alignBounds: paperStackNode.bounds,
        xAlign: 'center',
        yAlign: 'top',
        yMargin: NOTEPAD_RING_BOTTOM + 5
      } );

      this.addChild( readoutAlignBox );
    }
  }
}

meanShareAndBalance.register( 'NotepadNode', NotepadNode );