// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import MeanShareAndBalanceScreenView from '../../common/view/MeanShareAndBalanceScreenView.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { HBox, VBox, Text, Line } from '../../../../scenery/js/imports.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Property from '../../../../axon/js/Property.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';

type SelfOptions = {

}

type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  constructor( model: LevelingOutModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {

    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups );

    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ predictMeanText ] } ),
      property: model.predictMeanProperty
      },
      {
        node: new HBox( { children: [ showMeanText ] } ),
        property: model.showMeanProperty
      },
      {
        node: new HBox( { children: [ tickMarksText ] } ),
        property: model.tickMarksProperty
      } ],
      {
        right: this.layoutBounds.right - 100
      }
    );

    const numberOfCupsNumberPicker = new NumberPicker(
      model.numberOfCupsProperty, new Property( model.levelingOutRange ),
      {
        yMargin: 10,
        xMargin: 10,
        arrowHeight: 10
      }
    );

    const levelingOutNumberPickerVBox = new VBox( {
      children: [
        numberOfCupsText,
        numberOfCupsNumberPicker
      ],
      align: 'center',
      right: 900,
      bottom: this.layoutBounds.bottom
    } );

    // 2D water cup nodes addition and removal
    const waterCupMap = new Map<WaterCup2DModel, WaterCup2DNode>();
    const waterCup2DNode = new WaterCup2DNode( model.waterCups[ 0 ] );
    waterCupMap.set( model.waterCups[ 0 ], waterCup2DNode );

    model.waterCups.addItemAddedListener( waterCupModel => {
        const waterCupNode = new WaterCup2DNode( waterCupModel );
        this.addChild( waterCupNode );
        waterCupMap.set( waterCupModel, waterCupNode );
    } );

    model.waterCups.addItemRemovedListener( waterCupModel => {
      //Is this the proper implementation of typescript Non-null assertion operator?
        const waterCupNode = waterCupMap.get( waterCupModel )!;
        this.removeChild( waterCupNode );
    } );

    //Predict Mean Line
    // x1: static, y1: dependent on mean, x2: dependent on numberOfCups, y2: same as y1
    const predictMeanLine = new Line( 50, 250, 300, 250, {
      stroke: 'purple',
      lineWidth: 2
    } );

    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    this.addChild( waterCup2DNode );
    this.addChild( predictMeanLine );
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );
export default LevelingOutScreenView;