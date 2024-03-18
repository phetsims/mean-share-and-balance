// Copyright 2023, University of Colorado Boulder

/**
 * The FixedFulcrumIcon has a line on top of the fulcrum triangle and is fully filled in.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import TriangleNode, { TriangleNodeOptions } from '../../../../scenery-phet/js/TriangleNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants
const LINE_WIDTH = 1.5;
const LINE_EXTENSION = 5;

export default class FixedFulcrumIcon extends Node {

  public constructor( options?: NodeOptions ) {

    const triangleOptions = combineOptions<TriangleNodeOptions>( {
      fill: MeanShareAndBalanceColors.meanColorProperty,
      stroke: MeanShareAndBalanceColors.meanColorProperty
    }, MeanShareAndBalanceConstants.FULCRUM_ICON_TRIANGLE_DIMENSIONS );
    const icon = new TriangleNode( triangleOptions );

    const line = new Line( icon.left - LINE_EXTENSION, icon.top, icon.right + LINE_EXTENSION, icon.top, {
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: LINE_WIDTH,
      lineCap: 'round'
    } );
    icon.addChild( line );

    // The aspect ratio of the icon should be square.
    const iconDimension = icon.width > icon.height ? icon.width : icon.height;
    const superOptions = combineOptions<NodeOptions>( {
      children: [ icon ],
      localBounds: new Bounds2( 0, 0, iconDimension, iconDimension )
    }, options );
    super( superOptions );
    icon.center = this.center;
  }
}

meanShareAndBalance.register( 'FixedFulcrumIcon', FixedFulcrumIcon );