// Copyright 2022-2024, University of Colorado Boulder

/**
 * Contains the image and scaling for the notebook paper background for the upper data representations
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, Image, Node, NodeOptions, Rectangle, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import { Bounds2, Dimension2 } from '../../../../dot/js/imports.js';
import notepadRing_svg from '../../../images/notepadRing_svg.js';

type SelfOptions = {
  readoutPatternStringProperty?: PatternStringProperty<{
    total: TReadOnlyProperty<number>;
    measurement: UnknownDerivedProperty<string>;
  }> | null;
};

export type NotepadNodeOptions = SelfOptions &
  StrictOmit<NodeOptions, 'children' | 'centerY'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

const NOTEPAD_RING_BOTTOM = 33.5;
const PAPER_PAGE_SIZE = new Dimension2( 720, 240 );
const LABEL_MARGIN = 15;

export default class NotepadNode extends Node {

  protected readonly paperStackBounds: Bounds2;

  public constructor( providedOptions: NotepadNodeOptions ) {

    const options = optionize<NotepadNodeOptions, SelfOptions, NodeOptions>()( {
      readoutPatternStringProperty: null
    }, providedOptions );

    const paperStackNode = new Node();
    const paperWidth = PAPER_PAGE_SIZE.width;
    const paperHeight = PAPER_PAGE_SIZE.height;
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
      const image = new Image( notepadRing_svg, { x: x, bottom: NOTEPAD_RING_BOTTOM, maxHeight: 55 } );
      rings.push( image );
    } );

    const superOptions = combineOptions<NodeOptions>( {
      children: [ paperStackNode, ...rings ],
      centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y
    }, options );
    super( superOptions );

    this.paperStackBounds = paperStackNode.bounds;

    if ( options.readoutPatternStringProperty ) {
      const readoutText = new Text( options.readoutPatternStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 200,
        fill: 'black'
      } );

      const readoutAlignBox = new AlignBox( readoutText, {
        alignBounds: this.paperStackBounds.dilateX( -LABEL_MARGIN ),
        xAlign: 'right',
        yAlign: 'top',
        yMargin: NOTEPAD_RING_BOTTOM + 5
      } );

      this.addChild( readoutAlignBox );
    }
  }

  public static readonly PAPER_PAGE_SIZE = PAPER_PAGE_SIZE;
}

meanShareAndBalance.register( 'NotepadNode', NotepadNode );