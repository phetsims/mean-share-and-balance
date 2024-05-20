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
import ScreenView from '../../../joist/js/ScreenView.js';
import graphiteTexture_png from '../../images/graphiteTexture_png.js';
import Matrix3 from '../../../dot/js/Matrix3.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Property from '../../../axon/js/Property.js';
import Dimension2 from '../../../dot/js/Dimension2.js';

const DEFAULT_MARGIN = 15;
const CONTROLS_MAX_TEXT_WIDTH = 175;
const CONTROLS_PREFERRED_WIDTH = CONTROLS_MAX_TEXT_WIDTH + 25;
const NUMBER_LINE_LEFT_X_MARGIN = 135;
const NUMBER_LINE_RIGHT_X_MARGIN = 215;

// Width of the plate (aka diameter) in screen coordinates.
const PLATE_WIDTH = 45;

const MeanShareAndBalanceConstants = {

  // The interval to which the mean value is rounded when shown to the user.  For example, 5.666667 would be 5.7.
  MEAN_ROUNDING_INTERVAL: 0.1,

  NUMBER_SPINNER_CONTAINERS_RANGE: new Range( 1, 7 ),
  SCREEN_VIEW_X_MARGIN: DEFAULT_MARGIN,
  SCREEN_VIEW_Y_MARGIN: DEFAULT_MARGIN,
  INITIAL_NUMBER_OF_CUPS: 2,
  INITIAL_NUMBER_OF_PEOPLE: 2,
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

  MAX_CONTROLS_TEXT_WIDTH: CONTROLS_MAX_TEXT_WIDTH,
  CONTROLS_PREFERRED_WIDTH: CONTROLS_PREFERRED_WIDTH,
  CHECKBOX_FONT_SIZE: 15,
  CHECKBOX_OPTIONS: {
    boxWidth: 16
  },

  // If the notepad plate image is change, update dimension to match the new aspect ratio.
  NOTEPAD_PLATE_DIMENSION: new Dimension2( PLATE_WIDTH, 5 ),

  CANDY_BAR_HEIGHT: 12,
  CANDY_BAR_WIDTH: PLATE_WIDTH,

  APPLE_GRAPHIC_RADIUS: 8,
  TABLE_CANDY_BAR_VERTICAL_SPACING: 1.5,
  NOTEPAD_CANDY_BAR_VERTICAL_SPACING: 3,
  UNUSED_SNACK_POSITION: new Vector2( 0, 0 ),

  TABLE_PLATE_CENTER_Y: 510,
  PARTY_TABLE_Y: 498,

  MAX_NUMBER_OF_SNACKS_PER_PLATE: 10,
  MIN_NUMBER_OF_SNACKS_PER_PLATE: 0,
  NOTEPAD_PAPER_CENTER_Y: 220,
  NOTEPAD_LINE_PATTERN: new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.975 ) ),
  NOTEPAD_LINE_PATTERN_WIDTH: 1.95,

  SOCCER_BALL_RANGE: new Range( 0, 10 ),
  NUMBER_OF_KICKS_RANGE_PROPERTY: new Property( new Range( 0, 7 ) ),
  GROUND_POSITION_Y: 558,
  INITIAL_NUMBER_OF_SOCCER_BALLS: 0,
  NUMBER_LINE_LEFT_X_MARGIN: NUMBER_LINE_LEFT_X_MARGIN,
  CHART_VIEW_WIDTH: ScreenView.DEFAULT_LAYOUT_BOUNDS.width - CONTROLS_PREFERRED_WIDTH
                    - NUMBER_LINE_LEFT_X_MARGIN - NUMBER_LINE_RIGHT_X_MARGIN,
  FULCRUM_DEFAULT_POSITION: 5,
  FULCRUM_ICON_TRIANGLE_DIMENSIONS: { triangleHeight: 22, triangleWidth: 24 }
};

meanShareAndBalance.register( 'MeanShareAndBalanceConstants', MeanShareAndBalanceConstants );
export default MeanShareAndBalanceConstants;