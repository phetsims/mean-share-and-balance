// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the triangle that adjusts the water level in 3D cups.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import VSlider from '../../../../sun/js/VSlider.js';
import SliderTrack from '../../../../sun/js/SliderTrack.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

type SelfOptions = {};
type WaterLevelTriangleNodeOptions = SelfOptions & NodeOptions

export default class WaterLevelTriangleNode extends Node {
  constructor( waterLevelProperty: NumberProperty,
               dragRange: Range,
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

    const invisibleTrack = new SliderTrack( new Rectangle( 0, 0, 1, 1 ), waterLevelProperty, new Range( 0, 1 ),
      { tandem: sliderTandem.createTandem( 'trackNode' ) } );

    const slider = new VSlider( waterLevelProperty, new Range( 0, 1 ),
      {
        thumbNode: waterLevelTriangle, trackNode: invisibleTrack,
        tandem: sliderTandem
      } );

    this.addChild( slider );

    this.mutate( options );
  }
}

meanShareAndBalance.register( 'WaterLevelTriangleNode', WaterLevelTriangleNode );