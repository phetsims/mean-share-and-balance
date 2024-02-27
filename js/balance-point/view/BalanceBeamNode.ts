// Copyright 2023, University of Colorado Boulder

/**
 * The Balance Beam in the notepad representation plots data points along the x-axis and allows users to move the balance
 * point in order to find the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Line, MatrixBetweenProperty, Node } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

// TODO: we will probably want to adjust the vertical transform once we start adding in data points,
//  for now this is only handling x-axis transforms, https://github.com/phetsims/mean-share-and-balance/issues/152
const BALANCE_BEAM_TRANSFORM = ModelViewTransform2.createRectangleInvertedYMapping(
  new Bounds2( MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.min, 0, MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.max, 1 ),
  new Bounds2( 0, 0, MeanShareAndBalanceConstants.CHART_VIEW_WIDTH, 1 )
);
export default class BalanceBeamNode extends Node {

  public constructor(
    modelViewTransform: ModelViewTransform2,
    playAreaNumberLineNode: NumberLineNode,
    paperStackBounds: Bounds2,
    areTickMarksVisibleProperty: TReadOnlyProperty<boolean>
  ) {

    const notepadNumberLineNode = new NumberLineNode( MeanShareAndBalanceConstants.CHART_VIEW_WIDTH,
      MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, {
        includeXAxis: false,
        color: 'black',
        showTickMarks: false,
        visibleProperty: areTickMarksVisibleProperty,
        bottom: paperStackBounds.bottom - 15,
        excludeInvisibleChildrenFromBounds: true
      } );

    const lineStart = BALANCE_BEAM_TRANSFORM.modelToViewX( -1 );
    const lineEnd = BALANCE_BEAM_TRANSFORM.modelToViewX( 11 );
    const groundLine = new Line( lineStart, notepadNumberLineNode.top - 5, lineEnd, notepadNumberLineNode.top - 5, {
      stroke: 'grey'
    } );
    super( {
      children: [ notepadNumberLineNode, groundLine ]
    } );

    // Align with the play are number line node, based on the tick mark values
    const matrixBetweenProperty = new MatrixBetweenProperty( playAreaNumberLineNode.tickMarkSet, notepadNumberLineNode.tickMarkSet );

    matrixBetweenProperty.link( matrix => {

      if ( matrix ) {

        const deltaX = matrix.getTranslation().x;
        if ( deltaX !== 0 ) {

          // Convert to the this.parent coordinate frame
          const localDeltaX = notepadNumberLineNode.tickMarkSet.getUniqueTrailTo( this ).getTransform().transformDeltaX( deltaX );
          this.x += localDeltaX;
        }
      }
    } );
  }
}

meanShareAndBalance.register( 'BalanceBeamNode', BalanceBeamNode );