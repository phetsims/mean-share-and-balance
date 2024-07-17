// Copyright 2024, University of Colorado Boulder
/**
 * The base screen view for the Distribute Screen and the Fair Share Screen.
 * Both screens have:
 * - A table with people, each of whom have a plate with snack(s) on them.
 * - A notepad that also shows plates and snacks
 * - A mean calculation info panel that shows the mean calculation of the snacks in the play area
 * - A number spinner that allows the user to change the number of people
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from './MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SharingModel from '../model/SharingModel.js';
import Snack from '../model/Snack.js';
import optionize from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import { AlignBox, Node, PDOMValueType, TColor } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SharingControls from './SharingControls.js';
import MeanInfoPanel from './MeanInfoPanel.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PersonImage from '../../distribute/view/PersonImage.js';
import TablePlateNode from './TablePlateNode.js';
import NotepadNode from './NotepadNode.js';
import PartyTableNode from './PartyTableNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import SoccerCommonImages from '../../../../soccer-common/js/SoccerCommonImages.js';
import { MeanWithRemainder } from '../../distribute/model/DistributeModel.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

export type SnackType = 'candyBars' | 'apples';

type SelfOptions = {
  snackType: SnackType;
  showSyncButton?: boolean;
  predictMeanVisibleProperty?: Property<boolean> | null;
  meanWithRemainderProperty?: TReadOnlyProperty<MeanWithRemainder> | null;
  snackAccessibleName: PDOMValueType;
};

export type SharingScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

// constants
const PEOPLE_IMAGES = [
  SoccerCommonImages.kicker01StandingImageProperty, SoccerCommonImages.kicker02StandingImageProperty,
  SoccerCommonImages.kicker03StandingImageProperty, SoccerCommonImages.kicker04StandingImageProperty,
  SoccerCommonImages.kicker05StandingImageProperty, SoccerCommonImages.kicker06StandingImageProperty,
  SoccerCommonImages.kicker07StandingImageProperty ];

// Offset for positioning individual people relative to the plate with which each is associated, in screen coordinates.
const PEOPLE_LAYER_X_OFFSET = -80;

export default class SharingScreenView<T extends Snack> extends MeanShareAndBalanceScreenView {

  // Layers upon which other nodes will be placed.
  protected notepadSnackLayerNode: Node;

  // Various nodes used to depict visual elements in the view.
  protected readonly tablePlateNodes: Node[];

  // Controls for view's settings.
  protected readonly controls: SharingControls;

  public constructor( model: SharingModel<T>,
                      questionBarStringProperty: LocalizedStringProperty,
                      questionBarColor: TColor,
                      notepadNode: NotepadNode,
                      providedOptions: SharingScreenViewOptions ) {

    const options = optionize<SharingScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()( {
        showSyncButton: true,
        predictMeanVisibleProperty: null,
        meanWithRemainderProperty: null
      },
      providedOptions
    );

    super( model, questionBarStringProperty, questionBarColor, notepadNode, options );

    // Position and add the notepad.
    notepadNode.centerX = this.playAreaCenterX;
    notepadNode.centerY = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y;

    // Create the controls.
    this.controls = new SharingControls( model, model.meanInfoPanelVisibleProperty, notepadNode.bottom, {
      tandem: providedOptions.tandem.createTandem( 'controls' ),
      showSyncButton: options.showSyncButton,
      predictMeanVisibleProperty: options.predictMeanVisibleProperty,
      onInfoButtonPressed: () => {
        meanInfoPanel.closeButton.focus();
      },
      snackAccessibleName: options.snackAccessibleName
    } );

    // Create table node upon which the table plates will be shown.
    const tableNode = new PartyTableNode( {
      centerX: this.playAreaCenterX,
      y: MeanShareAndBalanceConstants.PARTY_TABLE_Y
    } );

    // Create the layer where the snacks and the plates that appear on the table will reside.
    const tableSnackLayerNode = new Node();
    const notepadSnackLayerNode = new Node();

    const calculationDependencies = [
      ...model.plates.map( plate => plate.isActiveProperty ),
      ...model.plates.map( plate => plate.tableSnackNumberProperty )
    ];

    // Create the info panel that will show the various ways to calculate the mean.
    const meanInfoPanel = new MeanInfoPanel(
      calculationDependencies,
      model.meanValueProperty,
      () => model.getActivePlates().map( plate => plate.tableSnackNumberProperty.value ),
      () => model.getActivePlates().length,
      model.meanInfoPanelVisibleProperty,
      notepadNode.bounds,
      () => this.controls.infoButton!.focus(),
      {
        calculatedMeanDisplayMode: options.snackType === 'candyBars' ? 'remainder' : 'mixedFraction',
        meanWithRemainderProperty: options.meanWithRemainderProperty,
        centerX: this.playAreaCenterX,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        tandem: providedOptions.tandem.createTandem( 'meanInfoPanel' )
      }
    );

    const tableCenter = new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.TABLE_PLATE_CENTER_Y );

    // Create a closure that can be used to interrupt user interactions with the snacks if the number of snacks changes.
    const interruptSnackDragging = () => {
      notepadSnackLayerNode.interruptSubtreeInput();
    };

    // Create the visual representation of the plates that sit on the table.
    const tablePlateParentTandem = providedOptions.tandem.createTandem( 'tablePlates' );
    const tablePlateNodes = model.plates.map( plate => {
      const personPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.a11y.personSnackPatternStringProperty, {
        index: plate.linePlacement + 1,
        snack: options.snackAccessibleName
      } );
      return new TablePlateNode<T>( plate, tableCenter, {
        snackType: providedOptions.snackType,
        snackQuantitySoundPlayerOptions: {
          initialOutputLevel: providedOptions.snackType === 'candyBars' ? 0.2 : 0.1
        },
        interruptIncompatibleInteractions: interruptSnackDragging,
        numberPickerAccessibleName: personPatternStringProperty,
        tandem: tablePlateParentTandem.createTandem( `tablePlate${plate.linePlacement + 1}` )
      } );
    } );
    tablePlateNodes.forEach( tablePlateNode => { tableSnackLayerNode.addChild( tablePlateNode ); } );

    // Create the images of the people that stand near the plates.
    const people: Node[] = tablePlateNodes.map( ( plate, i ) => {
      const selectedImageProperty = PEOPLE_IMAGES[ i ];
      assert && assert( selectedImageProperty, `No corresponding image for index: ${i}` );
      return new PersonImage( selectedImageProperty, plate, { visibleProperty: plate.visibleProperty } );
    } );

    const peopleLayerNode = new Node( { children: people } );

    // Use the position of the first plate, which by design is always visible, to set the position of the people.
    model.plates[ 0 ].xPositionProperty.link( firstPlateXPosition => {
      peopleLayerNode.left = tableCenter.x + firstPlateXPosition + PEOPLE_LAYER_X_OFFSET;
    } );

    this.tablePlateNodes = tablePlateNodes;
    this.notepadSnackLayerNode = notepadSnackLayerNode;

    // Don't include the questionBar in the usable bounds.
    const simAreaWithoutQuestionBar = new Bounds2(
      this.layoutBounds.minX,
      this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX,
      this.layoutBounds.maxY
    );

    const controlsAlignBox = new AlignBox( this.controls, {
      alignBounds: simAreaWithoutQuestionBar,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    // Interrupt dragging of the snacks if the number of plates changes, since it could mean that the snack being
    // dragged has ceased to exist.
    model.numberOfPlatesProperty.link( () => {
      interruptSnackDragging();
    } );

    // Add all the children.  This is done all at once so that the z-order is apparent and easily adjusted.
    const children = [
      notepadNode,
      peopleLayerNode,
      tableNode,
      tableSnackLayerNode,
      notepadSnackLayerNode,
      controlsAlignBox,
      meanInfoPanel
    ];
    children.forEach( childNode => { this.addChild( childNode ); } );

    // Set the PDOM navigation order.
    this.msabSetPDOMOrder(
      [ notepadSnackLayerNode ],
      [ ...this.tablePlateNodes, this.controls.numberSpinner ],
      [ ...this.controls.controlsPDOMOrder, meanInfoPanel ]
    );
  }
}

meanShareAndBalance.register( 'SharingScreenView', SharingScreenView );