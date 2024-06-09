// Copyright 2022-2024, University of Colorado Boulder

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

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

const meanShareAndBalanceColors = {
  levelOutScreenBackgroundColorProperty: new ProfileColorProperty( meanShareAndBalance, 'levelOutScreenBackground', {
    default: '#FFF9F0'
  } ),
  distributeScreenColorProperty: new ProfileColorProperty( meanShareAndBalance, 'distributeScreenBackground', {
    default: '#DEEDFC'
  } ),
  fairShareScreenColorProperty: new ProfileColorProperty( meanShareAndBalance, 'fairShareScreenBackground', {
    default: '#F8E3E2'
  } ),
  balancePointScreenColorProperty: new ProfileColorProperty( meanShareAndBalance, 'balancePointScreenBackground', {
    default: '#BEDBF2'
  } ),
  levelOutQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'levelOutQuestionBar', {
    default: '#2496D6'
  } ),
  waterFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'tableCupWaterSideFill', {
    default: '#A5D9F2'
  } ),
  notepadCupBackgroundFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'notepadCupBackgroundFill', {
    default: 'white'
  } ),
  predictMeanSliderStrokeColorProperty: new ProfileColorProperty( meanShareAndBalance, 'predictMeanSlider', {
    default: '#666666'
  } ),
  predictMeanSuccessFillProperty: new ProfileColorProperty( meanShareAndBalance, 'predictMeanSuccessFill', {
    default: 'yellow'
  } ),
  waterShadowFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'waterShadowFill', {
    default: '#8EC6DD'
  } ),
  emptyTableCupColorProperty: new ProfileColorProperty( meanShareAndBalance, 'emptyTableCup', {
    default: new Color( 249, 253, 255, 0.4 )
  } ),
  tableCupCrescentFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'tableCupCrescentFill', {
    default: '#B4E5F9'
  } ),
  tableCupGlareFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'tableCupGlareFill', {
    default: new Color( 255, 255, 255, 0.4 )
  } ),
  pipeGradientLightColorProperty: new ProfileColorProperty( meanShareAndBalance, 'pipeGradientLight', {
    default: 'white'
  } ),
  pipeGradientDarkColorProperty: new ProfileColorProperty( meanShareAndBalance, 'pipeGradientDark', {
    default: '#4d4d4d'
  } ),
  distributeQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'distributeQuestionBar', {
    default: '#78C4F7'
  } ),
  fairShareQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'fairShareQuestionBar', {
    default: '#FD9698'
  } ),
  candyBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'candyBar', {
    default: '#846645'
  } ),
  notepadColorProperty: new ProfileColorProperty( meanShareAndBalance, 'notepad', {
    default: 'rgb(240,240,240)'
  } ),
  notepadReadoutBackgroundColorProperty: new ProfileColorProperty( meanShareAndBalance, 'notepadReadoutBackground', {
    default: 'rgba(240,240,240,0.8)'
  } ),
  appleColorProperty: new ProfileColorProperty( meanShareAndBalance, 'apple', {
    default: '#00A048'
  } ),
  appleOutlineColorProperty: new ProfileColorProperty( meanShareAndBalance, 'appleOutline', {
    default: '#555555'
  } ),
  balancePointQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'balancePointQuestionBar', {
    default: '#009246'
  } ),
  meanColorProperty: new ProfileColorProperty( meanShareAndBalance, 'mean', {
    default: '#690BFF'
  } ),
  checkButtonColorProperty: new ProfileColorProperty( meanShareAndBalance, 'checkButton', {
    default: '#FFF383'
  } ),
  numberPickerColorProperty: new ProfileColorProperty( meanShareAndBalance, 'numberPicker', {
    default: '#000000'
  } ),
  balanceBeamBallsColorProperty: new ProfileColorProperty( meanShareAndBalance, 'balanceBeamBalls', {
    default: '#4d4d4d'
  } ),
  arrowFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'arrowFill', {
    default: '#FFF383'
  } ),
  infoIconFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'infoIconFill', {
    default: '#286AA1'
  } )
};

meanShareAndBalance.register( 'meanShareAndBalanceColors', meanShareAndBalanceColors );
export default meanShareAndBalanceColors;