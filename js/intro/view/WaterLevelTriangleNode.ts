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
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VSlider from '../../../../sun/js/VSlider.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import TriangleNode from '../../../../scenery-phet/js/TriangleNode.js';

type SelfOptions = EmptySelfOptions;
type WaterLevelTriangleNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'pickable' | 'inputEnabled' | 'cursor'>;

export default class WaterLevelTriangleNode extends Node {
  private readonly slider: VSlider;

  //REVIEW why is waterLevelProperty not Property<number>, as in VSlider?
  //REVIEW why is enabledRangeProperty not IReadOnlyProperty<Range>, as in VSlider trait AccessibleValueHandler?
  public constructor( waterLevelProperty: Property<number>, enabledRangeProperty: Property<Range>, height: number,
                      providedOptions?: WaterLevelTriangleNodeOptions ) {
    const options = optionize<WaterLevelTriangleNodeOptions, SelfOptions, NodeOptions>()( {
        cursor: 'pointer'
      },
      providedOptions );
    super();

    const sliderTandem = options.tandem.createTandem( 'waterLevelVSlider' );
    const thumbNode = new TriangleNode( {
      fill: '#51CEF4',
      tandem: sliderTandem.createTandem( 'thumbNode' )
    } );

    this.slider = new VSlider( waterLevelProperty, new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX ), {
      thumbNode: thumbNode,
      tandem: sliderTandem,
      enabledRangeProperty: enabledRangeProperty,
      trackSize: new Dimension2( 10, height ),

      // Precisely align the bounds of the track, independent of the slider width, so the slider thumb will go to the
      // top and bottom of the cup
      trackBoundsDilation: false,
      trackFillEnabled: null,
      trackFillDisabled: null,
      trackStroke: null,
      trackPickable: false
    } );

    // Set pointer areas for slider thumb node.
    thumbNode.mouseArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    thumbNode.touchArea = thumbNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );

    this.addChild( this.slider );
    this.mutate( options );
  }

  public override dispose(): void {
    super.dispose();
    this.slider.dispose();
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleNode', WaterLevelTriangleNode );