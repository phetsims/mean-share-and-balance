// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import LevelingOutModel from '../model/LevelingOutModel.js';

type SelfOptions = {};
type PredictMeanNodeOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty'>

class PredictMeanNode extends Node {
  constructor( model: LevelingOutModel, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    // TODO: User cursor: 'pointer' to show a hand so the user knows it is interactive
    super( providedOptions );

    const predictMeanLine = new Line( 50, 0, 300, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );

    const predictMeanPositionProperty = new Vector2Property( modelViewTransform.modelToViewXY( 0, model.predictionProperty.value ) );

    predictMeanPositionProperty.link( predictMeanPosition => {
      model.predictionProperty.value = model.dragRange.constrainValue( predictMeanPosition.y );
    } );

    model.predictionProperty.link( prediction => {
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