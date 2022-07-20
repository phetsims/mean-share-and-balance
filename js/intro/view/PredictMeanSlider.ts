// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line.
 * Users are able to manipulate line to predict what they believe the mean of water is across visible cups.
 * Extends AccessibleSlider for alternative input.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Circle, DragListener, Line, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import WaterCup from '../model/WaterCup.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = AccessibleSliderOptions & NodeOptions;
type PredictMeanNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'pickable' | 'inputEnabled' | 'focusable' | 'cursor'>;

export default class PredictMeanSlider extends AccessibleSlider( Node, 0 ) {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Circle;
  private readonly dragListener: DragListener;

  public constructor( meanPredictionProperty: NumberProperty, dragRange: Range, numberOfCupsProperty: NumberProperty,
                      getActive2DCups: () => Array<WaterCup>, modelViewTransform: ModelViewTransform2, providedOptions: PredictMeanNodeOptions ) {

    const options = optionize<PredictMeanNodeOptions, SelfOptions, ParentOptions>()( {
      cursor: 'pointer',
      focusable: true
    }, providedOptions );

    super( options );

    this.predictMeanLine = new Line( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH + 25, 0, {
      stroke: 'purple',
      lineWidth: 2
    } );
    this.predictMeanHandle = new ShadedSphereNode( 20, { center: this.predictMeanLine.localBounds.rightCenter, mainColor: 'purple' } );

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
      this.updateLine( waterCup2D.position.x + 75 );
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
    this.predictMeanHandle.center = this.predictMeanLine.bounds.rightCenter;
    this.setPointerAreas();
  }
}

meanShareAndBalance.register( 'PredictMeanSlider', PredictMeanSlider );