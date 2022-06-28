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
  CUP_WIDTH: 60,
  CUP_HEIGHT: 120,
  CUP_RANGE_MIN: 0,
  CUP_RANGE_MAX: 1,
  WATER_LEVEL_DEFAULT: 0.5,
  //REVIEW Should this be renamed PIPE_LINE_WIDTH, and be used to set lineWidth for the pipe?
  PIPE_STROKE_WIDTH: 1,
  PIPE_LENGTH: 50,
  CONTROLS_VERTICAL_MARGIN: 30,
  CONTROLS_HORIZONTAL_MARGIN: 15,

  // Sets center Y value for cups.
  //REVIEW If these set centerY, then they should be named CUPS_3D_CENTER_Y and CUPS_2D_CENTER_Y. The current names correspond to a Node's y property.
  CUPS_3D_Y_VALUE: 525,
  CUPS_2D_Y_VALUE: 275,

  //REVIEW These names are a little vague/incorrect. MOUSE_AREA_DILATION and TOUCH_AREA_DILATION dilation would be clearer.
  MOUSE_DILATION: 5,
  TOUCH_DILATION: 10,

  MAX_CONTROLS_TEXT_WIDTH: 175

};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;