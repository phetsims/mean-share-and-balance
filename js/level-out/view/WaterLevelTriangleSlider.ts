// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in table cups.
 *
 * The triangle code in this Node is duplicated. Transferring to scenery-phet: https://github.com/phetsims/scenery-phet/issues/748
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize from '../../../../phet-core/js/optionize.js';
import VSlider, { VSliderOptions } from '../../../../sun/js/VSlider.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WaterLevelSoundPlayer from './WaterLevelSoundPlayer.js';

type SelfOptions = {

  // The cross-fade mix between the two sounds that are combined for the sound generation used for the water level. This
  // value must be between 0 and 1, inclusive.  A value of 0 indication 100% sound A, 1 indicates 100% sound be, and
  // values in between represent a proportionate mix.
  soundPlayerCrossFade?: number;
};
type WaterLevelTriangleSliderOptions =
  SelfOptions
  & StrictOmit<VSliderOptions, 'pickable' | 'inputEnabled' | 'cursor'>
  & PickRequired<VSliderOptions, 'tandem'>;

// constants
const DEFAULT_CROSS_MIX = 0;
const NUMBER_OF_KEYBOARD_STEPS = 9;

export default class WaterLevelTriangleSlider extends VSlider {

  public constructor( waterLevelProperty: Property<number>,
                      enabledRangeProperty: TReadOnlyProperty<Range>,
                      height: number,
                      providedOptions: WaterLevelTriangleSliderOptions ) {

    const thumbNode = new TriangleNode( {
      fill: '#51CEF4',
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const soundPlayer = new WaterLevelSoundPlayer(
      waterLevelProperty,
      enabledRangeProperty,
      NUMBER_OF_KEYBOARD_STEPS - 1,
      providedOptions.soundPlayerCrossFade === undefined ? DEFAULT_CROSS_MIX : providedOptions.soundPlayerCrossFade
    );

    const options = optionize<WaterLevelTriangleSliderOptions, SelfOptions, VSliderOptions>()( {
        cursor: 'pointer',
        thumbNode: thumbNode,
        enabledRangeProperty: enabledRangeProperty,
        trackFillEnabled: null,
        trackFillDisabled: null,
        trackStroke: null,
        trackPickable: false,
        trackSize: new Dimension2( 0, height ),
        soundGenerator: soundPlayer,
        soundPlayerCrossFade: 0,
        keyboardStep: enabledRangeProperty.value.getLength() / NUMBER_OF_KEYBOARD_STEPS,
        shiftKeyboardStep: enabledRangeProperty.value.getLength() / NUMBER_OF_KEYBOARD_STEPS / 2,
        pageKeyboardStep: enabledRangeProperty.value.getLength() / 4,
        isDisposable: false
      },
      providedOptions );

    super( waterLevelProperty, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE, options );

    // Set pointer areas for slider thumb node.
    thumbNode.mouseArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    thumbNode.touchArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleSlider', WaterLevelTriangleSlider );