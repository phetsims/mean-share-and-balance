// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line.
 * Users are able to manipulate line to predict what they believe the mean is across visible objects.
 * Extends AccessibleSlider for alternative input.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Image, Line, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import pencil_png from '../../../images/pencil_png.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = AccessibleSliderOptions & NodeOptions;
type PredictMeanNodeOptions =
  SelfOptions
  & StrictOmit<ParentOptions, 'pickable' | 'inputEnabled' | 'focusable' | 'cursor' | 'children'>
  & PickRequired<ParentOptions, 'tandem'>;

export default class PredictMeanSlider extends AccessibleSlider( Node, 0 ) {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Node;
  private readonly predictMeanGlow: Rectangle;

  public constructor( meanPredictionProperty: Property<number>, dragRange: Range,
                      createSuccessIndicatorMultilink: ( predictMeanLine: Path, successRectangle: Node ) => void,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: PredictMeanNodeOptions ) {

    const options = providedOptions;

    const predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ), {
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN_WIDTH,
      stroke: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN,
      lineDash: [ 5, 3 ]
    } );

    const predictMeanHandle = new Image( pencil_png, { scale: 0.04, rotation: Math.PI / 4 } );

    // Create elements that indicate a successful prediction of the mean.
    const predictMeanSuccessRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 10, {
      fill: MeanShareAndBalanceColors.predictMeanSuccessFillProperty,
      opacity: 0.5,
      cornerRadius: 2,
      visible: false,
      centerY: predictMeanLine.centerY
    } );
    createSuccessIndicatorMultilink( predictMeanLine, predictMeanSuccessRectangle );

    // track predictMeanLine drag position
    const predictMeanPositionProperty = new Vector2Property( new Vector2( 0, meanPredictionProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      meanPredictionProperty.value = dragRange.constrainValue( predictMeanPosition.y );
    } );

    const dragListener = new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,

      // phet-io
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    const combinedOptions = combineOptions<ParentOptions>( {
      children: [ predictMeanSuccessRectangle, predictMeanLine, predictMeanHandle ],
      cursor: 'ns-resize'
    }, options );
    super( combinedOptions );


    meanPredictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.addInputListener( dragListener );
    this.predictMeanLine = predictMeanLine;
    this.predictMeanHandle = predictMeanHandle;
    this.predictMeanGlow = predictMeanSuccessRectangle;

    this.setPointerAreas();
    this.centerY = modelViewTransform.modelToViewY( 0 );
    this.centerX = modelViewTransform.modelToViewX( 0 );
  }

  private setPointerAreas(): void {
    this.predictMeanLine.mouseArea = this.predictMeanLine.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanLine.touchArea = this.predictMeanLine.mouseArea;
    this.predictMeanHandle.mouseArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanHandle.touchArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }

  public updateLine( lineStart: number, lineEnd: number ): void {
    this.predictMeanLine.x1 = lineStart;
    this.predictMeanLine.x2 = lineEnd;
    this.predictMeanGlow.setRectX( lineStart );
    this.predictMeanGlow.setRectWidth( lineEnd - lineStart );
    this.predictMeanHandle.leftCenter = this.predictMeanLine.rightCenter;
    this.setPointerAreas();
  }
}

meanShareAndBalance.register( 'PredictMeanSlider', PredictMeanSlider );