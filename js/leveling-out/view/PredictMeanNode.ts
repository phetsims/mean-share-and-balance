// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Line, Node } from '../../../../scenery/js/imports.js';
import LevelingOutScreenView from './LevelingOutScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

class PredictMeanNode extends Node {
  constructor( parentNode: LevelingOutScreenView, modelViewTransform: ModelViewTransform2 ) {
    super();
    const predictMeanLine = new Line( 50, 0, 300, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );

    const predictMeanPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( 0, parentNode.model.predictionProperty.value ) );

    predictMeanPositionProperty.link( predictMeanPosition => {
      parentNode.model.predictionProperty.value = parentNode.model.dragRange.constrainValue( predictMeanPosition.y );
    } );

    parentNode.model.predictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.addInputListener( new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform
    } ) );

    this.addChild( predictMeanLine );
    this.bottom = modelViewTransform.modelToViewY( 0 );
  }

}

meanShareAndBalance.register( 'PredictMeanNode', PredictMeanNode );
export default PredictMeanNode;