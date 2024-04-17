// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the draggable predict mean line.
 * Users are able to manipulate line to predict what they believe the mean of water is across visible cups.
 * Extends AccessibleSlider for alternative input.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { DragListener, Image, Line, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Cup from '../model/Cup.js';
import Property from '../../../../axon/js/Property.js';
import pencil_png from '../../../images/pencil_png.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import ShredUtils from '../../../../shred/js/Utils.js'; // eslint-disable-line default-import-match-filename
import Utils from '../../../../dot/js/Utils.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

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

  public constructor( meanPredictionProperty: Property<number>, dragRange: Range, numberOfCupsProperty: Property<number>,
                      arePipesOpenProperty: Property<boolean>, meanValueProperty: TReadOnlyProperty<number>,
                      doWaterLevelsMatchMeanProperty: TReadOnlyProperty<boolean>,
                      getActiveNotepadCups: () => Array<Cup>, modelViewTransform: ModelViewTransform2,
                      providedOptions: PredictMeanNodeOptions ) {

    const options = providedOptions;

    const predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ), {
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN_WIDTH,
      stroke: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN,
      lineDash: [ 5, 3 ]
    } );

    const predictMeanHandle = new Image( pencil_png, { scale: 0.04, rotation: Math.PI / 4 } );

    const predictMeanSuccessRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 10, {
      fill: MeanShareAndBalanceColors.predictMeanSuccessFillProperty,
      opacity: 0.5,
      cornerRadius: 2,
      visible: false,
      centerY: predictMeanLine.centerY
    } );

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

    Multilink.multilink( [ arePipesOpenProperty, meanPredictionProperty, meanValueProperty, doWaterLevelsMatchMeanProperty ],
      ( arePipesOpen, meanPrediction, meanValue, doWaterLevelsMatchMean ) => {
        const meanTolerance = 0.05;
        const roundedPrediction = Utils.roundToInterval( meanPrediction, 0.01 );
        const roundedMean = Utils.roundToInterval( meanValue, 0.01 );
        const closeToMean = ShredUtils.roughlyEqual( roundedPrediction, roundedMean, meanTolerance );

        if ( arePipesOpen && doWaterLevelsMatchMean && roundedPrediction === roundedMean ) {
          predictMeanLine.stroke = MeanShareAndBalanceColors.meanColorProperty;
          predictMeanSuccessRectangle.visible = false;
        }
        else {
          predictMeanSuccessRectangle.visible = arePipesOpen && doWaterLevelsMatchMean && closeToMean;
          predictMeanLine.stroke = MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN;
        }

      } );

    this.addInputListener( dragListener );

    this.predictMeanLine = predictMeanLine;
    this.predictMeanHandle = predictMeanHandle;
    this.predictMeanGlow = predictMeanSuccessRectangle;

    // Update line length and dilation based on water cups.
    numberOfCupsProperty.link( () => {
      const activeNotepadCups = getActiveNotepadCups();
      const notepadCup = activeNotepadCups[ activeNotepadCups.length - 1 ];
      this.updateLine( notepadCup.position.x + 80 );
    } );

    this.setPointerAreas();
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
    this.predictMeanGlow.setRectWidth( lineEnd - this.predictMeanGlow.x );
    this.predictMeanHandle.leftCenter = this.predictMeanLine.rightCenter;
    this.setPointerAreas();
  }
}

meanShareAndBalance.register( 'PredictMeanSlider', PredictMeanSlider );