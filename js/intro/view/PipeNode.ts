// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D pipe and valve between each water cup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { FireListener, InteractiveHighlighting, Line, Node, NodeOptions, Pattern, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Pipe from '../model/Pipe.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ValveNode from './ValveNode.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

type SelfOptions = EmptySelfOptions;
type PipeNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'phetioDynamicElement' | 'children' | 'visibleProperty'> & PickRequired<NodeOptions, 'tandem'>;

const LINE_WIDTH = 1;

export default class PipeNode extends InteractiveHighlighting( Node ) {

  // Public for traversal order
  public readonly valveNode: ValveNode;

  public constructor( pipe: Pipe, arePipesOpenProperty: Property<boolean>, modelViewTransform: ModelViewTransform2, providedOptions: PipeNodeOptions ) {
    const options = providedOptions;

    // Pipe & valve dimensions
    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, MeanShareAndBalanceConstants.PIPE_WIDTH / 2 );
    const pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH,
      { fill: MeanShareAndBalanceConstants.PIPE_GRADIENT } );

    const horizontalStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.9 ) );
    const leftStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15 * Math.cos( Math.PI / 2 ), -0.15 * Math.sin( Math.PI / 2 ), 0.975,
      0.15 * Math.sin( Math.PI / 2 ), 0.15 * Math.cos( Math.PI / 2 ), 0 ) );
    const rightStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15 * Math.cos( Math.PI / 2 ), -0.15 * Math.sin( Math.PI / 2 ), 0,
      0.15 * Math.sin( Math.PI / 2 ), 0.15 * Math.cos( Math.PI / 2 ), 0 ) );

    const pipeStrokeLeft = new Line( 0, 0, 0, MeanShareAndBalanceConstants.PIPE_WIDTH, { lineWidth: 1.95, stroke: leftStrokePattern } );
    const pipeStrokeRight = new Line( MeanShareAndBalanceConstants.PIPE_LENGTH, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH, {
      lineWidth: 1.95,
      stroke: rightStrokePattern
    } );
    const pipeStrokeTop = new Line( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, 0, {
      lineWidth: 1.95,
      stroke: horizontalStrokePattern
    } );
    const pipeStrokeBottom = new Line( 0, MeanShareAndBalanceConstants.PIPE_WIDTH, MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH, {
      lineWidth: 1.95,
      stroke: horizontalStrokePattern
    } );


    // Function to create pipe clip area when valve is closed
    const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
      const clipAreaRectangle = Shape.bounds( bounds );
      const clipAreaCircle = Shape.circle( new Vector2( bounds.centerX, bounds.centerY ), radius );
      return clipAreaRectangle.shapeDifference( clipAreaCircle );
    };

    pipeRectangle.clipArea = createPipeClipArea( pipeRectangle.localBounds, MeanShareAndBalanceConstants.VALVE_RADIUS );

    const valveNode = new ValveNode( pipeCenter, pipe.rotationProperty, options.tandem );

    // Set pointer areas for valveNode
    valveNode.mouseArea = valveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    valveNode.touchArea = valveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );

    const handleFire = () => {
      arePipesOpenProperty.set( !pipe.arePipesOpenProperty.value );

      pipe.isCurrentlyClickedProperty.set( true );
      pipe.isCurrentlyClickedProperty.set( false );
    };

    // Valve rotation event listener
    const valveRotationFireListener = new FireListener( {
      fire: () => {
        handleFire();
      },

      // phet-io
      tandem: options.tandem.createTandem( 'valveRotationFireListener' )
    } );
    valveNode.addInputListener( valveRotationFireListener );

    const combinedOptions = combineOptions<NodeOptions>( {
      visibleProperty: pipe.isActiveProperty,
      children: [ pipeRectangle, pipeStrokeLeft, pipeStrokeBottom, pipeStrokeTop, pipeStrokeRight, valveNode ]
    }, options );
    super( combinedOptions );

    this.valveNode = valveNode;
    // Set position related to associated cup
    this.x = pipe.position.x + MeanShareAndBalanceConstants.CUP_WIDTH + LINE_WIDTH;
    this.y = modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.PIPE_WIDTH;

    // pdom - add to traversal order and add a listener so that it responds to clicks from assistive technology.
    this.tagName = 'button';
    this.addInputListener( {
      click: () => handleFire()
    } );

    // interactive highlighting - set a custom highlight because the pipe nodes have a unique combined highlight
    // collectively in the ScreenView
    this.interactiveHighlight = Shape.bounds( this.localBounds );
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );