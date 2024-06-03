// Copyright 2024, University of Colorado Boulder

/**
 * The MovableFulcrumIcon has two arrows on each side of the fulcrum triangle to indicate the direction that
 * the fulcrum can move.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import TriangleNode, { TriangleNodeOptions } from '../../../../scenery-phet/js/TriangleNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants
const ARROW_LENGTH = 9;
const ARROW_LINE_WIDTH = 0.8;
const ARROW_STARTING_OFFSET = 2;

export default class MovableFulcrumIcon extends Node {

  public constructor( options?: NodeOptions ) {

    const triangleOptions = combineOptions<TriangleNodeOptions>( {
      fill: 'white',
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 2 ]
    }, MeanShareAndBalanceConstants.FULCRUM_ICON_TRIANGLE_DIMENSIONS );
    const icon = new TriangleNode( triangleOptions );

    const leftArrowStart = icon.left + ARROW_STARTING_OFFSET;
    const leftArrow = new ArrowNode( leftArrowStart, icon.centerY, leftArrowStart - ARROW_LENGTH, icon.centerY, {
      fill: MeanShareAndBalanceColors.arrowFillColorProperty,
      stroke: 'black',
      headHeight: ARROW_LENGTH / 2,
      lineWidth: ARROW_LINE_WIDTH
    } );
    icon.addChild( leftArrow );

    const rightArrowStart = icon.right - ARROW_STARTING_OFFSET;
    const rightArrow = new ArrowNode( rightArrowStart, icon.centerY, rightArrowStart + ARROW_LENGTH, icon.centerY, {
      fill: MeanShareAndBalanceColors.arrowFillColorProperty,
      stroke: 'black',
      headHeight: ARROW_LENGTH / 2,
      lineWidth: ARROW_LINE_WIDTH
    } );
    icon.addChild( rightArrow );

    // The aspect ratio of the icon should be square.
    const iconDimension = icon.width > icon.height ? icon.width : icon.height;
    const superOptions = combineOptions<NodeOptions>( {
      children: [ icon ],
      localBounds: new Bounds2( 0, 0, iconDimension, iconDimension ),
      isDisposable: false
    }, options );
    super( superOptions );
    icon.center = this.center;
  }
}

meanShareAndBalance.register( 'MovableFulcrumIcon', MovableFulcrumIcon );