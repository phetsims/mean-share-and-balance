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
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {};
type PredictMeanNodeOptions = SelfOptions & PickRequired<NodeOptions, 'visibleProperty' | 'tandem'>

class PredictMeanNode extends Node {
  constructor( model: LevelingOutModel, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    const options = optionize<SelfOptions, PredictMeanNodeOptions, NodeOptions>()( {
      cursor: 'pointer'
    }, providedOptions );

    super( options );

    const predictMeanLine = new Line( 50, 0, 300, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );
    const dilation = 10;
    predictMeanLine.mouseArea = predictMeanLine.bounds.dilated( dilation );
    predictMeanLine.touchArea = predictMeanLine.bounds.dilated( dilation );

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

    this.addChild( predictMeanLine );
    this.bottom = modelViewTransform.modelToViewY( 0 );
  }

}

meanShareAndBalance.register( 'PredictMeanNode', PredictMeanNode );
export default PredictMeanNode;