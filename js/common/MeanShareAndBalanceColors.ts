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
  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( meanShareAndBalance, 'background', {
    default: '#FFF9F0'
  } ),
  water2DFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'water2DFill', {
    default: '#51CEF4'
  } ),
  waterCup2DBackgroundFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'waterCup2DBackgroundFill', {
    default: 'white'
  } ),
  showMeanLineStrokeColorProperty: new ProfileColorProperty( meanShareAndBalance, 'showMeanLineStroke', {
    default: 'red'
  } ),
  water3DFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'waterSide3DFill', {
    default: '#A5D9F2'
  } ),
  water3DFrontEdgeFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'water3DFrontEdgeFill', {
    default: '#8EC6DD'
  } ),
  water3DBackEdgeFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'water3DBackEdgeFill', {
    default: '#9CD0E5'
  } ),
  water3DCrescentFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'water3DCrescentFill', {
    default: '#B4E5F9'
  } ),
  waterCup3DGlareFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'waterCup3DGlareFill', {
    default: 'white'
  } )
};

meanShareAndBalance.register( 'meanShareAndBalanceColors', meanShareAndBalanceColors );
export default meanShareAndBalanceColors;