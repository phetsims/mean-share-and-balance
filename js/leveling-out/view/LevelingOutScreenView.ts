// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import ChocolateBarsContainerNode from './ChocolateBarsContainerNode.js';
import LevelingOutControlPanel from './LevelingOutControlPanel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import PersonNode from './PersonNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TableNode from '../../common/view/TableNode.js';
import NoteBookPaperNode from '../../common/view/NoteBookPaperNode.js';
import DraggableChocolateNode from './DraggableChocolateNode.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const controlPanel = new LevelingOutControlPanel( model, {
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20,
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const peopleNodes = model.peopleArray.map( person => new PersonNode( person, { tandem: options.tandem.createTandem( `Person${person.linePlacement + 1}` ) } ) );

    const plateNodes = model.platesArray.map( plate => new ChocolateBarsContainerNode( plate, this, { tandem: options.tandem.createTandem( `plate${plate.linePlacement + 1}` ) } ) );

    const tableNode = new TableNode( { y: MeanShareAndBalanceConstants.PEOPLE_CENTER_Y } );

    const noteBookPaper = new NoteBookPaperNode();

    const chocolateLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...peopleNodes, ...plateNodes ]
    } );

    const combinedOptions = combineOptions<ScreenViewOptions>( { children: [ noteBookPaper, tableNode, chocolateLayerNode ] }, options );

    super( model, meanShareAndBalanceStrings.levelingOutQuestionStringProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, combinedOptions );

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const cupsAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerWaterCupLayerNode = () => {
      chocolateLayerNode.centerX = cupsAreaCenterX;
      tableNode.centerX = chocolateLayerNode.centerX;
      tableNode.y = chocolateLayerNode.bottom - 110;
      noteBookPaper.centerX = chocolateLayerNode.centerX - 10;
      noteBookPaper.y = chocolateLayerNode.top - 30;
    };

    model.numberOfPeopleProperty.link( () => {
      centerWaterCupLayerNode();
      this.interruptSubtreeInput();
    } );

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
  }

  public chocolateBarDropped( chocolateBar: DraggableChocolateNode ): void {
    //drop a chocolate bar
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );