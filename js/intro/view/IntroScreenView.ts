// Copyright 2022, University of Colorado Boulder
/**
 * Representation for the Intro Screen, displaying 2D/3D water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { Node } from '../../../../scenery/js/imports.js';
import IntroModel from '../model/IntroModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PredictMeanSlider from './PredictMeanSlider.js';
import PipeNode from './PipeNode.js';
import WaterCup3DNode from './WaterCup3DNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import IntroControlPanel from './IntroControlPanel.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ValveNode from './ValveNode.js';
import TableNode from './TableNode.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';


type LevelingOutScreenViewOptions = MeanShareAndBalanceScreenViewOptions;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly meanVisibleProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;
  private readonly cupLevelVisibleProperty: Property<boolean>;

  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const predictMeanVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'predictMeanVisibleProperty' )
    } );
    const meanVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'meanVisibleProperty' )
    } );
    const tickMarksVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'tickMarksVisibleProperty' )
    } );
    const cupLevelVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'cupLevelVisibleProperty' )
    } );
    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    //Predict Mean Line that acts as a slider for alternative input.
    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.dragRange,
      model.numberOfCupsProperty, () => model.getActive2DCups(),
      modelViewTransform2DCups, {
        visibleProperty: predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        // phet-io
        tandem: options.tandem.createTandem( 'predictMeanSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
    const waterCupLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true
    } );

    // Configure layout

    // Pipe toggle
    const pipeSwitch = new ABSwitch( model.arePipesOpenProperty,
      false, new ValveNode( new Vector2( 0, 0 ), new Property( 0 ), options.tandem.createTandem( 'closedValveIcon' ) ),
      true, new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ), options.tandem.createTandem( 'openValveIcon' ) ), {
        toggleSwitchOptions: {
          size: new Dimension2( 40, 20 )
        },

        // phet-io
        tandem: options.tandem.createTandem( 'pipeSwitch' )
      } );

    const tableNode = new TableNode( { centerX: 6, y: 200 } );

    const combinedOptions = combineOptions<ScreenViewOptions>( { children: [ tableNode, waterCupLayerNode, predictMeanSlider ] }, options );

    super( model, meanShareAndBalanceStrings.introQuestionProperty, MeanShareAndBalanceColors.introQuestionBarColorProperty, model.numberOfCupsProperty, combinedOptions );

    // add all cup nodes to the view
    model.waterCup2DArray.forEach( ( cupModel, index ) => {
      const cupNode = new WaterCup2DNode( cupModel, model.waterCup3DArray[ index ], modelViewTransform2DCups, model.meanProperty, tickMarksVisibleProperty,
        meanVisibleProperty, cupLevelVisibleProperty, { tandem: options.tandem.createTandem( `waterCup2DNode${cupModel.linePlacement}` ) } );
      waterCupLayerNode.addChild( cupNode );
    } );

    model.waterCup3DArray.forEach( cupModel => {
      const cupNode = new WaterCup3DNode( tickMarksVisibleProperty, model, cupModel, modelViewTransform3DCups, {
        tandem: options.tandem.createTandem( `waterCup3DNode${cupModel.linePlacement}` )
      } );
      waterCupLayerNode.addChild( cupNode );
    } );

    model.pipeArray.map( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, model.arePipesOpenProperty, modelViewTransform2DCups,
        { tandem: options.tandem.createTandem( `pipeNode${index}` ) } );
      waterCupLayerNode.addChild( pipeNode );
      return pipeNode;
    } );

    // Center waterCups as they are activated and de-activated
    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const cupsAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;
    const centerWaterCupLayerNode = () => {
      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanSlider.x = waterCupLayerNode.x - 12.5;
      tableNode.centerX = waterCupLayerNode.centerX;
      tableNode.y = waterCupLayerNode.y - 28;
    };

    model.numberOfCupsProperty.link( centerWaterCupLayerNode );
    model.numberOfCupsProperty.lazyLink( () => this.interruptSubtreeInput );

    // Configure layout
    const controlPanel = new IntroControlPanel( tickMarksVisibleProperty, meanVisibleProperty, predictMeanVisibleProperty, cupLevelVisibleProperty, options.tandem );
    this.controlsVBox.addChild( controlPanel );
    this.dataStateVBox.addChild( pipeSwitch );

    this.pdomPlayAreaNode.pdomOrder = [
      waterCupLayerNode,
      controlPanel,
      predictMeanSlider
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];

    this.predictMeanVisibleProperty = predictMeanVisibleProperty;
    this.meanVisibleProperty = meanVisibleProperty;
    this.tickMarksVisibleProperty = tickMarksVisibleProperty;
    this.cupLevelVisibleProperty = cupLevelVisibleProperty;
  }

  public override reset(): void {
    super.reset();
    this.predictMeanVisibleProperty.reset();
    this.meanVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();
    this.cupLevelVisibleProperty.reset();
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );