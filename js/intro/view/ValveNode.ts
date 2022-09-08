// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the valve that opens and closes a pipe.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Node, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

const LINE_WIDTH = 1;

export default class ValveNode extends Node {

  public constructor( parentCenter: Vector2, rotationProperty: Property<number>, tandem: Tandem ) {
    // Valve drawing
    const valveGradient = new RadialGradient( 0, 0, 0, 0, 0, MeanShareAndBalanceConstants.VALVE_RADIUS + 2 )
      .addColorStop( 0.5, MeanShareAndBalanceColors.pipeGradientLightColorProperty )
      .addColorStop( 1, MeanShareAndBalanceColors.pipeGradientDarkColorProperty );

    // Function to create circle with center rectangle cut out.
    const createInnerCircle = ( radius: number, rectangleWidth: number ): Shape => {
      const circle = Shape.circle( radius - 1 );
      const rectangle = Shape.rectangle( -rectangleWidth / 2, -radius - 5, rectangleWidth, ( radius + 5 ) * 2 );
      return circle.shapeDifference( rectangle );
    };

    const createOuterCircle = ( radius: number ): Shape => {
      const outerCircle = Shape.circle( radius + 2 );
      const innerCircle = Shape.circle( radius - 1 );

      return outerCircle.shapeDifference( innerCircle );
    };

    const innerValve = new Path( createInnerCircle( MeanShareAndBalanceConstants.VALVE_RADIUS, MeanShareAndBalanceConstants.PIPE_WIDTH ),
      { fill: 'black', lineWidth: LINE_WIDTH } );
    const outerValve = new Path( createOuterCircle( MeanShareAndBalanceConstants.VALVE_RADIUS ),
      { fill: valveGradient, stroke: 'black', lineWidth: LINE_WIDTH } );

    // Inner pipe shows water color when pipe is opened.
    const innerPipe = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_WIDTH, MeanShareAndBalanceConstants.VALVE_RADIUS * 2, {
      center: innerValve.center
    } );

    super( {
      children: [ innerPipe, outerValve, innerValve ],
      cursor: 'pointer',
      x: parentCenter.x,
      y: parentCenter.y,

      // phet-io
      tandem: tandem.createTandem( 'valveNode' )
    } );

    rotationProperty.link( rotation => {
      this.rotation = rotation;
      innerPipe.fill = this.rotation >= ( Math.PI / 3 ) ? MeanShareAndBalanceColors.waterFillColorProperty : 'grey';
    } );
  }
}

meanShareAndBalance.register( 'ValveNode', ValveNode );