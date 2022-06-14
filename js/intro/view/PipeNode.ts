// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { FireListener, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PipeModel from '../model/PipeModel.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {};

type PipeNodeOptions = SelfOptions & NodeOptions;

// const VALVE_RADIUS = 10;

export default class PipeNode extends Node {
  private readonly pipeModel: PipeModel;
  private readonly valveRotationFireListener: FireListener;

  private readonly handle: Rectangle;
  private readonly handleTop: Rectangle;
  private readonly screw: Rectangle;
  private readonly newValveNode: Node;
  private readonly pipeRectangle: Rectangle;
  private readonly pipeFittingTop: Rectangle;
  private readonly pipeFittingBottom: Rectangle;

  public constructor( pipeModel: PipeModel, modelViewTransform: ModelViewTransform2, isAutoSharingProperty: BooleanProperty, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      phetioDynamicElement: true
    }, providedOptions );

    super( options );

    this.pipeModel = pipeModel;

    // Pipe & valve dimensions
    const pipeWidth = 3;
    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, pipeWidth / 2 );

    this.pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, pipeWidth,
      { stroke: 'black', fill: MeanShareAndBalanceColors.waterFillColorProperty } );

    // Function to create pipe clip area when valve is closed
    // const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
    //   const clipAreaRectangle = Shape.bounds( bounds );
    //   const clipAreaCircle = Shape.circle( bounds.center, radius );
    //   return clipAreaRectangle.shapeDifference( clipAreaCircle );
    // };

    // new valve attempt
    this.handle = new Rectangle( 0, 0, 30, 6, {
      fill: 'red',
      cornerRadius: 5,
      stroke: 'black'
    } );
    this.screw = new Rectangle( 0, 0, 6, 20, {
      fill: 'grey',
      centerX: this.handle.centerX,
      y: this.handle.y,
      stroke: 'black'
    } );
    this.handleTop = new Rectangle( 0, 0, 10, 5, {
      fill: 'DarkRed',
      stroke: 'black',
      centerX: this.handle.centerX,
      y: this.handle.y - 3,
      cornerRadius: 2
    } );

    this.pipeFittingTop = new Rectangle( 0, 0, 10, 3, {
      fill: 'DarkRed',
      cornerRadius: 2,
      bottom: this.pipeRectangle.top + 1,
      centerX: this.pipeRectangle.centerX,
      stroke: 'black'
    } );

    this.pipeFittingBottom = new Rectangle( 0, 0, 10, 3, {
      fill: 'DarkRed',
      cornerRadius: 2,
      top: this.pipeRectangle.bottom - 1,
      centerX: this.pipeRectangle.centerX,
      stroke: 'black'
    } );

    this.newValveNode = new Node( {
      children: [ this.screw, this.handleTop, this.handle ],
      cursor: 'pointer',
      centerX: pipeCenter.x,
      bottom: this.pipeRectangle.bottom + 5
    } );
    // this.valveNode.center = pipeCenter;

    // const pipeClipArea = createPipeClipArea( pipeRectangle.localBounds, VALVE_RADIUS );
    // pipeRectangle.clipArea = pipeClipArea;

    // Set pointer areas for valveNode
    this.newValveNode.mouseArea = this.newValveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_DILATION );
    this.newValveNode.touchArea = this.newValveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_DILATION );

    // Valve rotation event listener
    this.valveRotationFireListener = new FireListener( {
      fire: () => {
        pipeModel.isOpenProperty.set( !pipeModel.isOpenProperty.value );

        // REVIEW: Is the comment about re-entrance about the isCurrentlyClickedProperty?  If so, maybe it should be documented
        // at that declaration?
        // This does not support re-entrance.
        // When a user checks auto-share it should open all the pipes, when a user unchecks auto-share
        // it closes all the pipes, but when a user opens a pipe and auto-share is checked
        // only the clicked pipe should close and auto-share unchecks.
        pipeModel.isCurrentlyClickedProperty.set( true );
        isAutoSharingProperty.set( false );
        pipeModel.isCurrentlyClickedProperty.set( false );
      },
      tandem: options.tandem.createTandem( 'fireListener' )
    } );
    this.newValveNode.addInputListener( this.valveRotationFireListener );

    // Sets pipe rotation to open if "Auto Share" is enabled.
    // This prevents the valve node from rotating on entrance and continously rotating in
    // the state wrapper.
    if ( isAutoSharingProperty.value ) {
      // this.valveNode.rotation = Math.PI / 2;
    }

    // Linking to isOpenProperty to enable/disable pipe clip area
    pipeModel.isOpenProperty.link( isOpen => {
      if ( isOpen ) {
        this.pipeRectangle.clipArea = null;
      }
      else {
        // pipeRectangle.clipArea = pipeClipArea;
      }
    } );


    this.addChild( this.pipeRectangle );
    this.addChild( this.newValveNode );
    this.addChild( this.pipeFittingBottom );
    this.addChild( this.pipeFittingTop );

    this.addChild( this.handleTop );
    this.addChild( this.screw );
    // this.addChild( this.screwBottom );
    this.addChild( this.handle );
    this.addChild( this.newValveNode );

    // Set position related to associated cup
    this.x = pipeModel.x + MeanShareAndBalanceConstants.CUP_WIDTH;
    this.y = modelViewTransform.modelToViewY( 0 ) - pipeWidth;
  }

  // Valve animation
  private stepRotation( dt: number, isOpen: boolean ): void {
    // const currentRotation = this.valveNode.rotation;
    // const targetRotation = isOpen ? Math.PI / 2 : 0;
    // const delta = targetRotation - currentRotation;
    // const rotationThreshold = Math.abs( this.valveNode.rotation - targetRotation ) * 0.4;
    // const proposedRotation = currentRotation + Math.sign( delta ) * dt * 3;
    // this.valveNode.rotation = rotationThreshold <= dt ? targetRotation : proposedRotation;
    const currentBottom = this.newValveNode.bottom;
    const targetBottom = isOpen ? this.pipeRectangle.top : this.pipeRectangle.bottom + 5;
    const delta = targetBottom - currentBottom;
    const bottomThreshold = Math.abs( this.newValveNode.bottom - targetBottom ) * 0.4;
    const proposedBottom = currentBottom + Math.sign( delta ) * dt * 20;
    this.newValveNode.bottom = bottomThreshold <= dt ? targetBottom : proposedBottom;
  }

  public step( dt: number ): void {
    this.stepRotation( dt, this.pipeModel.isOpenProperty.value );
  }

  public override dispose(): void {
    super.dispose();
    this.valveRotationFireListener.dispose();
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );