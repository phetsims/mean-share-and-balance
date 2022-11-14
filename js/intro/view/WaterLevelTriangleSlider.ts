// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in 3D cups.
 *
 * The triangle code in this Node is duplicated. Transferring to scenery-phet: https://github.com/phetsims/scenery-phet/issues/748
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSlider, { VSliderOptions } from '../../../../sun/js/VSlider.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = EmptySelfOptions;
type WaterLevelTriangleSliderOptions =
  SelfOptions
  & StrictOmit<VSliderOptions, 'pickable' | 'inputEnabled' | 'cursor'>
  & PickRequired<VSliderOptions, 'tandem'>;

export default class WaterLevelTriangleSlider extends VSlider {

  public constructor( waterLevelProperty: Property<number>, enabledRangeProperty: TReadOnlyProperty<Range>, height: number,
                      providedOptions: WaterLevelTriangleSliderOptions ) {

    const thumbNode = new TriangleNode( {
      fill: '#51CEF4',
      tandem: providedOptions.tandem.createTandem( 'thumbNode' )
    } );

    const options = optionize<WaterLevelTriangleSliderOptions, SelfOptions, VSliderOptions>()( {
        cursor: 'pointer',
        thumbNode: thumbNode,
        enabledRangeProperty: enabledRangeProperty,
        trackFillEnabled: null,
        trackFillDisabled: null,
        trackStroke: null,
        trackPickable: false,
        trackSize: new Dimension2( 0, height )
      },
      providedOptions );

    super( waterLevelProperty, MeanShareAndBalanceConstants.WATER_LEVEL_RANGE, options );

    // Set pointer areas for slider thumb node.
    thumbNode.mouseArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    thumbNode.touchArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleSlider', WaterLevelTriangleSlider );