// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the Leveling Out Screen. Contains a table with people, each of whom have a plate with candy bars
 * on them.  It also includes a notepad that also show plates and candy bars that can be dragged and 'leveled out'.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import { AlignBox, Node } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadPlateNode from './NotepadPlateNode.js';
import LevelingOutControls from './LevelingOutControls.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import TablePlateNode from './TablePlateNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
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
import NotepadCandyBarNode from './NotepadCandyBarNode.js';
import NotepadWithReadoutNode from '../../common/view/NotepadWithReadoutNode.js';
import PartyTableNode from '../../common/view/PartyTableNode.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutScreenViewOptions = SelfOptions & StrictOmit<MeanShareAndBalanceScreenViewOptions, 'children'>;

// constants
const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];
const CANDY_BAR_OFFSET = 10;

export default class LevelingOutScreenView extends MeanShareAndBalanceScreenView {

  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = providedOptions;

    const levelingOutControls = new LevelingOutControls( model, model.meanCalculationDialogVisibleProperty, {
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20,
      tandem: options.tandem.createTandem( 'levelingOutControls' )
    } );

    const tableNode = new PartyTableNode();

    // REVIEW: lowercase b
    const notepad = new NotepadWithReadoutNode(
      model.totalSnacksProperty,
      MeanShareAndBalanceStrings.totalCandyBarsPatternStringProperty,
      MeanShareAndBalanceStrings.barStringProperty,
      MeanShareAndBalanceStrings.barsStringProperty
    );

    // To constrain the dragging of candy bar nodes in the upper area, we need to track the bounds of the paper. But
    // since the candyBarLayerNode changes its horizontal position to keep things centered for varying numbers of
    // people, we must coordinate the drag bounds when that changes.  This is in the coordinate frame of the
    // candyBarLayerNode.  This initial value is not in the correct coordinate frame, but it is specified correctly
    // before the end of the constructor.
    const notepadBoundsProperty = new Property( notepad.bounds );

    // function for what candy bars should do at the end of their drag
    const candyBarDropped = ( candyBarNode: NotepadCandyBarNode ) => {
      const platesWithSpace = model.getPlatesWithSpace( model.getActivePlates() );

      // Find the notepadPlate closest to where the candy bar was dropped.
      const closestPlate = _.minBy(
        platesWithSpace, plate => Math.abs( plate.xPosition - candyBarNode.candyBar.positionProperty.value.x )
      );

      assert && assert( closestPlate !== undefined, 'There should always be a plate with space when a bar is dropped.' );

      // Calculate and set the dropped candy bar's destination.
      const numberOfCandyBarsOnPlate = model.getNumberOfCandyBarsStackedOnPlate( closestPlate! );
      const oldY = candyBarNode.candyBar.positionProperty.value.y;
      const newY = MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y -
                ( ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + 2 ) * ( numberOfCandyBarsOnPlate + 1 ) );
      candyBarNode.candyBar.travelTo( new Vector2( closestPlate!.xPosition, newY ) );

      // Swap candy bars if parentPlate changes, so that each person always has the same total number of candy bars so
      // that when their spinner is incremented, they can promote their own inactive candy bar to active.
      const currentParent = candyBarNode.candyBar.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveCandyBarForSwap = model.getBottomInactiveCandyBarAssignedToPlate( closestPlate! );
        inactiveCandyBarForSwap.positionProperty.set( new Vector2( currentParent.xPosition, oldY ) );
        inactiveCandyBarForSwap.parentPlateProperty.set( currentParent );
      }

      candyBarNode.candyBar.parentPlateProperty.set( closestPlate! );
    };


    // Creating the bottom representation of candy bars on the table
    const tablePlateNodes = model.plates.map( person => new TablePlateNode( person, {
      tandem: options.tandem.createTandem( `tablePlate${person.linePlacement + 1}` )
    } ) );

    // TODO: Do the people images need to be instrumented? https://github.com/phetsims/mean-share-and-balance/issues/140
    const people = tablePlateNodes.map( ( plate, i ) => {
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

    // Create a node on the node pad to represent each plate in the model.
    const notepadPlateNodes = model.plates.map( plate => new NotepadPlateNode( plate, {
      tandem: options.tandem.createTandem( `notepadPlate${plate.linePlacement + 1}` )
    } ) );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );
    const notepadCandyBars = model.snacks.map( ( candyBar, i ) =>
      new NotepadCandyBarNode( model, candyBar, notepadBoundsProperty, candyBarDropped, {
        tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${i + 1}` ),
        visibleProperty: candyBar.isActiveProperty
      } ) );

    // This contains all the candy bars from the top (notepad) representation and the bottom (table) representation.
    const candyBarLayerNode = new Node( {

      // See peopleLayerNode.excludeInvisibleChildrenFromBounds comment
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...tablePlateNodes, ...notepadPlateNodes, ...notepadCandyBars ]
    } );

    const meanCalculationDialog = new MeanCalculationDialog(
      model.plates,
      model.meanCalculationDialogVisibleProperty,
      notepad.bounds,
      options.tandem.createTandem( 'meanCalculationDialog' )
    );

    const superOptions = optionize<LevelingOutScreenViewOptions, SelfOptions, ScreenViewOptions>()( { children: [ notepad, peopleLayerNode, tableNode, candyBarLayerNode ] }, options );

    super( model, MeanShareAndBalanceStrings.levelingOutQuestionStringProperty, MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty, superOptions );

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const centerPlayAreaNodes = () => {

      // The candyBarLayerNode and peopleLayerNode bounds change when the number of people change, due to excludeInvisibleChildrenFromBounds
      candyBarLayerNode.centerX = playAreaCenterX + CANDY_BAR_OFFSET;

      // We want the people to be slightly to the left of their candy bars.
      peopleLayerNode.centerX = playAreaCenterX - 30;
      tableNode.centerX = candyBarLayerNode.centerX - CANDY_BAR_OFFSET;

      notepad.centerX = candyBarLayerNode.centerX - CANDY_BAR_OFFSET;
      meanCalculationDialog.centerX = candyBarLayerNode.centerX;

      // Transform to the bounds of the candy bar, since they are in an intermediate layer.
      notepadBoundsProperty.value = candyBarLayerNode.globalToLocalBounds( notepad.globalBounds );
    };

    model.numberOfPlatesProperty.link( () => {
      centerPlayAreaNodes();
      this.interruptSubtreeInput();
    } );

    // Don't include the questionBar in the usable bounds
    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    const controlsAlignBox = new AlignBox( levelingOutControls, {
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