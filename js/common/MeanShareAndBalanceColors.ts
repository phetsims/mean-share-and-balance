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

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

const meanShareAndBalanceColors = {
  // Background color for screens in this sim
  screenBackgroundColorProperty: new ProfileColorProperty( meanShareAndBalance, 'background', {
    default: '#FFF9F0'
  } ),
  introQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'introQuestionBar', {
    default: '#2496D6'
  } ),
  waterFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'tableCupWaterSideFill', {
    default: '#A5D9F2'
  } ),
  notepadCupBackgroundFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'notepadCupBackgroundFill', {
    default: 'white'
  } ),
  showMeanLineStrokeColorProperty: new ProfileColorProperty( meanShareAndBalance, 'showMeanLineStroke', {
    default: '#8500bd'
  } ),
  predictMeanSliderStrokeColorProperty: new ProfileColorProperty( meanShareAndBalance, 'predictMeanSlider', {
    default: '#666666'
  } ),
  waterShadowFillColorProperty: new ProfileColorProperty( meanShareAndBalance, 'waterShadowFill', {
    default: '#8EC6DD'
  } ),
  cupWaterLevelLineColorProperty: new ProfileColorProperty( meanShareAndBalance, 'cupWaterLevelLine', {
    default: '#85BBCC'
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
  handleGradientLightColorProperty: new ProfileColorProperty( meanShareAndBalance, 'handleGradientLight', {
    default: 'red'
  } ),
  handleGradientDarkColorProperty: new ProfileColorProperty( meanShareAndBalance, 'handleGradientDark', {
    default: 'firebrick'
  } ),
  levelingOutQuestionBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'levelingOutQuestionBar', {
    default: '#F97A69'
  } ),
  candyBarColorProperty: new ProfileColorProperty( meanShareAndBalance, 'candyBar', {
    default: '#613912'
  } ),
  candyBarHighlightColorProperty: new ProfileColorProperty( meanShareAndBalance, 'candyBarHighlight', {
    default: '#7F5039'
  } ),
  paperColorProperty: new ProfileColorProperty( meanShareAndBalance, 'paper', {
    default: '#F0F0F0'
  } )
};

meanShareAndBalance.register( 'meanShareAndBalanceColors', meanShareAndBalanceColors );
export default meanShareAndBalanceColors;