// Copyright 2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../meanShareAndBalance.js';
import Range from '../../../dot/js/Range.js';
import MeanShareAndBalanceColors from './MeanShareAndBalanceColors.js';
import { LinearGradient } from '../../../scenery/js/imports.js';

const DEFAULT_MARGIN = 15;

const MeanShareAndBalanceConstants = {

  NUMBER_SPINNER_RANGE: new Range( 1, 7 ),
  SCREEN_VIEW_X_MARGIN: DEFAULT_MARGIN,
  SCREEN_VIEW_Y_MARGIN: DEFAULT_MARGIN,
  INITIAL_NUMBER_OF_CUPS: 2,
  MAXIMUM_NUMBER_OF_CUPS: 7,
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

  CUPS_3D_CENTER_Y: 620,
  CUPS_2D_CENTER_Y: 260,

  INITIAL_NUMBER_OF_PEOPLE: 1,

  MOUSE_AREA_DILATION: 5,
  TOUCH_AREA_DILATION: 10,

  MAX_CONTROLS_TEXT_WIDTH: 175,

  CHOCOLATE_WIDTH: 300,
  CHOCOLATE_HEIGHT: 84

};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;