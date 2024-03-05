// Copyright 2024, University of Colorado Boulder
/**
 * The base screen view for the Leveling Out Screen and the Fair Share Screen.
 * Both screens have:
 * - A table with people, each of whom have a plate with a snack on them.
 * - A notepad that also shows plates and snacks
 * - A mean calculation dialog that shows the mean calculation of the snacks in the play area
 * - A control panel that allows the user to change the number of people
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
import Dialog from '../../../../sun/js/Dialog.js';
import { AlignBox, Node, TColor } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SharingControls from './SharingControls.js';
import MeanCalculationDialog from '../../leveling-out/view/MeanCalculationDialog.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PersonImage from '../../leveling-out/view/PersonImage.js';
import TablePlateNode from './TablePlateNode.js';
import person1_png from '../../../images/person1_png.js';
import person2_png from '../../../images/person2_png.js';
import person3_png from '../../../images/person3_png.js';
import person4_png from '../../../images/person4_png.js';
import person5_png from '../../../images/person5_png.js';
import person6_png from '../../../images/person6_png.js';
import person7_png from '../../../images/person7_png.js';
import NotepadNode from './NotepadNode.js';
import PartyTableNode from './PartyTableNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export type SnackType = 'candyBars' | 'apples';

type SelfOptions = {
  snackType: SnackType;
  showSyncButton?: boolean;
};

export type SharingScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

// constants
const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];

// Offset for positioning individual people relative to the plate with which each is associated, in screen coordinates.
const PEOPLE_LAYER_X_OFFSET = -70;

export default class SharingScreenView extends MeanShareAndBalanceScreenView {

  // Layers upon which other nodes will be placed.
  protected notepadSnackLayerNode: Node;
  private readonly peopleLayerNode: Node;

  // Various nodes used to depict visual elements in the view.
  protected readonly tablePlateNodes: Node[];
  private readonly meanCalculationDialog: Dialog;

  public constructor( model: SharingModel<Snack>,
                      questionBarStringProperty: TReadOnlyProperty<string>,
                      questionBarColor: TColor,
                      notepadNode: NotepadNode,
                      providedOptions: SharingScreenViewOptions ) {

    const options = optionize<SharingScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()(
      { showSyncButton: true },
      providedOptions
    );

    super( model, questionBarStringProperty, questionBarColor, notepadNode, options );

    // Position and add the notepad.
    notepadNode.centerX = this.playAreaCenterX;
    notepadNode.centerY = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y;

    // Create the controls.
    const controls = new SharingControls( model, model.meanCalculationDialogVisibleProperty, {
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20,
      tandem: providedOptions.tandem.createTandem( 'controls' ),
      showSyncButton: options.showSyncButton,
      meanAccordionBoxOptions: {
        snackType: providedOptions.snackType
      }
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
      ...model.plates.map( plate => plate.snackNumberProperty )
    ];

    // Create the dialog that will show the various ways to calculate the mean.
    const meanCalculationDialog = new MeanCalculationDialog(
      calculationDependencies,
      () => model.getActivePlates().map( plate => plate.snackNumberProperty.value ),
      () => model.getActivePlates().length,
      model.meanCalculationDialogVisibleProperty,
      notepadNode.bounds,
      {
        calculatedMeanDisplayMode: options.snackType === 'candyBars' ? 'decimal' : 'mixedFraction',
        centerX: this.playAreaCenterX,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        tandem: providedOptions.tandem.createTandem( 'meanCalculationDialog' )
      }
    );

    const tableCenter = new Vector2( this.playAreaCenterX, MeanShareAndBalanceConstants.TABLE_PLATE_CENTER_Y );

    // Create the visual representation of the plates that sit on the table.
    const tablePlateNodes = model.plates.map( plate => new TablePlateNode( plate, tableCenter, {
      snackType: providedOptions.snackType,
      tandem: providedOptions.tandem.createTandem( `tablePlate${plate.linePlacement + 1}` )
    } ) );
    tablePlateNodes.forEach( tablePlateNode => { tableSnackLayerNode.addChild( tablePlateNode ); } );

    // Create the images of the people that stand near the plates.
    // TODO: Do the people images need to be instrumented? https://github.com/phetsims/mean-share-and-balance/issues/140
    const people: Node[] = tablePlateNodes.map( ( plate, i ) => {
      const selectedImage = PEOPLE_IMAGES[ i ];
      assert && assert( selectedImage, `No corresponding image for index: ${i}` );
      return new PersonImage( selectedImage, plate, {
        visibleProperty: plate.visibleProperty, tandem: providedOptions.tandem.createTandem( `person${i + 1}` )
      } );
    } );

    const peopleLayerNode = new Node( { children: people } );

    // Use the position of the first plate, which by design is always visible, to set the position of the people.
    model.plates[ 0 ].xPositionProperty.link( firstPlateXPosition => {
      peopleLayerNode.left = tableCenter.x + firstPlateXPosition + PEOPLE_LAYER_X_OFFSET;
    } );

    // Position the dialog.  TODO: Move this to initialization after restructure, see https://github.com/phetsims/mean-share-and-balance/issues/149.
    meanCalculationDialog.centerX = this.playAreaCenterX;

    this.tablePlateNodes = tablePlateNodes;
    this.peopleLayerNode = peopleLayerNode;
    this.notepadSnackLayerNode = notepadSnackLayerNode;

    // Don't include the questionBar in the usable bounds.
    const simAreaWithoutQuestionBar = new Bounds2(
      this.layoutBounds.minX,
      this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX,
      this.layoutBounds.maxY
    );

    const controlsAlignBox = new AlignBox( controls, {
      alignBounds: simAreaWithoutQuestionBar,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    model.numberOfPlatesProperty.link( () => {
      this.interruptSubtreeInput();
    } );

    this.meanCalculationDialog = meanCalculationDialog;

    // Add all the children.  This is done all at once so that the layering of apparent and easily adjusted.
    const children = [
      notepadNode,
      peopleLayerNode,
      tableNode,
      tableSnackLayerNode,
      notepadSnackLayerNode,
      controlsAlignBox
    ];
    children.forEach( childNode => { this.addChild( childNode ); } );

    // Set the PDOM navigation order.
    this.msabSetPDOMOrder( [ notepadSnackLayerNode ], this.tablePlateNodes, controls.controlsPDOMOrder );
  }
}

meanShareAndBalance.register( 'SharingScreenView', SharingScreenView );