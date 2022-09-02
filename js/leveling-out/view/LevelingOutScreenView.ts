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
import PaperPlateNode from './PaperPlateNode.js';
import LevelingOutControlPanel from './LevelingOutControlPanel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import TablePlateNode from './TablePlateNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TableNode from '../../common/view/TableNode.js';
import NoteBookPaperNode from '../../common/view/NoteBookPaperNode.js';
import DraggableChocolate from './DraggableChocolate.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PersonImage from './PersonImage.js';
import person1_png from '../../../images/person1_png.js';
import person2_png from '../../../images/person2_png.js';
import person3_png from '../../../images/person3_png.js';
import person4_png from '../../../images/person4_png.js';
import person5_png from '../../../images/person5_png.js';
import person6_png from '../../../images/person6_png.js';
import person7_png from '../../../images/person7_png.js';

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

    const chocolateBarDropped = ( chocolateBar: DraggableChocolate ) => {

      let closestPlate = model.platesArray[ 0 ];
      let closestDistance = Math.abs( model.platesArray[ 0 ].position.x - chocolateBar.positionProperty.value.x );
      model.getActivePlates().forEach( plate => {
        if ( Math.abs( plate.position.x - chocolateBar.positionProperty.value.x ) < closestDistance ) {
          closestPlate = plate;
          closestDistance = Math.abs( plate.position.x - chocolateBar.positionProperty.value.x );
        }
      } );
      chocolateBar.positionProperty.set( new Vector2( closestPlate.position.x, -( closestPlate.chocolateBarsNumberProperty.value - 1 ) * ( chocolateBar.height + 1.5 ) ) );

    };

    const tablePlatesNodes = model.peopleArray.map( person => new TablePlateNode( person, { tandem: options.tandem.createTandem( `Person${person.linePlacement + 1}` ) } ) );

    const peopleImages = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];
    const people = tablePlatesNodes.map( ( plate, i ) => new PersonImage( peopleImages[ i ], plate,
      { visibleProperty: plate.visibleProperty, tandem: options.tandem.createTandem( `person${i + 1}` ) } ) );

    const peopleLayerNode = new Node( {
      children: people,
      excludeInvisibleChildrenFromBounds: true
    } );

    const paperPlatesNodes = model.platesArray.map( plate => new PaperPlateNode( plate, chocolateBarDropped, { tandem: options.tandem.createTandem( `plate${plate.linePlacement + 1}` ) } ) );

    const tableNode = new TableNode( { y: MeanShareAndBalanceConstants.PEOPLE_CENTER_Y } );

    const noteBookPaper = new NoteBookPaperNode();

    const chocolateLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...tablePlatesNodes, ...paperPlatesNodes ]
    } );

    const combinedOptions = combineOptions<ScreenViewOptions>( { children: [ noteBookPaper, peopleLayerNode, tableNode, chocolateLayerNode ] }, options );

    super( model, meanShareAndBalanceStrings.levelingOutQuestionStringProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, combinedOptions );

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerPlayAreaNodes = () => {
      chocolateLayerNode.centerX = playAreaCenterX;
      peopleLayerNode.centerX = playAreaCenterX - 45;
      tableNode.centerX = chocolateLayerNode.centerX - 10;
      tableNode.y = chocolateLayerNode.bottom - 130;
      noteBookPaper.centerX = chocolateLayerNode.centerX - 10;
      noteBookPaper.y = chocolateLayerNode.top - 30;
    };

    model.numberOfPeopleProperty.link( () => {
      centerPlayAreaNodes();
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

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );