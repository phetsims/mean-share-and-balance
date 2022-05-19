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
  CUP_WIDTH: 50,
  CUP_HEIGHT: 100,
  WATER_LEVEL_DEFAULT: 0.5,
  PIPE_STROKE_WIDTH: 1,
  PIPE_LENGTH: 50,
  CONTROLS_VERTICAL_MARGIN: 30,
  CONTROLS_HORIZONTAL_MARGIN: 100,
  CUPS_3D_Y_VALUE: 400,
  CUPS_2D_Y_VALUE: 200,
  MOUSE_DILATION: 5,
  TOUCH_DILATION: 10
};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;