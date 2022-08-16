// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { FireListener, LinearGradient, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Pipe from '../model/Pipe.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ValveNode from './ValveNode.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type PipeNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'phetioDynamicElement'>;

const VALVE_RADIUS = 8;
const PIPE_WIDTH = 4;
const HANDLE_HEIGHT = 10;
const LINE_WIDTH = 1;

export default class PipeNode extends Node {
  private readonly pipe: Pipe;
  private readonly valveRotationFireListener: FireListener;
  private readonly pipeRectangle: Rectangle;
  private readonly valveNode: ValveNode;

  public constructor( pipe: Pipe, arePipesOpenProperty: Property<boolean>, modelViewTransform: ModelViewTransform2, providedOptions?: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      visibleProperty: pipe.isActiveProperty
    }, providedOptions );

    super( options );

    this.pipe = pipe;

    // Pipe & valve dimensions
    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, PIPE_WIDTH / 2 );
    const pipeGradient = new LinearGradient( 0, 0, 0, PIPE_WIDTH )
      .addColorStop( 0, MeanShareAndBalanceColors.pipeGradientLightColorProperty )
      .addColorStop( 1, MeanShareAndBalanceColors.pipeGradientDarkColorProperty );
    this.pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, PIPE_WIDTH,
      { stroke: 'black', fill: pipeGradient } );

    const outerValveDiameter = ( VALVE_RADIUS + 3 ) * 2;

    // Base valve centering off of valve's 'open' position.
    const valveCenterOffset = ( outerValveDiameter + HANDLE_HEIGHT - 3 ) / 2 - outerValveDiameter;

    // Function to create pipe clip area when valve is closed
    const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
      const clipAreaRectangle = Shape.bounds( bounds );
      const clipAreaCircle = Shape.circle( new Vector2( bounds.centerX + valveCenterOffset, bounds.centerY ), radius );
      return clipAreaRectangle.shapeDifference( clipAreaCircle );
    };

    this.pipeRectangle.clipArea = createPipeClipArea( this.pipeRectangle.localBounds, VALVE_RADIUS );

    this.valveNode = new ValveNode( pipeCenter, pipe.rotationProperty, valveCenterOffset, pipeGradient, options.tandem );

    // Set pointer areas for valveNode
    this.valveNode.mouseArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.valveNode.touchArea = this.valveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );

    // Valve rotation event listener
    this.valveRotationFireListener = new FireListener( {
      fire: () => {
        arePipesOpenProperty.set( !pipe.arePipesOpenProperty.value );

        pipe.isCurrentlyClickedProperty.set( true );
        pipe.isCurrentlyClickedProperty.set( false );
      },
      tandem: options.tandem.createTandem( 'valveRotationFireListener' )
    } );
    this.valveNode.addInputListener( this.valveRotationFireListener );

    this.addChild( this.pipeRectangle );
    this.addChild( this.valveNode );

    // Set position related to associated cup
    this.x = pipe.position.x + MeanShareAndBalanceConstants.CUP_WIDTH + LINE_WIDTH / 2;
    this.y = modelViewTransform.modelToViewY( 0 ) - PIPE_WIDTH;
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );