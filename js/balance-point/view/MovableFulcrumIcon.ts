// Copyright 2023, University of Colorado Boulder

/**
 * The MovableFulcrumIcon has two arrows on each side of the fulcrum trial to indicate the direction that
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


export default class MovableFulcrumIcon extends Node {

  public constructor( options?: NodeOptions ) {

    const triangleOptions = combineOptions<TriangleNodeOptions>( {
      fill: 'white',
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 2 ]
    }, MeanShareAndBalanceConstants.FULCRUM_ICON_TRIANGLE_DIMENSIONS );
    const triangle = new TriangleNode( triangleOptions );

    const arrowLength = 8;
    const arrowLineWidth = 0.8;
    const leftArrow = new ArrowNode( triangle.left, triangle.centerY, triangle.left - arrowLength, triangle.centerY, {
      fill: MeanShareAndBalanceColors.arrowFillColorProperty,
      stroke: 'black',
      headHeight: arrowLength / 2,
      lineWidth: arrowLineWidth
    } );
    const rightArrow = new ArrowNode( triangle.right, triangle.centerY, triangle.right + arrowLength, triangle.centerY, {
      fill: MeanShareAndBalanceColors.arrowFillColorProperty,
      stroke: 'black',
      headHeight: arrowLength / 2,
      lineWidth: arrowLineWidth
    } );

    const superOptions = combineOptions<NodeOptions>( {
      children: [ leftArrow, triangle, rightArrow ]
    }, options );
    super( superOptions );
  }
}

meanShareAndBalance.register( 'MovableFulcrumIcon', MovableFulcrumIcon );