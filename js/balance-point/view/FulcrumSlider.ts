// Copyright 2024, University of Colorado Boulder
/**
 * The fulcrum of the balance beam is a slider that can move along the x-axis in increments of a tenth.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import { BALANCE_BEAM_TRANSFORM } from './BalanceBeamNode.js';
import Utils from '../../../../dot/js/Utils.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import { Color, HBox } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  fulcrumHeight: number; // in meters
  fulcrumWidth: number; // in meters
};

type BalanceBeamFulcrumOptions = SelfOptions & WithRequired<HSliderOptions, 'tandem'>;

// constants
const CUEING_ARROW_LENGTH = 24;
const CUEING_ARROW_OPTIONS = {
  fill: MeanShareAndBalanceColors.arrowFillColorProperty,
  stroke: Color.BLACK,
  lineWidth: 1,
  headWidth: 22,
  headHeight: 14,
  tailWidth: 12
};

export default class FulcrumSlider extends HSlider {

  // A Property that tracks whether the fulcrum has been dragged.
  private readonly wasDraggedProperty = new BooleanProperty( false );

  public constructor(
    fulcrumValueProperty: Property<number>,
    meanValueProperty: TReadOnlyProperty<number | null>,
    isMeanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    providedOptions: BalanceBeamFulcrumOptions
  ) {

    const triangleHeight = Math.abs( BALANCE_BEAM_TRANSFORM.modelToViewDeltaY( providedOptions.fulcrumHeight ) );
    const triangleWidth = BALANCE_BEAM_TRANSFORM.modelToViewDeltaX( providedOptions.fulcrumWidth );
    const lineWidth = 1.5; // empirically determined

    const fulcrumNode = new TriangleNode( {
      triangleHeight: triangleHeight - lineWidth,
      triangleWidth: triangleWidth,
      fill: MeanShareAndBalanceColors.meanColorProperty,
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineWidth: lineWidth
    } );

    const leftCueingArrow = new ArrowNode( 0, 0, -CUEING_ARROW_LENGTH, 0, CUEING_ARROW_OPTIONS );
    const rightCueingArrow = new ArrowNode( 0, 0, CUEING_ARROW_LENGTH, 0, CUEING_ARROW_OPTIONS );

    const thumbNode = new HBox( {
      children: [
        leftCueingArrow,
        fulcrumNode,
        rightCueingArrow
      ],
      excludeInvisibleChildrenFromBounds: false,
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const options = optionize<BalanceBeamFulcrumOptions, SelfOptions, HSliderOptions>()( {
      thumbNode: thumbNode,
      thumbYOffset: triangleHeight / 2,
      trackFillEnabled: null,
      trackFillDisabled: null,
      trackStroke: null,
      trackPickable: false,
      constrainValue: value => Utils.roundToInterval( value, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL ),
      trackSize: new Dimension2( MeanShareAndBalanceConstants.CHART_VIEW_WIDTH, 0 ),
      drag: () => { this.wasDraggedProperty.value = true; }
    }, providedOptions );
    super( fulcrumValueProperty, MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, options );

    // Hook up visibility control for the cueing arrows.
    const cueingArrowsVisibleProperty = new DerivedProperty(
      [ this.wasDraggedProperty, isMeanFulcrumFixedProperty, meanValueProperty ],
      ( wasDragged, isMeanFulcrumFixed ) => !isMeanFulcrumFixed && !wasDragged && meanValueProperty.value !== null
    );
    leftCueingArrow.visibleProperty = cueingArrowsVisibleProperty;
    rightCueingArrow.visibleProperty = cueingArrowsVisibleProperty;

    // Change the appearance of the fulcrum based on the mode.
    isMeanFulcrumFixedProperty.link( isMeanFulcrumFixed => {
      this.pickable = !isMeanFulcrumFixed;
      fulcrumNode.fill = isMeanFulcrumFixed ? MeanShareAndBalanceColors.meanColorProperty : 'white';
      fulcrumNode.lineDash = isMeanFulcrumFixed ? [] : [ 2, 2 ];
    } );

    // When the fulcrum is in the "fixed" mode (always at the mean), but there are no balls on the beam, we want the
    // fulcrum to appear faded.  This property determines the opacity based on that information.
    Multilink.multilink( [ isMeanFulcrumFixedProperty, meanValueProperty ],
      ( isMeanFulcrumFixed, meanValue ) => {
        fulcrumNode.opacity = isMeanFulcrumFixed && meanValue === null ? 0.2 : 1;
      }
    );

    Multilink.multilink( [ meanValueProperty, isMeanFulcrumFixedProperty ], ( meanValue, isFixed ) => {
      if ( isFixed ) {
        fulcrumValueProperty.value = meanValue === null ?
                                     MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getCenter() :
                                     Utils.roundToInterval( meanValue, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL );
      }
    } );
  }

  public override reset(): void {
    this.wasDraggedProperty.reset();
    super.reset();
  }
}

meanShareAndBalance.register( 'FulcrumSlider', FulcrumSlider );