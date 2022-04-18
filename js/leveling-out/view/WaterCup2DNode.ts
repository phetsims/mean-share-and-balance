// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the 2D water cup including dynamic water level.
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Utils from '../../../../dot/js/Utils.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Rectangle, Node, Line, NodeOptions } from '../../../../scenery/js/imports.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TickMarksNode from './TickMarksNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {};

type WaterCup2DNodeOptions = SelfOptions & NodeOptions;

class WaterCup2DNode extends Node {

  readonly cupHeight: number;
  readonly waterCup: WaterCup2DModel;

  constructor( waterCup: WaterCup2DModel, modelViewTransform: ModelViewTransform2, meanProperty: NumberProperty,
               isShowingTickMarksProperty: BooleanProperty, isShowingMeanProperty: BooleanProperty,
               providedOptions?: WaterCup2DNodeOptions ) {
    const options = optionize<WaterCup2DNodeOptions, SelfOptions, NodeOptions>( {
      //TODO add default values for options
    }, providedOptions );

    super( options );

    this.cupHeight = 100;
    this.waterCup = waterCup;
    const tickMarks = new TickMarksNode( this.cupHeight, { visibleProperty: isShowingTickMarksProperty } );
    const cupWidth = 50;

    //0 is empty, 1 is full
    const y = Utils.linear( 0, 1, this.cupHeight, 0, waterCup.waterLevelProperty.value );
    const waterCupRectangle = new Rectangle( 0, 0, cupWidth, this.cupHeight, { stroke: 'black' } );
    const waterLevelRectangle = new Rectangle( 0, y, cupWidth, this.cupHeight * waterCup.waterLevelProperty.value, { fill: '#51CEF4' } );

    const showMeanLine = new Line( 0, this.cupHeight * meanProperty.value, cupWidth, this.cupHeight * meanProperty.value, {
      stroke: 'red',
      lineWidth: 2,
      visibleProperty: isShowingMeanProperty
    } );

    this.addChild( waterLevelRectangle );
    this.addChild( waterCupRectangle );
    this.addChild( tickMarks );
    this.addChild( showMeanLine );

    this.x = waterCup.xProperty.value;
    this.y = waterCup.y;
    this.bottom = modelViewTransform.modelToViewY( 0 );
  }
}

meanShareAndBalance.register( 'WaterCup2DNode', WaterCup2DNode );
export default WaterCup2DNode;