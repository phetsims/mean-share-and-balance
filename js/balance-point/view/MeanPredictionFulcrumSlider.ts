// Copyright 2024, University of Colorado Boulder

/**
 * The fulcrum of the balance beam is a slider that can move discretely along the x-axis.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FulcrumSliderSoundPlayer from './FulcrumSliderSoundPlayer.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

type SelfOptions = {
  fulcrumHeight: number; // in screen coordinates
  fulcrumWidth: number; // in screen coordinates
};

type MeanPredictionFulcrumSliderOptions = SelfOptions & WithRequired<HSliderOptions, 'tandem'>;

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

export default class MeanPredictionFulcrumSlider extends HSlider {

  public readonly isDraggingProperty: BooleanProperty;

  public constructor(
    fulcrumValueProperty: Property<number>,
    fulcrumWasDraggedProperty: Property<boolean>,
    meanValueProperty: TReadOnlyProperty<number | null>,
    isMeanFulcrumFixedProperty: TReadOnlyProperty<boolean>,
    beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
    providedOptions: MeanPredictionFulcrumSliderOptions
  ) {

    // Create the thumb node for the fulcrum slider.
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
      excludeInvisibleChildrenFromBounds: false, // we do not want the bounds to change when the arrows are hidden
      align: 'bottom',
      tandem: providedOptions.tandem.createTandem( 'thumbNode' ),
      phetioVisiblePropertyInstrumented: false
    } );

    const sliderSoundGenerator = new FulcrumSliderSoundPlayer( beamSupportsPresentProperty, meanValueProperty );
    const options = optionize<MeanPredictionFulcrumSliderOptions, SelfOptions, HSliderOptions>()( {
      thumbNode: thumbNode,
      thumbYOffset: providedOptions.fulcrumHeight / 2,
      trackFillEnabled: null,
      trackFillDisabled: null,
      trackStroke: null,
      trackPickable: false,
      keyboardStep: 0.5,
      shiftKeyboardStep: MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL,
      visibleProperty: DerivedProperty.not( isMeanFulcrumFixedProperty ),
      constrainValue: value => Utils.roundToInterval( value, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL ),
      soundGenerator: sliderSoundGenerator,

      // Necessary to remove rounding errors and apply the constrainValue option during shift steps. https://github.com/phetsims/sun/issues/837
      pdomMapValue: value => Utils.roundToInterval( value, MeanShareAndBalanceConstants.MEAN_ROUNDING_INTERVAL ),
      accessibleName: MeanShareAndBalanceStrings.a11y.findBalancePointStringProperty,
      trackSize: new Dimension2( MeanShareAndBalanceConstants.CHART_VIEW_WIDTH, 0 ),
      startDrag: () => { this.isDraggingProperty.value = true; },
      drag: () => { fulcrumWasDraggedProperty.value = true; },
      endDrag: () => { this.isDraggingProperty.value = false; },
      isDisposable: false
    }, providedOptions );
    super( fulcrumValueProperty, MeanShareAndBalanceConstants.SOCCER_BALL_RANGE, options );

    this.isDraggingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isDraggingProperty' ),
      phetioReadOnly: true
    } );

    // Hook up visibility control for the cueing arrows.
    const cueingArrowsVisibleProperty = new DerivedProperty(
      [ fulcrumWasDraggedProperty, isMeanFulcrumFixedProperty, this.enabledProperty, meanValueProperty ],
      ( wasDragged, isMeanFulcrumFixed, enabled ) => enabled && !isMeanFulcrumFixed && !wasDragged && meanValueProperty.value !== null
    );
    leftCueingArrow.visibleProperty = cueingArrowsVisibleProperty;
    rightCueingArrow.visibleProperty = cueingArrowsVisibleProperty;

    // Set pointer areas for slider thumb node.
    thumbNode.mouseArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    thumbNode.touchArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }
}

meanShareAndBalance.register( 'MeanPredictionFulcrumSlider', MeanPredictionFulcrumSlider );