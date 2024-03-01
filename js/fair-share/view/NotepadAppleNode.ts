// Copyright 2024, University of Colorado Boulder

/**
 * NotepadAppleNode is the graphical representation of an Apple that is shown on the notepad in this sim.  It is
 * essentially just a circle filled with the same color as the apple images that are shown on the plates.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, Node, NodeOptions, Path, PathOptions, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Apple from '../model/Apple.js';
import { Shape } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SelfOptions = EmptySelfOptions;
type NotepadAppleNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem' | 'visibleProperty'>;

export default class NotepadAppleNode extends Node {

  public constructor( apple: Apple,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: NotepadAppleNodeOptions ) {

    // Add a dotted outline for the full circle.  This is only shown for fractional apples.
    const outlineCircle = new Circle( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, {
      stroke: 'black',
      lineDash: [ 1, 2 ]
    } );

    // Add the main representation, which will be a circle for a full apply or a partial circle for a fractional apple.
    const foregroundShape = new Path( null, {
      stroke: 'black',
      fill: MeanShareAndBalanceColors.appleColorProperty
    } );

    const options = optionize<NotepadAppleNodeOptions, SelfOptions, PathOptions>()( {
        children: [ outlineCircle, foregroundShape ]
      },
      providedOptions
    );

    super( options );

    // Update the shape and the visibility of the outline as the fractional amount changes.
    apple.fractionProperty.link( fraction => {
      const radius = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS;
      if ( fraction.getValue() === 1 ) {
        foregroundShape.setShape( Shape.circle( 0, 0, radius ) );
        outlineCircle.visible = false;
      }
      else {
        assert && assert( fraction.value < 1 && fraction.value > 0, 'unsupported fraction value' );
        foregroundShape.setShape( new Shape()
          .moveTo( 0, 0 )
          .lineTo( radius, 0 )
          .arc( 0, 0, radius, 0, fraction.value * 2 * Math.PI )
          .lineTo( 0, 0 )
        );
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
}

meanShareAndBalance.register( 'NotepadAppleNode', NotepadAppleNode );