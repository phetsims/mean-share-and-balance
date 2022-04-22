// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Circle, DragListener, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};
type PredictMeanNodeOptions = SelfOptions & PickRequired<NodeOptions,
  'visibleProperty' | 'tandem'>

class PredictMeanNode extends Node {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Circle;

  constructor( model: LevelingOutModel, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    const options = optionize<SelfOptions, PredictMeanNodeOptions, NodeOptions>()( {
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    const dilation = 10;

    //TODO pass in cup width
    this.predictMeanLine = new Line( 0, 0, 75, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );

    this.predictMeanLine.mouseArea = this.predictMeanLine.bounds.dilated( dilation );
    this.predictMeanLine.touchArea = this.predictMeanLine.bounds.dilated( dilation );

    this.predictMeanHandle = new Circle( 5, { center: this.predictMeanLine.bounds.rightCenter, fill: 'purple' } );
    this.predictMeanHandle.mouseArea = this.predictMeanLine.bounds.dilated( dilation );
    this.predictMeanHandle.touchArea = this.predictMeanLine.bounds.dilated( dilation );

    // track predictMeanLine drag position
    const predictMeanPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( 0, model.meanPredictionProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      model.meanPredictionProperty.value = model.dragRange.constrainValue( predictMeanPosition.y );
    } );

    model.meanPredictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'predictMeanDragListener' )
    } ) );

    // Update line length and dilation based on water cups
    model.waterCups.addItemAddedListener( waterCup => {
      this.updateLine( waterCup.xProperty.value + 75, dilation );
    } );

    model.waterCups.addItemRemovedListener( waterCup => {
      this.updateLine( waterCup.xProperty.value - 25, dilation );
    } );

    this.addChild( this.predictMeanLine );
    this.addChild( this.predictMeanHandle );
    this.bottom = modelViewTransform.modelToViewY( 0 );
  }

  private updateLine( lineEnd: number, dilation: number ): void {
    this.predictMeanLine.x2 = lineEnd;
    this.predictMeanLine.mouseArea = this.predictMeanLine.bounds.dilated( dilation );
    this.predictMeanLine.touchArea = this.predictMeanLine.bounds.dilated( dilation );

    this.predictMeanHandle.center = this.predictMeanLine.bounds.rightCenter;
    this.predictMeanHandle.mouseArea = this.predictMeanLine.bounds.dilated( dilation );
    this.predictMeanHandle.touchArea = this.predictMeanLine.bounds.dilated( dilation );
  }

}

meanShareAndBalance.register( 'PredictMeanNode', PredictMeanNode );
export default PredictMeanNode;