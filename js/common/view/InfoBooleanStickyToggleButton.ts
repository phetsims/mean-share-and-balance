// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import BooleanRoundStickyToggleButton from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Path } from '../../../../scenery/js/imports.js';
import infoCircleSolidShape from '../../../../sherpa/js/fontawesome-5/infoCircleSolidShape.js';

export default class InfoBooleanStickyToggleButton extends BooleanRoundStickyToggleButton {

  public constructor( dialogVisibleProperty: Property<boolean> ) {

    const infoIcon = new Path( infoCircleSolidShape, {
      scale: 0.08,
      fill: 'midnightBlue'
    } );

    const options = {
      content: infoIcon,
      baseColor: 'rgb( 238, 238, 238 )',
      radius: 18
    };

   super( dialogVisibleProperty, options );
  }
}

meanShareAndBalance.register( 'InfoBooleanStickyToggleButton', InfoBooleanStickyToggleButton );