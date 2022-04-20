// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { HBox, VBox, Text } from '../../../../scenery/js/imports.js';
import QuestionBar from '../../../../scenery-phet/js/QuestionBar.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import WaterCup2DModel from '../model/WaterCup2DModel.js';
import PredictMeanNode from './PredictMeanNode.js';
import merge from '../../../../phet-core/js/merge.js';
import PipeNode from './PipeNode.js';
import PipeModel from '../model/PipeModel.js';

type SelfOptions = {};

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

class LevelingOutScreenView extends MeanShareAndBalanceScreenView {
  readonly model: LevelingOutModel;
  readonly modelViewTransform: ModelViewTransform2;

  // TODO: Split this up into 2 maps, using this structure:
  // readonly waterCupMap: Map<WaterCup2DModel, WaterCup2DNode>;
  // readonly pipeMap: Map<PipeModel, PipeNode>;
  // TODO: Mark all attributes as private where possible in all files
  readonly waterCupMap: Map<WaterCup2DModel, Array<PipeNode | WaterCup2DNode>>;

  constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenViewOptions here
    }, providedOptions );

    super( model, options );

    this.model = model;
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 50, 250 ), 100 );
    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean );
    const showMeanText = new Text( meanShareAndBalanceStrings.showMean );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks );
    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups );

    const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, merge( {
      tandem: options.tandem.createTandem( 'questionBar' )
    }, { labelText: 'What is the average amount of water per cup?' } ) );

    //Checkbox Group
    const levelingOutOptionsCheckboxGroupTandem = options.tandem.createTandem( 'levelingOutOptionsCheckboxGroup' );
    const levelingOutOptionsCheckboxGroup = new VerticalCheckboxGroup( [
        {

          // TODO: Let's remove HBox wrappers since they don't do anything at the moment
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

        // TODO: Position the levelingOutOptionsCheckboxGroup beneath the QuestionBar.  Will the position need to update as the screen shape changes?
      }
    );

    const numberOfCupsNumberPicker = new NumberPicker(
      model.numberOfCupsProperty,
      new Property( model.levelingOutRange ), {
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
    this.waterCupMap = new Map<WaterCup2DModel, Array<PipeNode | WaterCup2DNode>>();
    for ( let i = 0; i < model.waterCups.length; i += 1 ) {
      this.addWaterCupNode( model.waterCups[ i ], i );
    }

    model.waterCups.addItemAddedListener( waterCupModel => {
      const index = model.waterCups.findIndex( waterCup => waterCup === waterCupModel );
      this.addWaterCupNode( waterCupModel, index );
    } );

    model.waterCups.addItemRemovedListener( waterCupModel => {
      const nodes = this.waterCupMap.get( waterCupModel )!;
      nodes.forEach( node => this.removeChild( node ) );
      this.waterCupMap.delete( waterCupModel );
    } );

    //Predict Mean Line
    const predictMeanLine = new PredictMeanNode( model, this.modelViewTransform, { visibleProperty: model.isShowingPredictMeanProperty } );

    this.addChild( questionBar );
    this.addChild( levelingOutOptionsCheckboxGroup );
    this.addChild( levelingOutNumberPickerVBox );
    //TODO fix z-index by adding something like `this.waterNodeLayer = new Node()`.  Don't forget to import Node
    this.addChild( predictMeanLine );
  }

  // TODO: The water cups should be centered on the screen
  // TODO: After changes in LevelingOutModel with pipes observable array, we probably won't need index here any more
  private addWaterCupNode( cupModel: WaterCup2DModel, index: number ): void {
    const waterCupNode = new WaterCup2DNode( cupModel, this.modelViewTransform, this.model.meanProperty,
      this.model.isShowingTickMarksProperty, this.model.isShowingMeanProperty );
    this.waterCupMap.set( cupModel, [ waterCupNode ] );
    if ( index !== 0 ) {
      const pipeNode = new PipeNode( new PipeModel(), this.modelViewTransform, waterCupNode.bottom, waterCupNode.x );
      this.waterCupMap.get( cupModel )!.push( pipeNode );
      this.addChild( pipeNode );
    }
    this.addChild( waterCupNode );
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );
export default LevelingOutScreenView;