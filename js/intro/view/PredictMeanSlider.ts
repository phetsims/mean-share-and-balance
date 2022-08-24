// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line.
 * Users are able to manipulate line to predict what they believe the mean of water is across visible cups.
 * Extends AccessibleSlider for alternative input.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Image, Line, Node, NodeOptions, Pattern } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import WaterCup from '../model/WaterCup.js';
import Property from '../../../../axon/js/Property.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import pencil_png from '../../../images/pencil_png.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = AccessibleSliderOptions & NodeOptions;
type PredictMeanNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'pickable' | 'inputEnabled' | 'focusable' | 'cursor'>;

export default class PredictMeanSlider extends AccessibleSlider( Node, 0 ) {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Node;
  private readonly dragListener: DragListener;

  public constructor( meanPredictionProperty: Property<number>, dragRange: Range, numberOfCupsProperty: Property<number>,
                      getActive2DCups: () => Array<WaterCup>, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    const options = optionize<PredictMeanNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      focusable: true
    }, providedOptions );

    super( options );

    const linePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.975 ) );

    this.predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ),
      { lineWidth: 1.95, stroke: linePattern, lineDash: [ 5, 3 ] } );

    this.predictMeanHandle = new Image( pencil_png, { scale: 0.04, rotation: Math.PI / 4 } );

    // track predictMeanLine drag position
    const predictMeanPositionProperty = new Vector2Property( new Vector2( 0, meanPredictionProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      meanPredictionProperty.value = dragRange.constrainValue( predictMeanPosition.y );
    } );

    meanPredictionProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );

    this.dragListener = new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,
      tandem: options.tandem.createTandem( 'dragListener' )
    } );

    this.addInputListener( this.dragListener );

    // Update line length and dilation based on water cups
    numberOfCupsProperty.link( numberOfCups => {
      const active2DCups = getActive2DCups();
      const waterCup2D = active2DCups[ active2DCups.length - 1 ];
      this.updateLine( waterCup2D.position.x + 80 );
    } );

    this.setPointerAreas();
    this.addChild( this.predictMeanLine );
    this.addChild( this.predictMeanHandle );
    this.centerY = modelViewTransform.modelToViewY( 0 );
  }

  private setPointerAreas(): void {
    this.predictMeanLine.mouseArea = this.predictMeanLine.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanLine.touchArea = this.predictMeanLine.mouseArea;
    this.predictMeanHandle.mouseArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.MOUSE_AREA_DILATION );
    this.predictMeanHandle.touchArea = this.predictMeanHandle.localBounds.dilated( MeanShareAndBalanceConstants.TOUCH_AREA_DILATION );
  }

  private updateLine( lineEnd: number ): void {
    this.predictMeanLine.x2 = lineEnd;
    this.predictMeanHandle.leftCenter = this.predictMeanLine.rightCenter;
    this.setPointerAreas();
  }
}

meanShareAndBalance.register( 'PredictMeanSlider', PredictMeanSlider );