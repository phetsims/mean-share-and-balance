// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the Leveling Out Screen. Contains people and their chocolates on a plate, as well as a sketch representation
 * of chocolates that can be dragged and 'leveled out'.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutScreenViewOptions = SelfOptions & StrictOmit<MeanShareAndBalanceScreenViewOptions, 'children'>;

// constants
const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const controlPanel = new LevelingOutControlPanel( model, model.meanCalculationDialogVisibleProperty, {
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20,
      tandem: options.tandem.createTandem( 'controlPanel' )
    } );

    const tableNode = new TableNode();

    // REVIEW: lowercase b
    const notebookPaper = new NoteBookPaperNode();

    // To constrain the dragging of chocolate nodes in the upper area, we need to track the bounds of the paper
    // But since the chocolateLayerNode changes its horizontal position to keep things centered for varying
    // numbers of people, we must coordinate the drag bounds when that changes.
    // This is in the coordinate frame of the chocolateLayerNode.
    // This initial value is not in the correct coordinate frame but it is specified correctly before the end of the
    // constructor
    const notebookPaperBoundsProperty = new Property( notebookPaper.bounds );

    // function for what chocolate bars should do at the end of their drag
    const chocolateBarDropped = ( chocolateBar: DraggableChocolate ) => {
      const platesWithSpace = model.getPlatesWithSpace( model.getActivePlates() );

      // find the plate closest to where the chocolate bar was dropped.
      const closestPlate = _.minBy( platesWithSpace, plate => Math.abs( platesWithSpace[ 0 ].position.x - chocolateBar.chocolateBar.positionProperty.value.x ) );

      assert && assert( closestPlate !== undefined, 'There should always be a plate with space when a bar is dropped' );

      // set dropped chocolate bar's position
      const numberOfChocolatesOnPlate = model.getActivePlateStateChocolates( closestPlate! ).length;
      const oldY = chocolateBar.chocolateBar.positionProperty.value.y;
      const y = closestPlate!.position.y - ( ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 2 ) * ( numberOfChocolatesOnPlate + 1 ) );
      chocolateBar.chocolateBar.positionProperty.set( new Vector2( closestPlate!.position.x, y ) );

      // swap chocolates if parentPlate changes, so that each person always has the same number of inactive + active chocolates
      // so that when their spinner is incremented, they can promote their own inactive chocolate to active.
      const currentParent = chocolateBar.chocolateBar.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveChocolateForSwap = model.getBottomInactiveChocolateOnPlate( closestPlate! );
        inactiveChocolateForSwap.positionProperty.set( new Vector2( currentParent.position.x, oldY ) );
        inactiveChocolateForSwap.parentPlateProperty.set( currentParent );
      }

      chocolateBar.chocolateBar.parentPlateProperty.set( closestPlate! );
    };


    // Creating the bottom representation of chocolates on the table
    const tablePlatesNodes = model.peopleArray.map( person => new TablePlateNode( person, {
      tandem: options.tandem.createTandem( `person${person.linePlacement + 1}` )
    } ) );

    const people = tablePlatesNodes.map( ( plate, i ) => {
      const selectedImage = PEOPLE_IMAGES[ i ];
      assert && assert( selectedImage, `No corresponding image for index: ${i}` );
      return new PersonImage( selectedImage, plate, {
        visibleProperty: plate.visibleProperty, tandem: options.tandem.createTandem( `person${i + 1}` )
      } );
    } );

    const peopleLayerNode = new Node( {
      children: people,

      // The entire node containing people is centered.  If the invisible people contribute to the bounds, then when
      // only one person is showing, they will be way off to the left.
      excludeInvisibleChildrenFromBounds: true
    } );

    // Creating the top representation of chocolates on the paper
    const paperPlatesNodes = model.platesArray.map( plate => new PaperPlateNode( plate, chocolateBarDropped, {
      tandem: options.tandem.createTandem( `plate${plate.linePlacement + 1}` )
    } ) );

    const chocolateBarsParentTandem = options.tandem.createTandem( 'chocolateBars' );
    const draggableChocolateBars = model.chocolatesArray.map( ( chocolate, i ) =>
      new DraggableChocolate( model, chocolate, notebookPaperBoundsProperty, chocolateBarDropped, {
        tandem: chocolateBarsParentTandem.createTandem( `chocolateBar${i + 1}` ),
        visibleProperty: chocolate.isActiveProperty
      } ) );

    // This contains all the chocolates from the top (paper) representation and the bottom (table) representation.
    const chocolateLayerNode = new Node( {

      // See peopleLayerNode.excludeInvisibleChildrenFromBounds comment
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...tablePlatesNodes, ...paperPlatesNodes, ...draggableChocolateBars ]
    } );

    const meanCalculationDialog = new MeanCalculationDialog(
      model.peopleArray,
      model.meanCalculationDialogVisibleProperty,
      notebookPaper.bounds
    );

    const superOptions = optionize<LevelingOutScreenViewOptions, SelfOptions, ScreenViewOptions>()( { children: [ notebookPaper, peopleLayerNode, tableNode, chocolateLayerNode ] }, options );

    super( model, MeanShareAndBalanceStrings.levelingOutQuestionStringProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, superOptions );

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerPlayAreaNodes = () => {

      // The chocolateLayerNode and peopleLayerNode bounds change when the number of people change, due to excludeInvisibleChildrenFromBounds
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

    // Don't include the questionBar in the usable bounds
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
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );