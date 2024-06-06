// Copyright 2024, University of Colorado Boulder

/**
 * NotepadAppleNode is the graphical representation of an Apple that is shown on the notepad in this sim.  It is meant
 * to look like a simple apple that has been sketched on a notepad.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, Image, Node, NodeOptions, Path, PathOptions, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Apple from '../model/Apple.js';
import { Shape } from '../../../../kite/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import sketchedAppleFill_svg from '../../../images/sketchedAppleFill_svg.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';

type SelfOptions = EmptySelfOptions;
type NotepadAppleNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

// constants
const RADIUS = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS;
const OUTLINE_LINE_DASH = [ 1, 2 ];

export default class NotepadAppleNode extends Node {

  public constructor( apple: Apple,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: NotepadAppleNodeOptions ) {

    // Add a dotted outline for the full circle.  This is only shown for fractional apples.
    const outlineCircle = new Circle( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, {
      stroke: MeanShareAndBalanceColors.appleOutlineColorProperty,
      lineDash: OUTLINE_LINE_DASH
    } );

    // Add the main representation, which will be a circle for a full apple or a partial circle for a fractional apple.
    const foregroundShape = new Path( null, {
      stroke: MeanShareAndBalanceColors.appleOutlineColorProperty
    } );

    // Create the background.
    const backgroundNode = NotepadAppleNode.createBackgroundNode();

    // Layer the component Nodes together into the composite Node.
    const options = optionize<NotepadAppleNodeOptions, SelfOptions, PathOptions>()(
      { children: [ backgroundNode, outlineCircle, foregroundShape ], isDisposable: false },
      providedOptions
    );

    super( options );

    // Update the shape and the visibility of the various child nodes as the fractional amount of the apple changes.
    apple.fractionProperty.link( fraction => {
      if ( fraction.getValue() === 1 ) {
        foregroundShape.setShape( Shape.circle( 0, 0, RADIUS ) );
        outlineCircle.visible = false;
        backgroundNode.clipArea = null;
      }
      else {
        assert && assert( fraction.value < 1 && fraction.value > 0, 'unsupported fraction value' );
        const fractionalShape = NotepadAppleNode.getFractionalShape( fraction );
        foregroundShape.setShape( fractionalShape );
        backgroundNode.clipArea = fractionalShape;
        outlineCircle.visible = true;
      }
    } );

    // Update this Node's position when the model element moves.
    apple.positionProperty.link( position => this.setTranslation( modelViewTransform.modelToViewPosition( position ) ) );

    // In ?dev mode, show the index of the apple to help understand how things are organized and how they redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( apple.instanceID, { fill: 'black', centerX: 0, centerY: 0 } ) );
    }
  }

  /**
   * Create a partial circular shape based on the apple graphic radius and the provided fractional value.
   */
  private static getFractionalShape( fraction: Fraction ): Shape {
    return new Shape()
      .moveTo( 0, 0 )
      .lineTo( RADIUS, 0 )
      .arc( 0, 0, RADIUS, 0, fraction.value * 2 * Math.PI )
      .lineTo( 0, 0 );
  }

  private static createBackgroundNode(): Node {

    // Create the image node that will act as the background.
    const backgroundImage = new Image( sketchedAppleFill_svg, {
      centerX: 0,
      centerY: 0
    } );

    // Put the image inside a parent node that can be easily positioned and clipped.
    return new Node( {
      children: [ backgroundImage ],
      scale: RADIUS * 2 / backgroundImage.width
    } );
  }
}

meanShareAndBalance.register( 'NotepadAppleNode', NotepadAppleNode );