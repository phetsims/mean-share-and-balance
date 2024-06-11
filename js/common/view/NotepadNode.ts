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
import DerivedProperty, { UnknownDerivedProperty } from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import notepadRing_svg from '../../../images/notepadRing_svg.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';

type SelfOptions = {
  readoutPatternStringProperty?: PatternStringProperty<{
    total: TReadOnlyProperty<number>;
    measurement: UnknownDerivedProperty<string>;
  }> | null;
  totalVisibleProperty?: Property<boolean> | null;
  meanInfoPanelVisibleProperty?: Property<boolean> | null;
};

export type NotepadNodeOptions = SelfOptions &
  StrictOmit<NodeOptions, 'children' | 'centerY'> &
  PickRequired<PhetioObjectOptions, 'tandem'>;

// Constants
const NOTEPAD_RING_BOTTOM = 33.5;
const PAPER_PAGE_SIZE = new Dimension2( 720, 240 );
const LABEL_MARGIN = 15;
const TOTAL_MARGIN = 5;
const PAPER_STACK_HEIGHT = 4;
const STACK_OFFSET = 3;
const NUMBER_OF_RINGS = 8;

export default class NotepadNode extends Node {

  // The bounds of the stack of notebook pages in the NotepadNode's local coordinate frame.  This does *not* include the
  // rings, and is thus useful for bounding things that need to stay on/within the notebook pages.
  protected readonly paperStackBounds: Bounds2;

  // The parent node for the set of ring images.
  protected readonly ringsNode;

  // The parent node for the readout text and background.
  protected readonly readoutNode: Node | null;

  public constructor( providedOptions: NotepadNodeOptions ) {

    const options = optionize<NotepadNodeOptions, SelfOptions, NodeOptions>()( {
      readoutPatternStringProperty: null,
      totalVisibleProperty: null,
      meanInfoPanelVisibleProperty: null,
      phetioVisiblePropertyInstrumented: false,
      isDisposable: false
    }, providedOptions );

    const paperStackNode = new Node();
    const paperWidth = PAPER_PAGE_SIZE.width;
    const paperHeight = PAPER_PAGE_SIZE.height;

    for ( let i = PAPER_STACK_HEIGHT; i > 0; i-- ) {
      const xOffset = i * -STACK_OFFSET;
      const yOffset = i * STACK_OFFSET;
      const paper = new Rectangle( xOffset, yOffset, paperWidth, paperHeight, {
        fill: MeanShareAndBalanceColors.notepadColorProperty,
        stroke: 'black',
        cornerRadius: 10
      } );
      paperStackNode.addChild( paper );
    }

    // Create the set of notebook ring images.
    const ringsNode = new Node();
    _.times( NUMBER_OF_RINGS, ( i: number ) => {
      const x = i * ( ( paperWidth - 20 ) / NUMBER_OF_RINGS ) + 30;
      const image = new Image( notepadRing_svg, { x: x, bottom: NOTEPAD_RING_BOTTOM, maxHeight: 55 } );
      ringsNode.addChild( image );
    } );

    const superOptions = combineOptions<NodeOptions>( {
      children: [ paperStackNode, ringsNode ],
      centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y
    }, options );
    super( superOptions );

    // Make a copy of the paper stack bounds available to subclasses for positioning of child nodes.
    this.paperStackBounds = paperStackNode.bounds.copy();
    this.readoutNode = null;

    if ( options.readoutPatternStringProperty ) {
      const readoutText = new Text( options.readoutPatternStringProperty, {
        font: new PhetFont( 16 ),
        maxWidth: 200,
        fill: 'black'
      } );
      const readoutBackground = new BackgroundNode( readoutText, {
        xMargin: TOTAL_MARGIN,
        yMargin: TOTAL_MARGIN,
        rectangleOptions: {
          opacity: 0.5,
          cornerRadius: 5
        }
      } );
      readoutText.center = readoutBackground.center;

      const readoutAlignBox = new AlignBox( readoutBackground, {
        alignBounds: this.paperStackBounds.dilatedX( -LABEL_MARGIN ),
        xAlign: 'center',
        yAlign: 'top',
        yMargin: NOTEPAD_RING_BOTTOM + 5,
        visibleProperty: options.totalVisibleProperty
      } );
      this.addChild( readoutAlignBox );
      this.readoutNode = readoutAlignBox;
    }

    // The notepad is under the mean info panel, so UI components on this notepad should be removed from the
    // traversal order when the mean info panel is visible.
    if ( options.meanInfoPanelVisibleProperty ) {
      this.pdomVisibleProperty = DerivedProperty.not( options.meanInfoPanelVisibleProperty );
    }

    // Make the rings node available to subclasses for layering adjustments.
    this.ringsNode = ringsNode;
  }
}

meanShareAndBalance.register( 'NotepadNode', NotepadNode );