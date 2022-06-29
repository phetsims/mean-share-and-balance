// Copyright 2022, University of Colorado Boulder

//REVIEW It would be advantageous to factor ValueNode out as a separate class.
/**
 * Representation for the 2D pipe and valve between each water cup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import { FireListener, Node, LinearGradient, NodeOptions, Path, Rectangle, RadialGradient } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from '../model/PipeModel.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptyObjectType;

type PipeNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'phetioDynamicElement'>;

const VALVE_RADIUS = 8;
const PIPE_WIDTH = 4;
const HANDLE_HEIGHT = 10;
const HANDLE_WIDTH = 4;

export default class PipeNode extends Node {
  private readonly pipeModel: PipeModel;
  private readonly valveRotationFireListener: FireListener;
  private readonly handleGrip: Path;
  private readonly valveNode: Node;
  private readonly pipeRectangle: Rectangle;
  private readonly innerValve: Path;
  private readonly outerValve: Path;
  private readonly innerPipe: Rectangle;
  private readonly handleBase: Rectangle;

  public constructor( pipeModel: PipeModel, modelViewTransform: ModelViewTransform2, isAutoSharingProperty: BooleanProperty, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.pipeModel = pipeModel;

    // Pipe & valve dimensions
    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, PIPE_WIDTH / 2 );
    const pipeGradient = new LinearGradient( 0, 0, 0, PIPE_WIDTH )
      .addColorStop( 0, MeanShareAndBalanceColors.pipeGradientLightColorProperty )
      .addColorStop( 1, MeanShareAndBalanceColors.pipeGradientDarkColorProperty );
    this.pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, PIPE_WIDTH,
      { stroke: 'black', fill: pipeGradient } );

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

    // Function to create pipe clip area when valve is closed
    const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
      const clipAreaRectangle = Shape.bounds( bounds );
      const clipAreaCircle = Shape.circle( bounds.center, radius );
      return clipAreaRectangle.shapeDifference( clipAreaCircle );
    };


    // Valve drawing
    const valveGradient = new RadialGradient( 0, 0, 0, 0, 0, VALVE_RADIUS + 2 )
      .addColorStop( 0.5, MeanShareAndBalanceColors.pipeGradientLightColorProperty )
      .addColorStop( 1, MeanShareAndBalanceColors.pipeGradientDarkColorProperty );

    this.innerValve = new Path( createInnerCircle( VALVE_RADIUS, PIPE_WIDTH ),
      { fill: 'black' } );
    this.outerValve = new Path( createOuterCircle( VALVE_RADIUS ), { fill: valveGradient, stroke: 'black' } );

    // Inner pipe shows water color when pipe is opened.
    this.innerPipe = new Rectangle( 0, 0, PIPE_WIDTH, VALVE_RADIUS * 2, {
      fill: null,
      center: this.innerValve.center
    } );

    const handleGripGradient = new LinearGradient( -2, -2, 8, 0 )
      .addColorStop( 0, MeanShareAndBalanceColors.handleGradientLightColorProperty )
      .addColorStop( 0.4, MeanShareAndBalanceColors.handleGradientDarkColorProperty );

    this.handleBase = new Rectangle( 0, 0, HANDLE_WIDTH, 3, {
      fill: pipeGradient,
      stroke: 'black',
      y: this.outerValve.top - 3,
      x: this.innerValve.centerX - HANDLE_WIDTH / 2
    } );

    const handleShape = new Shape()
      .moveTo( -2, 0 )
      .lineTo( -4, -HANDLE_HEIGHT )
      .ellipticalArc( 0, -HANDLE_HEIGHT, 4, 3, 0, Math.PI, 0, false )
      .lineTo( 2, 0 )
      .close();

    this.handleGrip = new Path( handleShape, {
      fill: handleGripGradient,
      stroke: 'black',
      y: this.handleBase.top + 1
    } );

    // TODO: Sam please help me understand coordinate frames. The difference between setting center & x,y
    this.valveNode = new Node( {
      children: [ this.handleBase, this.handleGrip, this.innerPipe, this.outerValve, this.innerValve ],
      cursor: 'pointer',
      tandem: options.tandem?.createTandem( 'valveNode' ),
      tagName: 'button',
      y: pipeCenter.y,
      x: pipeCenter.x
    } );

    this.pipeRectangle.clipArea = createPipeClipArea( this.pipeRectangle.localBounds, VALVE_RADIUS );

    // Set pointer areas for valveNode
    this.valveNode.mouseArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.valveNode.touchArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );

    // Valve rotation event listener
    this.valveRotationFireListener = new FireListener( {
      fire: () => {
        pipeModel.isOpenProperty.set( !pipeModel.isOpenProperty.value );

        // When a user checks auto-share it should open all the pipes, when a user unchecks auto-share
        // it closes all the pipes, but when a user opens a pipe and auto-share is checked
        // only the clicked pipe should close and auto-share unchecks.
        pipeModel.isCurrentlyClickedProperty.set( true );
        isAutoSharingProperty.set( false );
        pipeModel.isCurrentlyClickedProperty.set( false );
      },
      tandem: options.tandem.createTandem( 'valveRotationFireListener' )
    } );
    this.valveNode.addInputListener( this.valveRotationFireListener );

    // Sets pipe rotation to open if "Auto Share" is enabled.
    // This prevents the valve node from rotating on entrance and continuously rotating in
    // the state wrapper.
    if ( isAutoSharingProperty.value ) {
      this.valveNode.rotation = Math.PI / 2;
    }

    this.addChild( this.pipeRectangle );
    this.addChild( this.valveNode );

    // Set position related to associated cup
    this.x = pipeModel.x + MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_STROKE_WIDTH / 2;
    this.y = modelViewTransform.modelToViewY( 0 ) - PIPE_WIDTH;
  }

  // Valve animation
  public step( dt: number ): void {
    const currentRotation = this.valveNode.rotation;
    const targetRotation = this.pipeModel.isOpenProperty.value ? Math.PI / 2 : 0;
    const delta = targetRotation - currentRotation;
    const rotationThreshold = Math.abs( this.valveNode.rotation - targetRotation ) * 0.4;
    const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    this.valveNode.rotation = rotationThreshold <= dt ? targetRotation : proposedRotation;

    this.innerPipe.fill = this.valveNode.rotation >= ( Math.PI / 3 ) ? MeanShareAndBalanceColors.waterFillColorProperty : null;
  }

  public override dispose(): void {
    super.dispose();
    this.valveRotationFireListener.dispose();
    this.valveNode.dispose();
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );