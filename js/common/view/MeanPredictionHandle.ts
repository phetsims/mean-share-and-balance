// Copyright 2024, University of Colorado Boulder
/**
 * A pencil image creates the handle for the draggable "predict mean" line. The drag listener is defined and added in
 * this class as well.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import AccessibleSlider, { AccessibleSliderOptions } from '../../../../sun/js/accessibility/AccessibleSlider.js';
import { DragListener, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import pencil_png from '../../../images/pencil_png.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanPredictionChangeSoundGenerator from './MeanPredictionChangeSoundGenerator.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type ParentOptions = AccessibleSliderOptions & NodeOptions;
type MeanPredictionHandleOptions = StrictOmit<ParentOptions,
    'children' | 'pickable' | 'inputEnabled' | 'focusable' | 'cursor' | 'valueProperty' | 'enabledRangeProperty'>
  & PickRequired<ParentOptions, 'tandem'>;
export default class MeanPredictionHandle extends AccessibleSlider( Node, 0 ) {

  public constructor( valueProperty: Property<number>,
                      dragRange: Range,
                      modelViewTransform: ModelViewTransform2,
                      providedOptions: MeanPredictionHandleOptions ) {

    const predictMeanHandle = new Image( pencil_png, {
      scale: 0.04,
      rotation: Math.PI / 4
    } );

    // Track predictMeanLine drag position.  This needs to be a Vector2, and creates the linkage to the Y value.
    const predictMeanPositionProperty = new Vector2Property( new Vector2( 0, valueProperty.value ) );
    predictMeanPositionProperty.link( predictMeanPosition => {
      valueProperty.value = dragRange.constrainValue( predictMeanPosition.y );
    } );

    const dragListener = new DragListener( {
      positionProperty: predictMeanPositionProperty,
      transform: modelViewTransform,
      useParentOffset: true,
      tandem: providedOptions.tandem.createTandem( 'dragListener' )
    } );

    const combinedOptions = optionize<MeanPredictionHandleOptions, EmptySelfOptions, ParentOptions>()( {
      children: [ predictMeanHandle ],
      cursor: 'ns-resize',
      valueProperty: valueProperty,
      enabledRangeProperty: new Property( dragRange ),
      touchArea: predictMeanHandle.bounds.dilated( 5 ),
      accessibleName: 'Predict Mean Handle'
    }, providedOptions );
    super( combinedOptions );

    // Add sound generation for the "predict mean" slider.
    const predictMeanSoundGenerator = new MeanPredictionChangeSoundGenerator( valueProperty );
    soundManager.addSoundGenerator( predictMeanSoundGenerator );

    valueProperty.link( prediction => {
      this.centerY = modelViewTransform.modelToViewY( prediction );
    } );
    this.addInputListener( dragListener );
  }
}

meanShareAndBalance.register( 'MeanPredictionHandle', MeanPredictionHandle );