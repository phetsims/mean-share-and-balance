// Copyright 2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../meanShareAndBalance.js';

const DEFAULT_MARGIN = 15;

const MeanShareAndBalanceConstants = {

  SCREEN_VIEW_X_MARGIN: DEFAULT_MARGIN,
  SCREEN_VIEW_Y_MARGIN: DEFAULT_MARGIN,
  INITIAL_NUMBER_OF_CUPS: 1,
  MAXIMUM_NUMBER_OF_CUPS: 7,
  CUP_WIDTH: 60,
  CUP_HEIGHT: 120,
  CUP_RANGE_MIN: 0,
  CUP_RANGE_MAX: 1,
  WATER_LEVEL_DEFAULT: 0.5,
  PIPE_LENGTH: 50,
  CONTROLS_VERTICAL_MARGIN: 30,
  CONTROLS_HORIZONTAL_MARGIN: 15,

  CUPS_3D_CENTER_Y: 525,
  CUPS_2D_CENTER_Y: 275,

  INITIAL_NUMBER_OF_PEOPLE: 1,

  MOUSE_AREA_DILATION: 5,
  TOUCH_AREA_DILATION: 10,

  MAX_CONTROLS_TEXT_WIDTH: 175,

  CHOCOLATE_WIDTH: 48,
  CHOCOLATE_HEIGHT: 12

};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;