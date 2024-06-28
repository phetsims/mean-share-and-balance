// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the dashed predict mean line whose vertical position is controlled by the MeanPredictionHandle.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Line, ManualConstraint, Node, NodeOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import MeanPredictionHandle from './MeanPredictionHandle.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type ParentOptions = NodeOptions;
type MeanPredictionLineOptions = SelfOptions & WithRequired<ParentOptions, 'tandem'>;

// Constants
const LINE_X_MARGIN = 8;

export default class MeanPredictionLine extends Node {
  private readonly predictMeanLine: Line;
  private readonly predictMeanHandle: Node;
  private readonly predictMeanGlow: Rectangle;

  public constructor( meanPredictionProperty: Property<number>,
                      dragRange: Range,
                      createSuccessIndicatorMultilink: ( predictMeanLine: Path, successRectangle: Node ) => void,
                      private readonly modelViewTransform: ModelViewTransform2,
                      providedOptions: MeanPredictionLineOptions ) {

    const options = optionize<MeanPredictionLineOptions, SelfOptions, ParentOptions>()( {
      phetioFeatured: true,
      isDisposable: false
    }, providedOptions );

    const predictMeanLine = new Line( new Vector2( 0, 0 ), new Vector2( MeanShareAndBalanceConstants.CUP_WIDTH, 0 ), {
      lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN_WIDTH,
      stroke: MeanShareAndBalanceConstants.HORIZONTAL_SKETCH_LINE_PATTERN,
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
    createSuccessIndicatorMultilink( predictMeanLine, predictMeanSuccessRectangle );

    const meanPredictionHandle = new MeanPredictionHandle( meanPredictionProperty, dragRange, modelViewTransform, {
      tandem: options.tandem.createTandem( 'meanPredictionHandle' )
    } );
    const combinedOptions = combineOptions<ParentOptions>( {
      children: [ predictMeanSuccessRectangle, predictMeanLine, meanPredictionHandle ]
    }, options );
    super( combinedOptions );
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