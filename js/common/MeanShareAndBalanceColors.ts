// Copyright 2022, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a Colors.js file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Edit" mode.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ProfileColorProperty } from '../../../scenery/js/imports.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

const meanShareAndBalanceColors = {

  // Background color that for screens in this sim
  // TODO: More colors should be in this profile so they can be edited using the Color Editor
  screenBackgroundColorProperty: new ProfileColorProperty( meanShareAndBalance, 'background', {
    default: 'white'
  } )
};

meanShareAndBalance.register( 'meanShareAndBalanceColors', meanShareAndBalanceColors );
export default meanShareAndBalanceColors;