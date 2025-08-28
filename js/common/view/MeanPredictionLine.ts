// Copyright 2022-2025, University of Colorado Boulder

/**
 * Representation for the dashed predict mean line whose vertical position is controlled by the MeanPredictionHandle.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Pattern from '../../../../scenery/js/util/Pattern.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import selectionArpeggio009_mp3 from '../../../../tambo/sounds/selectionArpeggio009_mp3.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanPredictionHandle from './MeanPredictionHandle.js';

type SelfOptions = {
  meanTolerance: number;
  roundingInterval: number;
};

type ParentOptions = NodeOptions;
type MeanPredictionLineOptions = SelfOptions & WithRequired<ParentOptions, 'tandem'>;

// Constants
const LINE_X_MARGIN = 5;

export default class MeanPredictionLine extends Node {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Node;
  private readonly predictMeanGlow: Rectangle;

  public constructor( meanPredictionProperty: Property<number>,
                      dragRange: Range,
                      successIndicatorsEnabledProperty: TReadOnlyProperty<boolean>,
                      meanValueProperty: TReadOnlyProperty<number>,
                      successIndicatorsOperatingProperty: TReadOnlyProperty<boolean>,
                      private readonly modelViewTransform: ModelViewTransform2,
                      providedOptions: MeanPredictionLineOptions ) {

    const options = optionize<MeanPredictionLineOptions, SelfOptions, ParentOptions>()( {
      phetioFeatured: true,
      isDisposable: false
    }, providedOptions );

    const strokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( MeanShareAndBalanceConstants.HORIZONTAL_PATTERN_MATRIX );
    const predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ), {
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN_WIDTH,
      stroke: strokePattern,
      lineDash: [ 5, 3 ]
    } );

    // Create elements that indicate a successful prediction of the mean.
    const predictMeanSuccessRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 10, {
      fill: MeanShareAndBalanceColors.predictMeanSuccessFillProperty,
      opacity: 0.5,
      cornerRadius: 2,
      visible: false,
      centerY: predictMeanLine.centerY
    } );

    const meanPredictionHandle = new MeanPredictionHandle( meanPredictionProperty, dragRange, modelViewTransform, {
      tandem: options.tandem.createTandem( 'meanPredictionHandle' )
    } );
    const combinedOptions = combineOptions<ParentOptions>( {
      children: [ predictMeanSuccessRectangle, predictMeanLine, meanPredictionHandle ]
    }, options );
    super( combinedOptions );

    // Create the sound that will be played when the mean prediction becomes correct.
    const meanPredictionSuccessSoundClip = new SoundClip( selectionArpeggio009_mp3, { initialOutputLevel: 0.1 } );
    soundManager.addSoundGenerator( meanPredictionSuccessSoundClip );

    Multilink.multilink( [
        successIndicatorsEnabledProperty,
        successIndicatorsOperatingProperty,
        meanValueProperty,
        meanPredictionProperty
      ],
      ( successIndicatorsEnabled, successIndicatorsOperating, meanValue, meanPrediction ) => {
        // If a phet-io client turns off successIndicator operation, hide the success rectangle, set the line to
        // the default pattern, and return early.
        if ( !successIndicatorsOperating ) {
          predictMeanSuccessRectangle.visible = false;
          predictMeanLine.stroke = strokePattern;
          return;
        }
        const successRectangleWasVisible = predictMeanSuccessRectangle.visible;
        const successStrokeColorWasSet = predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty;

        if ( successIndicatorsEnabled ) {
          const meanTolerance = options.meanTolerance;
          const roundingInterval = options.roundingInterval;
          const roundedPrediction = Utils.roundToInterval( meanPrediction, roundingInterval );
          const roundedMean = Utils.roundToInterval( meanValue, roundingInterval );
          const closeToMean = Utils.equalsEpsilon( roundedPrediction, roundedMean, meanTolerance );
          predictMeanLine.stroke = roundedPrediction === roundedMean ?
                                   MeanShareAndBalanceColors.meanColorProperty :
                                   strokePattern;
          predictMeanSuccessRectangle.visible = closeToMean;
        }
        else {
          predictMeanLine.stroke = strokePattern;
          predictMeanSuccessRectangle.visible = false;
        }

        // If one of the success indicators was just activated, play the "successful prediction" sound.
        if ( this.visible && !successRectangleWasVisible && !successStrokeColorWasSet &&
             ( predictMeanSuccessRectangle.visible || predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty ) ) {
          meanPredictionSuccessSoundClip.play();
        }
      }
    );

    this.addLinkedElement( meanPredictionProperty );
    ManualConstraint.create( this, [ meanPredictionHandle, predictMeanLine, predictMeanSuccessRectangle ],
      ( handleProxy, lineProxy, rectangleProxy ) => {
        lineProxy.centerY = handleProxy.centerY;
        rectangleProxy.centerY = handleProxy.centerY;
      } );

    this.predictMeanLine = predictMeanLine;
    this.predictMeanHandle = meanPredictionHandle;
    this.predictMeanGlow = predictMeanSuccessRectangle;
    this.modelViewTransform = modelViewTransform;
  }

  /**
   * Update the length of the line based on the provided start and end x values.
   * @param lineStart
   * @param lineEnd
   */
  public updateLine( lineStart: number, lineEnd: number ): void {
    const x1 = lineStart - LINE_X_MARGIN;
    const x2 = lineEnd + LINE_X_MARGIN;
    this.predictMeanLine.x1 = x1;
    this.predictMeanLine.x2 = x2;
    this.predictMeanGlow.setRectX( x1 );
    this.predictMeanGlow.setRectWidth( x2 - x1 );
    this.predictMeanHandle.left = this.predictMeanLine.right;

    // We want the predict line to be centered not including the handle.
    this.centerX = this.modelViewTransform.modelToViewX( 0 ) + this.predictMeanHandle.width / 2;
  }
}

meanShareAndBalance.register( 'MeanPredictionLine', MeanPredictionLine );