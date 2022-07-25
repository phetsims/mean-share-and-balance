// Copyright 2022, University of Colorado Boulder
/**
 * Representation for the Intro Screen, displaying 2D/3D water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { Color, Node, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
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

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {
  private readonly pipeNodes: PipeNode[];

  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    const numberOfCupsText = new Text( meanShareAndBalanceStrings.numberOfCups, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );
    this.visibleProperty.link( visible => visible && MeanShareAndBalanceColors.questionBarColorProperty.set( new Color( '#2496D6' ) ) );

    //Number Picker
    const numberOfCupsNumberSpinner = new NumberSpinner(
      model.numberOfCupsProperty,

      // The range is constant
      new Property( model.numberOfCupsRange ), {
        arrowsPosition: 'leftRight',
        tandem: options.tandem.createTandem( 'numberOfCupsNumberSpinner' ),
        accessibleName: meanShareAndBalanceStrings.numberOfCups,
        layoutOptions: {
          align: 'left'
        }
      }
    );

    //Predict Mean Line that acts as a slider for alternative input.
    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.dragRange,
      model.numberOfCupsProperty, () => model.getActive2DCups(),
      modelViewTransform2DCups, {
        visibleProperty: model.predictMeanVisibleProperty,
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
    model.waterCup2DArray.forEach( cupModel => {

      // TODO: Better way of matching indices or tandems?
      const index = model.waterCup2DArray.indexOf( cupModel );
      const cupNode = new WaterCup2DNode( cupModel, modelViewTransform2DCups, model.meanProperty, model.tickMarksVisibleProperty,
        model.meanVisibleProperty, { tandem: options.tandem.createTandem( `waterCup2DNode${index}` ) } );
      waterCupLayerNode.addChild( cupNode );
      centerWaterCupLayerNode();
    } );

    model.waterCup3DArray.forEach( cupModel => {
      const index = model.waterCup3DArray.indexOf( cupModel );
      const cupNode = new WaterCup3DNode( model.tickMarksVisibleProperty, model.changeWaterLevel.bind( model ), cupModel, modelViewTransform3DCups,
        { tandem: options.tandem.createTandem( `waterCup3DNode${index}` ) } );
      waterCupLayerNode.addChild( cupNode );
      centerWaterCupLayerNode();
    } );

    this.pipeNodes = model.pipeArray.map( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, modelViewTransform2DCups,
        { tandem: options.tandem.createTandem( `pipeNode${index}` ) } );
      waterCupLayerNode.addChild( pipeNode );
      return pipeNode;
    } );

    model.numberOfCupsProperty.link( centerWaterCupLayerNode );

    // Configure layout
    const controlPanel = new IntroControlPanel( model, options.tandem );
    this.controlsVBox.addChild( controlPanel );
    this.numberSpinnerVBox.children = [ numberOfCupsText, numberOfCupsNumberSpinner ];

    this.addChild( waterCupLayerNode );
    this.addChild( predictMeanSlider );

    this.pdomPlayAreaNode.pdomOrder = [
      waterCupLayerNode,
      numberOfCupsNumberSpinner,
      controlPanel,
      predictMeanSlider,
      this.syncButton
    ];

    this.pdomControlAreaNode.pdomOrder = [
      this.resetAllButton
    ];
  }

  public override step( dt: number ): void {
    super.step( dt );
    this.pipeNodes.forEach( pipeNode => pipeNode.step( dt ) );
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );