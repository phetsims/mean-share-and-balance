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


type LevelingOutScreenViewOptions = MeanShareAndBalanceScreenViewOptions;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {
  private readonly pipeNodes: PipeNode[];
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly meanVisibleProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;

  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;
    super( model, meanShareAndBalanceStrings.introQuestion, MeanShareAndBalanceColors.introQuestionBarColorProperty, model.numberOfCupsProperty, options );

    this.predictMeanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'predictMeanVisibleProperty' )
    } );
    this.meanVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'meanVisibleProperty' )
    } );
    this.tickMarksVisibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'tickMarksVisibleProperty' )
    } );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    model.numberOfCupsProperty.lazyLink( () => this.interruptSubtreeInput );

    //Predict Mean Line that acts as a slider for alternative input.
    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.dragRange,
      model.numberOfCupsProperty, () => model.getActive2DCups(),
      modelViewTransform2DCups, {
        visibleProperty: this.predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        tandem: options.tandem.createTandem( 'predictMeanLine' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
    const waterCupLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true
    } );

    // 2D/3D water cup nodes addition and removal
    // Center 2D & 3D cups
    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const cupsAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;
    const centerWaterCupLayerNode = () => {
      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanSlider.x = waterCupLayerNode.x - 12.5;
    };

    // add all cup nodes to the view
    model.waterCup2DArray.forEach( ( cupModel, index ) => {
      const cupNode = new WaterCup2DNode( cupModel, model.waterCup3DArray[ index ], modelViewTransform2DCups, model.meanProperty, this.tickMarksVisibleProperty,
        this.meanVisibleProperty, { tandem: options.tandem.createTandem( `waterCup2DNode${cupModel.linePlacement}` ) } );
      waterCupLayerNode.addChild( cupNode );
      centerWaterCupLayerNode();
    } );

    model.waterCup3DArray.forEach( cupModel => {
      const cupNode = new WaterCup3DNode( this.tickMarksVisibleProperty, model, cupModel, modelViewTransform3DCups, {
        tandem: options.tandem.createTandem( `waterCup3DNode${cupModel.linePlacement}` )
      } );
      waterCupLayerNode.addChild( cupNode );
      centerWaterCupLayerNode();
    } );

    this.pipeNodes = model.pipeArray.map( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, model.arePipesOpenProperty, modelViewTransform2DCups,
        { tandem: options.tandem.createTandem( `pipeNode${index}` ) } );
      waterCupLayerNode.addChild( pipeNode );
      return pipeNode;
    } );

    model.numberOfCupsProperty.link( centerWaterCupLayerNode );

    // Configure layout
    const controlPanel = new IntroControlPanel( this.tickMarksVisibleProperty, this.meanVisibleProperty, this.predictMeanVisibleProperty, options.tandem );
    this.controlsVBox.addChild( controlPanel );

    // Pipe toggle
    const pipeSwitch = new ABSwitch( model.arePipesOpenProperty,
      false, new ValveNode( new Vector2( 0, 0 ), new Property( 0 ), options.tandem.createTandem( 'closedValveIcon' ) ),
      true, new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ), options.tandem.createTandem( 'openValveIcon' ) ), {
        tandem: options.tandem.createTandem( 'pipeSwitch' ),
        toggleSwitchOptions: {
          size: new Dimension2( 40, 20 )
        }
      } );
    this.dataStateVBox.addChild( pipeSwitch );

    this.addChild( new TableNode( { centerX: waterCupLayerNode.centerX - 6, y: waterCupLayerNode.bottom - 28 } ) );
    this.addChild( waterCupLayerNode );
    this.addChild( predictMeanSlider );

    this.pdomPlayAreaNode.pdomOrder = [
      waterCupLayerNode,
      controlPanel,
      predictMeanSlider
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];
  }

  public override reset(): void {
    super.reset();
    this.predictMeanVisibleProperty.reset();
    this.meanVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );