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
import PredictMeanNode from './PredictMeanNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';

type SelfOptions = {}

type MeanShareAndBalanceScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  readonly model: LevelingOutModel;
  readonly modelViewTransform: ModelViewTransform2;

  constructor( model: LevelingOutModel, providedOptions: MeanShareAndBalanceScreenViewOptions ) {

    const options = optionize<MeanShareAndBalanceScreenViewOptions, SelfOptions, ScreenViewOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    this.model = model;
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 200 ), 100 );
    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups );
    const levelingOutOptionsCheckboxGroupTandem = options.tandem.createTandem( 'levelingOutOptionsCheckboxGroup' );

    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [
        {
          node: new HBox( { children: [ predictMeanText ] } ),
          property: model.isShowingPredictMeanProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' )
        },
        {
          node: new HBox( { children: [ showMeanText ] } ),
          property: model.isShowingMeanProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'showMeanCheckbox' )
        },
        {
          node: new HBox( { children: [ tickMarksText ] } ),
          property: model.isShowingTickMarksProperty,
          tandem: levelingOutOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' )
        } ],
      {
        right: this.layoutBounds.right - 100
      }
    );

    const numberOfCupsNumberPicker = new NumberPicker(
      model.numberOfCupsProperty, new Property( model.levelingOutRange ),
      {
        tandem: options.tandem.createTandem( 'numberOfCupsNumberPicker' ),
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

    model.waterCups.forEach( cup => {
      const waterCup2DNode = new WaterCup2DNode( cup, this.modelViewTransform );
      waterCupMap.set( cup, waterCup2DNode );
    } );

    model.waterCups.addItemAddedListener( waterCupModel => {
      const waterCupNode = new WaterCup2DNode( waterCupModel, this.modelViewTransform );
      this.addChild( waterCupNode );
      waterCupMap.set( waterCupModel, waterCupNode );
    } );

    model.waterCups.addItemRemovedListener( waterCupModel => {
      const waterCupNode = waterCupMap.get( waterCupModel )!;
      this.removeChild( waterCupNode );

      waterCupMap.delete( waterCupModel );
    } );

    //Predict Mean Line
    const predictMeanLine = new PredictMeanNode( this, this.modelViewTransform );

    model.isShowingPredictMeanProperty.link( showingPredictMean => {
      predictMeanLine.visible = showingPredictMean;
    } );

    //Show Mean Line
    //x1: start of 2D cup, y1: dependent on mean, x2: dependent on numberOfCups, y2: same as y1
    const showMeanLine = new Line( 50, 250, 300, 250, {
      stroke: 'red',
      lineWidth: 2
    } );

    model.isShowingMeanProperty.link( showingMean => {
      showMeanLine.visible = showingMean;
    } );

    //TODO adjust tickMarks visibility on waterCup2DNodes based on tickMarksProperty
    model.isShowingTickMarksProperty.link( value => {

    } );

    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );

    for ( const node of waterCupMap.values() ) {
      this.addChild( node );
    }

    this.addChild( predictMeanLine );
    this.addChild( showMeanLine );
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );
export default LevelingOutScreenView;