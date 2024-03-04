// Copyright 2024, University of Colorado Boulder

/**
 * The Balance Beam in the notepad representation plots data points along the x-axis and allows users to move the balance
 * point in order to find the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Line, MatrixBetweenProperty, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NumberLineNode from '../../../../soccer-common/js/view/NumberLineNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { Property, TReadOnlyProperty } from '../../../../axon/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import FulcrumSlider from './FulcrumSlider.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { optionize } from '../../../../phet-core/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import LevelSupportColumnNode from '../../../../scenery-phet/js/LevelSupportColumnNode.js';

const BALANCE_BEAM_GROUND_Y = 220;
const TRANSFORM_SCALE = MeanShareAndBalanceConstants.CHART_VIEW_WIDTH / MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength();

export const BALANCE_BEAM_TRANSFORM = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
  new Vector2( MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.min, 0 ),
  new Vector2( 0, BALANCE_BEAM_GROUND_Y ),
  TRANSFORM_SCALE
);

type BalanceBeamNodeOptions = EmptySelfOptions & WithRequired<NodeOptions, 'tandem'>;
export default class BalanceBeamNode extends Node {

  public constructor(
    playAreaNumberLineNode: NumberLineNode,
    paperStackBounds: Bounds2,
    fulcrumValueProperty: Property<number>,
    beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
    areTickMarksVisibleProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalanceBeamNodeOptions
  ) {

    const options = optionize<BalanceBeamNodeOptions, EmptySelfOptions, NodeOptions>()( {}, providedOptions );

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
    const groundY = BALANCE_BEAM_TRANSFORM.modelToViewY( 0 );
    const lineWidth = 1;
    const groundLineCenterY = groundY - lineWidth / 2;
    const groundLine = new Line( lineStart, groundLineCenterY, lineEnd, groundLineCenterY, {
      stroke: 'grey'
    } );

    const fulcrumHeight = -0.7; // the transform is inverted.
    const fulcrumWidth = 0.85;
    const fulcrumSlider = new FulcrumSlider( fulcrumValueProperty, {
      fulcrumHeight: fulcrumHeight,
      fulcrumWidth: fulcrumWidth,
      bottom: groundY,
      tandem: options.tandem?.createTandem( 'fulcrumSlider' )
    } );

    const supportColumns = _.times( 2, i => {

      return new LevelSupportColumnNode( BALANCE_BEAM_TRANSFORM,
        LevelSupportColumnNode.createLevelSupportColumnShape(
          0.4,
          fulcrumHeight,
          0
        ), {
          bottom: groundY,
          centerX: BALANCE_BEAM_TRANSFORM.modelToViewX( i === 0 ? -0.5 : 10.5 ),
          visibleProperty: beamSupportsPresentProperty
      } );
    } );


    const superOptions = combineOptions<NodeOptions>( {
      children: [ notepadNumberLineNode, groundLine, ...supportColumns, fulcrumSlider ]
    }, options );
    super( superOptions );

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