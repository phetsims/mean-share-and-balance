// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D water cup including dynamic water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, NodeTransformOptions, Rectangle } from '../../../../scenery/js/imports.js';
import WaterCup from '../model/WaterCup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup2DTickMarksNode from './WaterCup2DTickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

type cup2DModel2DNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions>;

export default class WaterCup2DNode extends Node {

  public constructor( waterCup: WaterCup, waterCup3D: WaterCup, modelViewTransform: ModelViewTransform2, meanProperty: TReadOnlyProperty<number>,
                      isShowingTickMarksProperty: Property<boolean>, isShowingMeanProperty: Property<boolean>,
                      isShowingCupWaterLevelProperty: Property<boolean>, providedOptions?: cup2DModel2DNodeOptions ) {
    const options = optionize<cup2DModel2DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCup.position.x,
      visibleProperty: waterCup.isActiveProperty
    }, providedOptions );

    const tickMarks = new WaterCup2DTickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      {
        visibleProperty: isShowingTickMarksProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'tickMarks' )
      }
    );

    // 0 is empty, 1 is full
    const y = Utils.linear( 0, 1, MeanShareAndBalanceConstants.CUP_HEIGHT, 0, waterCup.waterLevelProperty.value );

    const waterCupRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT,
      { stroke: 'black' }
    );

    const waterCupBackgroundRectangle = new Rectangle( waterCupRectangle.localBounds, { fill: 'white' } );
    const waterLevelRectangle = new Rectangle( 0, y, MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * waterCup.waterLevelProperty.value,
      { fill: MeanShareAndBalanceColors.waterFillColorProperty }
    );

    const waterLevelListener = ( waterLevel: number ) => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    };
    waterCup.waterLevelProperty.link( waterLevelListener );

    // Model view transform inverts Y mapping, therefore the mean inverse is needed to place
    // show mean line accurately in relation to water levels.
    let meanInverse = 1 - meanProperty.value;

    const meanLine = new Line(
      0,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      {
        stroke: MeanShareAndBalanceColors.showMeanLineStrokeColorProperty,
        lineWidth: 2,
        visibleProperty: isShowingMeanProperty
      } );

    const originalWaterLevelLine = new Line(
      0,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      {
        stroke: MeanShareAndBalanceColors.cupWaterLineColorProperty,
        lineWidth: 1,
        visibleProperty: isShowingCupWaterLevelProperty
      } );

    waterCup3D.waterLevelProperty.link( wlp => {
      meanInverse = 1 - wlp;
      originalWaterLevelLine.setY1( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
      originalWaterLevelLine.setY2( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
    } );

    const meanListener = ( mean: number ) => {
      meanInverse = 1 - mean;
      meanLine.setY1( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
      meanLine.setY2( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
    };

    meanProperty.link( meanListener );

    const combinedOptions = combineOptions<cup2DModel2DNodeOptions>( {
      children: [ waterCupBackgroundRectangle, waterLevelRectangle,
        waterCupRectangle, meanLine, originalWaterLevelLine, tickMarks ]
    }, options );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );