// Copyright 2022, University of Colorado Boulder

/**
 * Creates a sticky toggle button with the info icon on it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import BooleanRoundStickyToggleButton from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Path } from '../../../../scenery/js/imports.js';
import infoCircleSolidShape from '../../../../sherpa/js/fontawesome-5/infoCircleSolidShape.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class InfoBooleanStickyToggleButton extends BooleanRoundStickyToggleButton {

  public constructor( dialogVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const infoIcon = new Path( infoCircleSolidShape, {
      scale: 0.08,
      fill: 'midnightBlue'
    } );

    const options = {
      content: infoIcon,
      baseColor: 'rgb( 238, 238, 238 )',
      radius: 18,

      // phet-io
      tandem: tandem.createTandem( 'infoStickyToggleButton' )
    };

   super( dialogVisibleProperty, options );
  }
}

meanShareAndBalance.register( 'InfoBooleanStickyToggleButton', InfoBooleanStickyToggleButton );