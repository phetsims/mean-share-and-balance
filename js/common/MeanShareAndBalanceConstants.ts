// Copyright 2022-2024, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../meanShareAndBalance.js';
import Range from '../../../dot/js/Range.js';
import MeanShareAndBalanceColors from './MeanShareAndBalanceColors.js';
import { LinearGradient, Pattern } from '../../../scenery/js/imports.js';
import graphiteTexture_png from '../../images/graphiteTexture_png.js';
import Matrix3 from '../../../dot/js/Matrix3.js';

const DEFAULT_MARGIN = 15;

const MeanShareAndBalanceConstants = {

  NUMBER_SPINNER_RANGE: new Range( 1, 7 ),
  SCREEN_VIEW_X_MARGIN: DEFAULT_MARGIN,
  SCREEN_VIEW_Y_MARGIN: DEFAULT_MARGIN,
  INITIAL_NUMBER_OF_CUPS: 2,
  INITIAL_NUMBER_OF_PEOPLE: 2,
  INITIAL_NUMBER_OF_SNACKS_ON_FIRST_PLATE: 3,
  MAXIMUM_NUMBER_OF_DATA_SETS: 7,
  CUP_WIDTH: 60,
  CUP_HEIGHT: 120,

  WATER_LEVEL_RANGE_MIN: 0,
  WATER_LEVEL_RANGE_MAX: 1,
  WATER_LEVEL_RANGE: new Range( 0, 1 ),
  WATER_LEVEL_DEFAULT: 0.5,

  VALVE_RADIUS: 10,
  PIPE_WIDTH: 4,
  PIPE_GRADIENT: new LinearGradient( 0, 0, 0, 4 )
    .addColorStop( 0, MeanShareAndBalanceColors.pipeGradientLightColorProperty )
    .addColorStop( 1, MeanShareAndBalanceColors.pipeGradientDarkColorProperty ),
  PIPE_LENGTH: 40,
  CONTROLS_VERTICAL_MARGIN: 30,
  CONTROLS_HORIZONTAL_MARGIN: 15,

  TABLE_CUPS_CENTER_Y: 625,
  NOTEPAD_CUPS_CENTER_Y: 290,

  MOUSE_AREA_DILATION: 5,
  TOUCH_AREA_DILATION: 10,

  MAX_CONTROLS_TEXT_WIDTH: 175,

  CANDY_BAR_WIDTH: 45,
  CANDY_BAR_HEIGHT: 12,
  TABLE_PLATE_WIDTH: 100,
  TABLE_CANDY_BAR_VERTICAL_SPACING: 1.5,
  NOTEPAD_CANDY_BAR_VERTICAL_SPACING: 2,

  NOTEPAD_PLATE_CENTER_Y: 330,
  TABLE_PLATE_CENTER_Y: 515,
  PARTY_TABLE_Y: 498,

  MAX_NUMBER_OF_SNACKS_PER_PLATE: 10,
  MIN_NUMBER_OF_SNACKS_PER_PLATE: 0,
  NOTEPAD_PAPER_CENTER_Y: 220,

  NOTEPAD_LINE_PATTERN: new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.975 ) ),
  NOTEPAD_LINE_WIDTH: 1.95
};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;