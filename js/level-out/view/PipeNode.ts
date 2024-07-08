// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the notepad pipe and valve between each water cup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { FireListener, InteractiveHighlighting, Line, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Pipe from '../model/Pipe.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { Shape } from '../../../../kite/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ValveNode from './ValveNode.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

type SelfOptions = EmptySelfOptions;
type PipeNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'phetioDynamicElement' | 'children' | 'visibleProperty'> & PickRequired<NodeOptions, 'tandem'>;

const LINE_WIDTH = 1;

export default class PipeNode extends InteractiveHighlighting( Node ) {

  // Public for traversal order
  public readonly valveNode: ValveNode;

  public constructor( pipe: Pipe, pipesOpenProperty: Property<boolean>, pipesEnabledProperty: Property<boolean>,
                      notepadMVT: ModelViewTransform2, providedOptions: PipeNodeOptions ) {
    const options = optionize<PipeNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    const pipeCenter = new Vector2( MeanShareAndBalanceConstants.PIPE_LENGTH / 2, MeanShareAndBalanceConstants.PIPE_WIDTH / 2 );
    const pipeRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH,
      { fill: MeanShareAndBalanceConstants.PIPE_GRADIENT } );

    const pipeStrokeLeft = new Line( 0, 0, 0, MeanShareAndBalanceConstants.PIPE_WIDTH, {
      lineWidth: 1.95,
      stroke: MeanShareAndBalanceConstants.VERTICAL_SKETCH_LINE_PATTERN
    } );
    const pipeStrokeRight = new Line( MeanShareAndBalanceConstants.PIPE_LENGTH, 0,
      MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH, {
        lineWidth: 1.95,
        stroke: MeanShareAndBalanceConstants.VERTICAL_SKETCH_LINE_PATTERN
      } );
    const pipeStrokeTop = new Line( 0, 0, MeanShareAndBalanceConstants.PIPE_LENGTH, 0, {
      lineWidth: 1.95,
      stroke: MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN
    } );
    const pipeStrokeBottom = new Line( 0, MeanShareAndBalanceConstants.PIPE_WIDTH,
      MeanShareAndBalanceConstants.PIPE_LENGTH, MeanShareAndBalanceConstants.PIPE_WIDTH, {
        lineWidth: 1.95,
        stroke: MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN
      } );


    // Create the pipe clip area when valve is closed
    const createPipeClipArea = ( bounds: Bounds2, radius: number ): Shape => {
      const clipAreaRectangle = Shape.bounds( bounds );
      const clipAreaCircle = Shape.circle( new Vector2( bounds.centerX, bounds.centerY ), radius );
      return clipAreaRectangle.shapeDifference( clipAreaCircle );
    };

    pipeRectangle.clipArea = createPipeClipArea( pipeRectangle.localBounds, MeanShareAndBalanceConstants.VALVE_RADIUS );

    const valveNode = new ValveNode( pipeCenter, pipe.rotationProperty );

    // Set pointer areas for valveNode
    valveNode.mouseArea = valveNode.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    valveNode.touchArea = valveNode.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );

    const combinedOptions = combineOptions<NodeOptions>( {
      visibleProperty: pipe.isActiveProperty,
      enabledProperty: pipesEnabledProperty,
      children: [ pipeRectangle, pipeStrokeLeft, pipeStrokeBottom, pipeStrokeTop, pipeStrokeRight, valveNode ]
    }, options );
    super( combinedOptions );

    // Set position
    this.centerY = notepadMVT.modelToViewY( 0 ) - MeanShareAndBalanceConstants.PIPE_WIDTH / 2 - LINE_WIDTH;
    pipe.xPositionProperty.link( xPosition => {
      this.left = notepadMVT.transformX( xPosition );
    } );

    const handleFire = () => {
      pipesOpenProperty.set( !pipe.pipesOpenProperty.value );
      if ( pipe.pipesOpenProperty.value ) {
        this.accessibleName = MeanShareAndBalanceStrings.a11y.closePipeStringProperty;
      }
      else {
        this.accessibleName = MeanShareAndBalanceStrings.a11y.openPipeStringProperty;
      }
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

    // pdom - add to traversal order and add a listener so that it responds to clicks from assistive technology.
    this.tagName = 'button';
    this.accessibleName = MeanShareAndBalanceStrings.a11y.openPipeStringProperty;
    this.addInputListener( {
      click: () => handleFire()
    } );

    // interactive highlighting - set a custom highlight because the pipe nodes have a unique combined highlight
    // collectively in the ScreenView
    this.interactiveHighlight = Shape.bounds( this.localBounds );

    pipesEnabledProperty.link( enabled => {
      enabled ? this.opacity = 1 : this.opacity = 0.5;
    } );

    this.valveNode = valveNode;
  }
}

meanShareAndBalance.register( 'PipeNode', PipeNode );