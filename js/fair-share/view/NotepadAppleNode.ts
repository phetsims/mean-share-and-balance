// Copyright 2024, University of Colorado Boulder

/**
 * NotepadAppleNode is the graphical representation of an Apple that is shown on the notepad in this sim.  It is
 * essentially just a circle filled with the same color as the apple images that are shown on the plates.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Path, PathOptions, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Apple from '../model/Apple.js';
import { Shape } from '../../../../kite/js/imports.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;
type NotepadAppleNodeOptions = SelfOptions & PickRequired<PathOptions, 'tandem' | 'visibleProperty'>;

export default class NotepadAppleNode extends Path {

  public constructor( apple: Apple, providedOptions: NotepadAppleNodeOptions ) {

    const options = optionize<NotepadAppleNodeOptions, SelfOptions, PathOptions>()( {
        fill: MeanShareAndBalanceColors.appleColorProperty,
        stroke: 'black'
      },
      providedOptions
    );

    super( null, options );

    // Update the shape as the fractional amount changes.
    apple.fractionProperty.link( fraction => {
      const radius = MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS;
      if ( fraction.getValue() === 1 ) {
        this.setShape( Shape.circle( 0, 0, radius ) );
      }
      else {
        assert && assert( fraction.value < 1 && fraction.value > 0, 'unsupported fraction value' );
        this.setShape( new Shape()
          .moveTo( 0, 0 )
          .lineTo( radius, 0 )
          .arc( 0, 0, radius, 0, fraction.value * 2 * Math.PI )
          .lineTo( 0, 0 )
        );
      }
    } );

    // Update this Node's position when the model element moves.
    apple.positionProperty.link( position => this.setTranslation( position ) );

    // In ?dev mode, show the index of the apple to help understand how things are organized and how they redistribute.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Text( apple.instanceID, { fill: 'black', centerX: 0, centerY: 0 } ) );
    }
  }
}

meanShareAndBalance.register( 'NotepadAppleNode', NotepadAppleNode );