// Copyright 2024, University of Colorado Boulder

/**
 * NotepadAppleNode is the graphical representation of an Apple that is shown on the notepad in this sim.  It is
 * essentially just a circle filled with the same color as the apple images that are shown on the plates.
 *
 * @author John Blanco (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, InteractiveHighlighting, Node, NodeOptions, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Apple from '../model/Apple.js';

type SelfOptions = EmptySelfOptions;
type NotepadAppleNodeOptions = SelfOptions & StrictOmit<WithRequired<NodeOptions, 'tandem'>, 'children'>;

export default class NotepadAppleNode extends InteractiveHighlighting( Node ) {

  public constructor( apple: Apple, providedOptions: NotepadAppleNodeOptions ) {

    const appleCircle = new Circle( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, {
      fill: MeanShareAndBalanceColors.appleColorProperty,
      stroke: 'black'
    } );

    // In ?dev mode, show the index of the apple to help understand how things are organized and how they redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      appleCircle.addChild( new Text( apple.instanceID, { fill: 'black', centerX: 0, centerY: 0 } ) );
    }

    const options = optionize<NotepadAppleNodeOptions, SelfOptions, NodeOptions>()( {
      children: [ appleCircle ],
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    // Update this Node's position when the model element moves.
    apple.positionProperty.link( position => this.setTranslation( position ) );
  }
}

meanShareAndBalance.register( 'NotepadAppleNode', NotepadAppleNode );