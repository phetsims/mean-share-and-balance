// Copyright 2022-2024, University of Colorado Boulder

/**
 * Creates a sticky toggle button with the info icon on it.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import BooleanRoundStickyToggleButton, { BooleanRoundStickyToggleButtonOptions } from '../../../../sun/js/buttons/BooleanRoundStickyToggleButton.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Path } from '../../../../scenery/js/imports.js';
import infoCircleSolidShape from '../../../../sherpa/js/fontawesome-5/infoCircleSolidShape.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class InfoBooleanStickyToggleButton extends BooleanRoundStickyToggleButton {

  public constructor(
    dialogVisibleProperty: Property<boolean>,
    providedOptions?: BooleanRoundStickyToggleButtonOptions ) {

    const infoIcon = new Path( infoCircleSolidShape, {
      scale: 0.08,
      fill: 'midnightBlue'
    } );

    const options = combineOptions<BooleanRoundStickyToggleButtonOptions>( {
      content: infoIcon,
      baseColor: 'rgb( 238, 238, 238 )',
      radius: 18,
      isDisposable: false
    }, providedOptions );

    super( dialogVisibleProperty, options );
  }
}

meanShareAndBalance.register( 'InfoBooleanStickyToggleButton', InfoBooleanStickyToggleButton );