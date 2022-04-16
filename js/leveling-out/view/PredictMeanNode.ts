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
  constructor( parentNode: LevelingOutScreenView ) {
    super();
    const predictMeanLine = new Line( 50, 225, 300, 225, {
      stroke: 'purple',
      lineWidth: 2
    } );
    const modelViewTransform = ModelViewTransform2.createIdentity();

    const predictMeanPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( parentNode.model.predictionProperty.value, 0 ) );

    predictMeanPositionProperty.link( predictMeanPosition => {
      parentNode.model.predictionProperty.value = predictMeanPosition.x;
    } );

    this.addInputListener( new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform
    } ) );

    this.addChild( predictMeanLine );
  }

}

meanShareAndBalance.register( 'PredictMeanNode', PredictMeanNode );
export default PredictMeanNode;