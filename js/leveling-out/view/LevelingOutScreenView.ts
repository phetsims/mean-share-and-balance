// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the Leveling Out Screen. Contains people and their chocolates on a plate, as well as a sketch representation
 * of chocolates that can be dragged and 'leveled out'.
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
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
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
import Property from '../../../../axon/js/Property.js';
import MeanCalculationDialog from './MeanCalculationDialog.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenViewOptions = SelfOptions & PickRequired<MeanShareAndBalanceScreenViewOptions, 'tandem'> & StrictOmit<ScreenViewOptions, 'children'>;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;


    const controlPanel = new LevelingOutControlPanel( model, model.meanCalculationDialogVisibleProperty, {
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20,
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const tableNode = new TableNode( { y: MeanShareAndBalanceConstants.PEOPLE_CENTER_Y } );

    const notebookPaper = new NoteBookPaperNode();
    const notebookPaperBoundsProperty = new Property( notebookPaper.bounds );

    // function for what chocolate bars should do at the end of their drag
    const chocolateBarDropped = ( chocolateBar: DraggableChocolate ) => {
      let closestPlate = model.getPlatesWithSpace( model.getActivePlates() )[ 0 ];
      const platesWithSpace = model.getPlatesWithSpace( model.getActivePlates() );
      let closestDistance = Math.abs( platesWithSpace[ 0 ].position.x - chocolateBar.chocolateBarModel.positionProperty.value.x );

      // find the plate closest to where the chocolate bar was dropped.
      platesWithSpace.forEach( plate => {
        if ( Math.abs( plate.position.x - chocolateBar.chocolateBarModel.positionProperty.value.x ) < closestDistance ) {
          closestPlate = plate;
          closestDistance = Math.abs( plate.position.x - chocolateBar.chocolateBarModel.positionProperty.value.x );
        }
      } );

      // set dropped chocolate bar's position
      const numberOfChocolatesOnPlate = model.getActivePlateStateChocolates( closestPlate ).length;
      const oldY = chocolateBar.chocolateBarModel.positionProperty.value.y;
      const y = closestPlate.position.y - ( ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 2 ) * ( numberOfChocolatesOnPlate + 1 ) );
      chocolateBar.chocolateBarModel.positionProperty.set( new Vector2( closestPlate.position.x, y ) );

      //swap chocolates if parentPlate changes
      const currentParent = chocolateBar.chocolateBarModel.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveChocolateForSwap = model.getBottomInactiveChocolateOnPlate( closestPlate );
        inactiveChocolateForSwap.positionProperty.set( new Vector2( currentParent.position.x, oldY ) );
        inactiveChocolateForSwap.parentPlateProperty.set( currentParent );
      }

      chocolateBar.chocolateBarModel.parentPlateProperty.set( closestPlate );
    };


    // Creating the bottom representation of chocolates on the table
    const tablePlatesNodes = model.peopleArray.map( person => new TablePlateNode( person, { tandem: options.tandem.createTandem( `Person${person.linePlacement + 1}` ) } ) );

    const peopleImages = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];
    const people = tablePlatesNodes.map( ( plate, i ) => new PersonImage( peopleImages[ i ], plate,
      { visibleProperty: plate.visibleProperty, tandem: options.tandem.createTandem( `person${i + 1}` ) } ) );

    const peopleLayerNode = new Node( {
      children: people,
      excludeInvisibleChildrenFromBounds: true
    } );

    // Creating the top representation of chocolates on the paper
    const paperPlatesNodes = model.platesArray.map( plate => new PaperPlateNode( plate, chocolateBarDropped, { tandem: options.tandem.createTandem( `plate${plate.linePlacement + 1}` ) } ) );

    const chocolateBarsParentTandem = options.tandem.createTandem( 'chocolateBars' );
    const draggableChocolateBars = model.chocolatesArray.map( ( chocolate, i ) => new DraggableChocolate( model, chocolate, notebookPaperBoundsProperty, chocolateBarDropped, {
      tandem: chocolateBarsParentTandem.createTandem( `chocolateBar${i + 1}` ),
      visibleProperty: chocolate.isActiveProperty
    } ) );

    const chocolateLayerNode = new Node( {
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...tablePlatesNodes, ...paperPlatesNodes, ...draggableChocolateBars ]
    } );

    const meanCalculationDialog = new MeanCalculationDialog( model.peopleArray, model.meanCalculationDialogVisibleProperty );

    const combinedOptions = combineOptions<ScreenViewOptions>( { children: [ notebookPaper, peopleLayerNode, tableNode, chocolateLayerNode ] }, options );

    super( model, MeanShareAndBalanceStrings.levelingOutQuestionStringProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, combinedOptions );

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerPlayAreaNodes = () => {
      chocolateLayerNode.centerX = playAreaCenterX;
      peopleLayerNode.centerX = playAreaCenterX - 45;
      tableNode.centerX = chocolateLayerNode.centerX - 10;
      tableNode.y = chocolateLayerNode.bottom - 120;
      notebookPaper.centerX = chocolateLayerNode.centerX;
      meanCalculationDialog.centerX = chocolateLayerNode.centerX;

      // Transform to the bounds of the chocolate, since they are in an intermediate layer
      notebookPaperBoundsProperty.value = chocolateLayerNode.globalToLocalBounds( notebookPaper.globalBounds );
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
    this.addChild( meanCalculationDialog );

    this.meanCalculationDialogVisibleProperty = model.meanCalculationDialogVisibleProperty;
  }

  public override reset(): void {
    super.reset();
  }

}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );