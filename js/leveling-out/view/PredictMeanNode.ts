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
import LevelingOutModel from '../model/LevelingOutModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {};
type PredictMeanNodeOptions = SelfOptions & AccessibleSliderOptions & Omit<NodeOptions, 'pickable' | 'inputEnabled'>

export default class PredictMeanNode extends AccessibleSlider( Node, 0 ) {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Circle;
  private readonly model: LevelingOutModel;
  private readonly dragListener: DragListener;

  constructor( model: LevelingOutModel, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    const options = optionize<PredictMeanNodeOptions, SelfOptions, AccessibleSliderOptions>()( {
      cursor: 'pointer',
      focusable: true
    }, providedOptions );

    super( options );

    this.model = model;

    this.predictMeanLine = new Line( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH + 25, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );
    this.predictMeanHandle = new Circle( 5, { center: this.predictMeanLine.localBounds.rightCenter, fill: 'purple' } );

    // track predictMeanLine drag position
    const predictMeanPositionProperty = new Vector2Property( new Vector2( 0, model.meanPredictionProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      model.meanPredictionProperty.value = model.dragRange.constrainValue( predictMeanPosition.y );
    } );

    model.meanPredictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.dragListener = new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'predictMeanDragListener' )
    } );

    this.addInputListener( this.dragListener );

    // Update line length and dilation based on water cups
    model.waterCup2DGroup.elementCreatedEmitter.addListener( waterCup2D => {
      this.updateLine( waterCup2D.xProperty.value + 75 );
    } );

    model.waterCup2DGroup.elementDisposedEmitter.addListener( waterCup2D => {
      this.updateLine( waterCup2D.xProperty.value - 25 );
    } );

    this.setPointerAreas();
    this.addChild( this.predictMeanLine );
    this.addChild( this.predictMeanHandle );
    this.centerY = modelViewTransform.modelToViewY( 0 );
  }

  private setPointerAreas(): void {
    this.predictMeanLine.mouseArea = this.predictMeanLine.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_DILATION );
    this.predictMeanLine.touchArea = this.predictMeanLine.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_DILATION );
    this.predictMeanHandle.mouseArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_DILATION );
    this.predictMeanHandle.touchArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_DILATION );
  }

  private updateLine( lineEnd: number ): void {
    this.predictMeanLine.x2 = lineEnd;
    this.predictMeanHandle.center = this.predictMeanLine.bounds.rightCenter;
    this.setPointerAreas();
  }
}

meanShareAndBalance.register( 'PredictMeanNode', PredictMeanNode );