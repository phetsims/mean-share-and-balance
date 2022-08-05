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
import { LinearGradient, Node, Path, RadialGradient, Rectangle } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

const HANDLE_WIDTH = 4;
const HANDLE_HEIGHT = 10;
const LINE_WIDTH = 1;
const PIPE_WIDTH = 4;
const VALVE_RADIUS = 8;

export default class ValveNode extends Node {
  private readonly isOpenProperty: Property<boolean>;
  private readonly innerPipe: Rectangle;
  public constructor( pipeCenter: Vector2, valveCenterOffset: number, pipeGradient: LinearGradient, isOpenProperty: Property<boolean>, tandem: Tandem ) {
    // Valve drawing
    const valveGradient = new RadialGradient( 0, 0, 0, 0, 0, VALVE_RADIUS + 2 )
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

    const innerValve = new Path( createInnerCircle( VALVE_RADIUS, PIPE_WIDTH ),
      { fill: 'black', lineWidth: LINE_WIDTH } );
    const outerValve = new Path( createOuterCircle( VALVE_RADIUS ),
      { fill: valveGradient, stroke: 'black', lineWidth: LINE_WIDTH } );

    // Inner pipe shows water color when pipe is opened.
    const innerPipe = new Rectangle( 0, 0, PIPE_WIDTH, VALVE_RADIUS * 2, {
      fill: null,
      center: innerValve.center
    } );

    const handleGripGradient = new LinearGradient( -2, -2, 8, 0 )
      .addColorStop( 0, MeanShareAndBalanceColors.handleGradientLightColorProperty )
      .addColorStop( 0.4, MeanShareAndBalanceColors.handleGradientDarkColorProperty );

    const handleBase = new Rectangle( 0, 0, HANDLE_WIDTH, 3, {
      fill: pipeGradient,
      stroke: 'black',
      lineWidth: LINE_WIDTH,
      y: outerValve.top - 3,
      x: innerValve.centerX - HANDLE_WIDTH / 2
    } );

    const handleShape = new Shape()
      .moveTo( -2, 0 )
      .lineTo( -4, -HANDLE_HEIGHT )
      .ellipticalArc( 0, -HANDLE_HEIGHT, 4, 3, 0, Math.PI, 0, false )
      .lineTo( 2, 0 )
      .close();

    const handleGrip = new Path( handleShape, {
      fill: handleGripGradient,
      stroke: 'black',
      lineWidth: LINE_WIDTH,
      y: handleBase.top + 1
    } );

    // TODO: Sam please help me understand coordinate frames. The difference between setting center & x,y
    super( {
      children: [ handleBase, handleGrip, innerPipe, outerValve, innerValve ],
      cursor: 'pointer',
      tagName: 'button',
      y: pipeCenter.y,
      x: pipeCenter.x + valveCenterOffset,
      tandem: tandem.createTandem( 'ValveNode' )
    } );

    this.isOpenProperty = isOpenProperty;
    this.innerPipe = innerPipe;
  }

  // Valve animation
  public step( dt: number ): void {

    // TODO: Maybe move this to the model?
    const currentRotation = this.rotation;
    const targetRotation = this.isOpenProperty.value ? Math.PI / 2 : 0;
    const delta = targetRotation - currentRotation;
    const rotationThreshold = Math.abs( this.rotation - targetRotation ) * 0.4;
    const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    this.rotation = rotationThreshold <= dt ? targetRotation : proposedRotation;

    this.innerPipe.fill = this.rotation >= ( Math.PI / 3 ) ? MeanShareAndBalanceColors.waterFillColorProperty : null;
  }
}

meanShareAndBalance.register( 'ValveNode', ValveNode );