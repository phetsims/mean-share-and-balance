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
import { FULCRUM_LINE_WIDTH } from './BalanceBeamNode.js';
import Utils from '../../../../dot/js/Utils.js';
import HSlider, { HSliderOptions } from '../../../../sun/js/HSlider.js';
import Property from '../../../../axon/js/Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { Color, HBox } from '../../../../scenery/js/imports.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  fulcrumHeight: number; // in screen coordinates
  fulcrumWidth: number; // in screen coordinates
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
  tailWidth: 12,
  layoutOptions: {
    bottomMargin: 2
  }
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

    const fulcrumNode = new TriangleNode( {
      triangleHeight: providedOptions.fulcrumHeight - FULCRUM_LINE_WIDTH,
      triangleWidth: providedOptions.fulcrumWidth,
      fill: 'white',
      stroke: MeanShareAndBalanceColors.meanColorProperty,
      lineDash: [ 2, 2 ],
      lineWidth: FULCRUM_LINE_WIDTH
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
      align: 'bottom',
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const options = optionize<BalanceBeamFulcrumOptions, SelfOptions, HSliderOptions>()( {
      thumbNode: thumbNode,
      thumbYOffset: providedOptions.fulcrumHeight / 2,
      trackFillEnabled: null,
      trackFillDisabled: null,
      trackStroke: null,
      trackPickable: false,
      visibleProperty: DerivedProperty.not( isMeanFulcrumFixedProperty ),
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

    // Set pointer areas for slider thumb node.
    thumbNode.mouseArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    thumbNode.touchArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }

  public override reset(): void {
    this.wasDraggedProperty.reset();
    super.reset();
  }
}

meanShareAndBalance.register( 'FulcrumSlider', FulcrumSlider );