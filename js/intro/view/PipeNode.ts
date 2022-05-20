// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { FireListener, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from '../model/PipeModel.js';
import { Shape } from '../../../../kite/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = {};

type PipeNodeOptions = SelfOptions & NodeOptions;

export default class PipeNode extends Node {
  private readonly valveNode: Node;
  private readonly pipeModel: PipeModel;
  private readonly innerValve: Path;
  private readonly outerValve: Path;
  private readonly valveRotationFireListener: FireListener;

  constructor( pipeModel: PipeModel, modelViewTransform: ModelViewTransform2, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.pipeModel = pipeModel;

    // Pipe & valve dimensions
    const pipeWidth = 5;
    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, pipeWidth / 2 );
    const pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, pipeWidth,
      { stroke: 'black', fill: '#51CEF4' } );
    const valveRadius = 10;

    // Function to create circle with center rectangle cut out.
    const createCircle = ( radius: number, rectangleWidth: number ): Shape => {
      const circle = Shape.circle( radius );
      const rectangle = Shape.rectangle( -rectangleWidth / 2, -radius - 5, rectangleWidth, ( radius + 5 ) * 2 );
      return circle.shapeDifference( rectangle );
    };

    // Function to create pipe clip area when valve is closed
    const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
      const clipAreaRectangle = Shape.bounds( bounds );
      const clipAreaCircle = Shape.circle( bounds.center, radius );
      return clipAreaRectangle.shapeDifference( clipAreaCircle );
    };

    // Valve drawing
    this.innerValve = new Path( createCircle( valveRadius, pipeWidth + MeanShareAndBalanceConstants.PIPE_STROKE_WIDTH * 2 ),
      { fill: 'grey' } );
    this.outerValve = new Path( createCircle( valveRadius + MeanShareAndBalanceConstants.PIPE_STROKE_WIDTH, pipeWidth ),
      { fill: 'black' } );

    this.valveNode = new Node( {
      children: [ this.outerValve, this.innerValve ],
      cursor: 'pointer',
      tandem: options.tandem.createTandem( 'valveNode' ),
      tagName: 'button'
    } );
    this.valveNode.center = pipeCenter;

    const pipeClipArea = createPipeClipArea( pipeRectangle.localBounds, valveRadius );
    pipeRectangle.clipArea = pipeClipArea;

    // Set pointer areas for valveNode
    this.valveNode.mouseArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_DILATION );
    this.valveNode.touchArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_DILATION );

    // Valve rotation event listener
    this.valveRotationFireListener = new FireListener( {
      fire: () => {
        pipeModel.isOpenProperty.set( !pipeModel.isOpenProperty.value );
      },
      tandem: options.tandem.createTandem( 'fireListener' )
    } );
    this.valveNode.addInputListener( this.valveRotationFireListener );

    // Linking to isOpenProperty to enable/disable pipe clip area
    pipeModel.isOpenProperty.link( isOpen => {
      if ( isOpen ) {
        pipeRectangle.clipArea = null;
      }
      else {
        pipeRectangle.clipArea = pipeClipArea;
      }
    } );

    this.addChild( pipeRectangle );
    this.addChild( this.valveNode );

    // Set position related to associated cup
    this.x = pipeModel.xProperty.value + MeanShareAndBalanceConstants.CUP_WIDTH;
    this.y = modelViewTransform.modelToViewY( 0 ) - pipeWidth;
  }

  // Valve animation
  stepRotation( dt: number, isOpen: boolean ): void {
    const currentRotation = this.valveNode.rotation;
    const targetRotation = isOpen ? Math.PI / 2 : 0;
    const delta = targetRotation - currentRotation;
    const rotationThreshold = Math.abs( this.valveNode.rotation - targetRotation ) * 0.4;
    const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    this.valveNode.rotation = rotationThreshold <= dt ? targetRotation : proposedRotation;
  }

  step( dt: number ): void {
    this.stepRotation( dt, this.pipeModel.isOpenProperty.value );
  }

  override dispose(): void {
    super.dispose();
    this.valveNode.removeInputListener( this.valveRotationFireListener );
    this.valveRotationFireListener.dispose();
    this.valveNode.dispose();
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );