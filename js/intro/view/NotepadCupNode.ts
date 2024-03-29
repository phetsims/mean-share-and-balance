// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the notepad water cup including dynamic water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, NodeTransformOptions, Pattern, Rectangle } from '../../../../scenery/js/imports.js';
import Cup from '../model/Cup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import NotepadCupTickMarksNode from './NotepadCupTickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import graphiteTexture_png from '../../../images/graphiteTexture_png.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';

type SelfOptions = EmptySelfOptions;

type NotepadCupNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTransformOptions | 'children'>;

export default class NotepadCupNode extends Node {

  public constructor( notepadCup: Cup, tableCup: Cup, modelViewTransform: ModelViewTransform2, meanProperty: TReadOnlyProperty<number>,
                      isShowingTickMarksProperty: Property<boolean>, isShowingMeanProperty: Property<boolean>,
                      isShowingCupWaterLevelProperty: Property<boolean>, providedOptions?: NotepadCupNodeOptions ) {
    const options = optionize<NotepadCupNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: notepadCup.position.x,
      visibleProperty: notepadCup.isActiveProperty
    }, providedOptions );

    const tickMarks = new NotepadCupTickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      {
        visibleProperty: isShowingTickMarksProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'tickMarks' )
      }
    );

    // 0 is empty, 1 is full
    const y = Utils.linear( 0, 1, MeanShareAndBalanceConstants.CUP_HEIGHT, 0, notepadCup.waterLevelProperty.value );

    const topStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0.9 ) );
    const bottomStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15, 0, 0, 0, 0.15, 0 ) );
    const verticalStrokePattern = new Pattern( graphiteTexture_png ).setTransformMatrix( Matrix3.affine( 0.15 * Math.cos( Math.PI / 2 ), -0.15 * Math.sin( Math.PI / 2 ), 0.975,
      0.15 * Math.sin( Math.PI / 2 ), 0.15 * Math.cos( Math.PI / 2 ), 0 ) );

    const cupStrokeLeft = new Line( 0, 0, 0, MeanShareAndBalanceConstants.CUP_HEIGHT, { lineWidth: 1.95, stroke: verticalStrokePattern } );
    const cupStrokeRight = new Line( MeanShareAndBalanceConstants.CUP_WIDTH, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, {
      lineWidth: 1.95,
      stroke: verticalStrokePattern
    } );
    const cupStrokeTop = new Line( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, 0, {
      lineWidth: 1.95,
      stroke: topStrokePattern
    } );
    const cupStrokeBottom = new Line( 0, MeanShareAndBalanceConstants.CUP_HEIGHT, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, {
      lineWidth: 1.95,
      stroke: bottomStrokePattern
    } );

    const waterCupBackgroundRectangle = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CUP_WIDTH, MeanShareAndBalanceConstants.CUP_HEIGHT, { fill: 'white' } );
    const waterLevelRectangle = new Rectangle( 0, y, MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * notepadCup.waterLevelProperty.value,
      { fill: MeanShareAndBalanceColors.waterFillColorProperty }
    );

    const waterLevelListener = ( waterLevel: number ) => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    };
    notepadCup.waterLevelProperty.link( waterLevelListener );

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
        stroke: MeanShareAndBalanceColors.cupWaterLevelLineColorProperty,
        lineWidth: 1,
        visibleProperty: isShowingCupWaterLevelProperty
      } );

    tableCup.waterLevelProperty.link( wlp => {
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

    const combinedOptions = combineOptions<NodeOptions>( {
      children: [ waterCupBackgroundRectangle, waterLevelRectangle,
        cupStrokeLeft, cupStrokeRight, cupStrokeTop, cupStrokeBottom, meanLine, originalWaterLevelLine, tickMarks ]
    }, options );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'NotepadCupNode', NotepadCupNode );