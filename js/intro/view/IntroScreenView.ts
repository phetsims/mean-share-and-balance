// Copyright 2022, University of Colorado Boulder
/**
 * Representation for the Intro Screen, displaying 2D/3D water cups, pipes, and various interactive options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import IntroModel from '../model/IntroModel.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import WaterCup2DNode from './WaterCup2DNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import PredictMeanSlider from './PredictMeanSlider.js';
import PipeNode from './PipeNode.js';
import WaterCup3DNode from './WaterCup3DNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import IntroControlPanel from './IntroControlPanel.js';
import TableNode from '../../common/view/TableNode.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Shape } from '../../../../kite/js/imports.js';
import NoteBookPaperNode from '../../common/view/NoteBookPaperNode.js';


type LevelingOutScreenViewOptions = PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class IntroScreenView extends MeanShareAndBalanceScreenView {


  public constructor( model: IntroModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;


    const modelViewTransform2DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );
    const modelViewTransform3DCups = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ), new Vector2( 0, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y ), MeanShareAndBalanceConstants.CUP_HEIGHT );

    //Predict Mean Line that acts as a slider for alternative input.
    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.dragRange,
      model.numberOfCupsProperty, () => model.getActive2DCups(),
      modelViewTransform2DCups, {
        visibleProperty: model.predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.dragRange ),

        // phet-io
        tandem: options.tandem.createTandem( 'predictMeanSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    const waterCups2DParentTandem = options.tandem.createTandem( 'waterCups2D' );
    const waterCups3DParentTandem = options.tandem.createTandem( 'waterCups3D' );
    const pipesParentTandem = options.tandem.createTandem( 'pipes' );
    // Add all cup nodes to the view
    const waterCup2DNodes: Array<WaterCup2DNode> = [];
    model.waterCup2DArray.forEach( ( cupModel, index ) => {
      const cupNode = new WaterCup2DNode( cupModel, model.waterCup3DArray[ index ], modelViewTransform2DCups, model.meanProperty, model.tickMarksVisibleProperty,
        model.meanVisibleProperty, model.cupLevelVisibleProperty, { tandem: waterCups2DParentTandem.createTandem( `waterCup2DNode${cupModel.linePlacement + 1}` ) } );
      waterCup2DNodes.push( cupNode );
    } );

    const waterCup3DNodes: Array<WaterCup3DNode> = [];
    model.waterCup3DArray.forEach( cupModel => {
      const cupNode = new WaterCup3DNode( model.tickMarksVisibleProperty, model, cupModel, modelViewTransform3DCups, {
        tandem: waterCups3DParentTandem.createTandem( `waterCup3DNode${cupModel.linePlacement + 1}` )
      } );
      waterCup3DNodes.push( cupNode );
    } );

    // Add all pipe nodes to the view
    const pipeNodes: Array<PipeNode> = [];
    model.pipeArray.forEach( pipeModel => {
      const index = model.pipeArray.indexOf( pipeModel );
      const pipeNode = new PipeNode( pipeModel, model.arePipesOpenProperty, modelViewTransform2DCups,
        { tandem: pipesParentTandem.createTandem( `pipeNode${index + 1}` ), focusable: index === 0 } );

      pipeNodes.push( pipeNode );
    } );

    // This also includes the pipes that connect the 2D cups as well as the draggable water level triangle
    const waterCupLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...waterCup2DNodes, ...waterCup3DNodes, ...pipeNodes ]
    } );

    const notebookPaper = new NoteBookPaperNode();

    const tableNode = new TableNode( { centerX: waterCupLayerNode.centerX } );

    // Instantiate Parent
    super( model, MeanShareAndBalanceStrings.introQuestionStringProperty, MeanShareAndBalanceColors.introQuestionBarColorProperty, options );

    // Controls on Right side of screen
    const controlPanel = new IntroControlPanel( model.tickMarksVisibleProperty, model.meanVisibleProperty, model.predictMeanVisibleProperty,
      model.cupLevelVisibleProperty, model.numberOfCupsProperty, model.arePipesOpenProperty,
      { minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25, spacing: 20, tandem: options.tandem.createTandem( 'controlPanel' ) } );


    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    const controlsAlignBox = new AlignBox( controlPanel, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    this.addChild( controlsAlignBox );

    // Center waterCups as they are activated and de-activated
    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const cupsAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerWaterCupLayerNode = () => {
      waterCupLayerNode.centerX = cupsAreaCenterX;
      predictMeanSlider.x = waterCupLayerNode.x - 12.5;
      tableNode.centerX = waterCupLayerNode.centerX - 10;
      notebookPaper.centerX = waterCupLayerNode.centerX - 10;
      tableNode.y = waterCupLayerNode.bottom - 30;

      // Create a focus highlight that surrounds all the valves. Only the first valve is in the traversal
      // order and they all do the same thing so this highlight indicates that there will only be one stop in the
      // traversal order.
      const pipeBoundsShapes = pipeNodes.filter( pipe => pipe.visibleProperty.value ).map( pipe => Shape.bounds( pipe.globalBounds ) );
      const transformedPipeShapeBounds = Shape.union( pipeBoundsShapes ).transformed( pipeNodes[ 0 ].getGlobalToLocalMatrix() );

      // Focus highlight is set on the valveNode because it is what receives focus (not the PipeNode).
      pipeNodes[ 0 ].focusHighlight = transformedPipeShapeBounds;
    };

    model.numberOfCupsProperty.link( () => {
      centerWaterCupLayerNode();
      waterCupLayerNode.interruptSubtreeInput();
    } );

    this.screenViewRootNode.addChild( notebookPaper );
    this.screenViewRootNode.addChild( tableNode );
    this.screenViewRootNode.addChild( waterCupLayerNode );
    this.screenViewRootNode.addChild( predictMeanSlider );

    this.screenViewRootNode.pdomOrder = [ ...waterCup3DNodes, pipeNodes[ 0 ], predictMeanSlider, controlPanel, this.resetAllButton ];
  }
  public override reset(): void {
    super.reset();
  }
}

meanShareAndBalance.register( 'IntroScreenView', IntroScreenView );