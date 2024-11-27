// Copyright 2024, University of Colorado Boulder

/**
 * PartyTableNode renders an image of a table with a tablecloth over it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Image, ImageOptions, NodeOptions } from '../../../../scenery/js/imports.js';
import partyTable_svg from '../../../images/partyTable_svg.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type PartyTableNodeOptions = SelfOptions & StrictOmit<ImageOptions, 'maxWidth'>;

export default class PartyTableNode extends Image {

  public constructor( providedOptions?: PartyTableNodeOptions ) {

    const options = optionize<PartyTableNodeOptions, SelfOptions, NodeOptions>()( {
        maxWidth: 780, // width empirically determined to work with the plate placements
        isDisposable: false
      },
      providedOptions
    );
    super( partyTable_svg, options );
  }
}

meanShareAndBalance.register( 'PartyTableNode', PartyTableNode );