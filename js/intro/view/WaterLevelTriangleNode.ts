// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in 3D cups.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import VSlider from '../../../../sun/js/VSlider.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {};
type WaterLevelTriangleNodeOptions = SelfOptions & Omit<NodeOptions, 'pickable' | 'inputEnabled'>

export default class WaterLevelTriangleNode extends Node {
  private readonly slider: VSlider;

  constructor( waterLevelProperty: NumberProperty, enabledRangeProperty: Property<Range>,
               providedOptions?: WaterLevelTriangleNodeOptions ) {
    const options = optionize<WaterLevelTriangleNodeOptions, SelfOptions, NodeOptions>()( {
        cursor: 'pointer'
      },
      providedOptions );
    super();

    const sideLength = 15;

    const triangleShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, -Math.sin( Math.PI / 6 ) * sideLength )
      .lineTo( Math.cos( Math.PI / 6 ) * sideLength, Math.sin( Math.PI / 6 ) * sideLength )
      .close()
      .transformed( Matrix3.rotation2( Math.PI / 2 ) );

    const sliderTandem = options.tandem.createTandem( 'waterLevelVSlider' );
    const waterLevelTriangle = new Path( triangleShape, {
      fill: '#51CEF4',
      stroke: 'black',
      tandem: sliderTandem.createTandem( 'thumbNode' )
    } );

    const invisibleTrack = new SliderTrack( new Rectangle( 0, 0, 1, 1 ), waterLevelProperty, new Range( 0, 1 ), {
      tandem: sliderTandem.createTandem( 'trackNode' )
    } );

    this.slider = new VSlider( waterLevelProperty, new Range( 0, 1 ), {
      thumbNode: waterLevelTriangle, trackNode: invisibleTrack,
      tandem: sliderTandem,
      enabledRangeProperty: enabledRangeProperty
    } );

    // Set pointer areas for slider thumb node.
    waterLevelTriangle.mouseArea = waterLevelTriangle.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_DILATION );
    waterLevelTriangle.touchArea = waterLevelTriangle.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_DILATION );

    this.addChild( this.slider );
    this.mutate( options );
  }

  override dispose(): void {
    super.dispose();
    this.slider.dispose();
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleNode', WaterLevelTriangleNode );