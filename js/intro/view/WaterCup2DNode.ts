// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D water cup including dynamic water level.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Line, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import WaterCup from '../model/WaterCup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup2DTickMarksNode from './WaterCup2DTickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import IReadOnlyProperty, { PropertyLinkListener } from '../../../../axon/js/IReadOnlyProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

//REVIEW is there a reason to include all NodeOptions? If a client provides any translation options, this Node won't sync with waterCupModel.
type cup2DModel2DNodeOptions = SelfOptions & StrictOmit<NodeOptions, 'y' | 'x' | 'left' | 'right' | 'top' | 'bottom'>;

export default class WaterCup2DNode extends Node {
  private readonly meanProperty: IReadOnlyProperty<number>;
  private readonly meanListener: PropertyLinkListener<number>;
  private readonly waterLevelListener: PropertyLinkListener<number>;
  private readonly waterCup: WaterCup;
  private readonly tickMarks: Node;
  private readonly meanLine: Line;

  public constructor( waterCup: WaterCup, modelViewTransform: ModelViewTransform2, meanProperty: IReadOnlyProperty<number>,
                      isShowingTickMarksProperty: Property<boolean>, isShowingMeanProperty: Property<boolean>,
                      providedOptions?: cup2DModel2DNodeOptions ) {
    const options = optionize<cup2DModel2DNodeOptions, SelfOptions, NodeOptions>()( {
      y: modelViewTransform.modelToViewY( 0 ) - MeanShareAndBalanceConstants.CUP_HEIGHT,
      left: waterCup.position.x,
      visibleProperty: waterCup.isActiveProperty
    }, providedOptions );

    super();

    this.waterCup = waterCup;

    this.meanProperty = meanProperty;
    this.tickMarks = new WaterCup2DTickMarksNode(
      MeanShareAndBalanceConstants.CUP_HEIGHT,
      {
        visibleProperty: isShowingTickMarksProperty,
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

    this.waterLevelListener = ( waterLevel: number ) => {
      waterLevelRectangle.setRectHeightFromBottom( MeanShareAndBalanceConstants.CUP_HEIGHT * waterLevel );
    };
    waterCup.waterLevelProperty.link( this.waterLevelListener );

    // Model view transform inverts Y mapping, therefore the mean inverse is needed to place
    // show mean line accurately in relation to water levels.
    let meanInverse = 1 - meanProperty.value;

    this.meanLine = new Line(
      0,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      MeanShareAndBalanceConstants.CUP_WIDTH,
      MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse,
      {
        stroke: MeanShareAndBalanceColors.showMeanLineStrokeColorProperty,
        lineWidth: 2,
        visibleProperty: isShowingMeanProperty
      } );

    this.meanListener = ( mean: number ) => {
      meanInverse = 1 - mean;
      this.meanLine.setY1( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
      this.meanLine.setY2( MeanShareAndBalanceConstants.CUP_HEIGHT * meanInverse );
    };

    meanProperty.link( this.meanListener );

    this.addChild( waterCupBackgroundRectangle );
    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
    this.addChild( this.meanLine );
    this.addChild( this.tickMarks );

    this.mutate( options );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );