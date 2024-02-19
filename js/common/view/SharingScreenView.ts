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
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import PartyTableNode from './PartyTableNode.js';
import Dialog from '../../../../sun/js/Dialog.js';
import { AlignBox, Node, TColor } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import SharingControls from './SharingControls.js';
import MeanCalculationDialog from '../../leveling-out/view/MeanCalculationDialog.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PersonImage from '../../leveling-out/view/PersonImage.js';
import TablePlateNode from '../../leveling-out/view/TablePlateNode.js';
import person1_png from '../../../images/person1_png.js';
import person2_png from '../../../images/person2_png.js';
import person3_png from '../../../images/person3_png.js';
import person4_png from '../../../images/person4_png.js';
import person5_png from '../../../images/person5_png.js';
import person6_png from '../../../images/person6_png.js';
import person7_png from '../../../images/person7_png.js';
import NotepadNode from './NotepadNode.js';

export type SnackType = 'candyBars' | 'apples';

type SelfOptions = {
  snackType: SnackType;
  showSyncButton?: boolean;
};

export type SharingScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];

export default class SharingScreenView extends MeanShareAndBalanceScreenView {
  private readonly tableNode: Node;
  protected readonly tablePlateNodes: Node[];
  private readonly peopleLayerNode: Node;
  private readonly meanCalculationDialog: Dialog;
  private readonly controls: Node;

  // the layer where the snacks will be shown for both the table and the notepad
  protected readonly snackLayerNode: Node;

  public constructor(
    model: SharingModel<Snack>,
    questionBarStringProperty: TReadOnlyProperty<string>,
    questionBarColor: TColor,
    notepadNode: NotepadNode,
    providedOptions: SharingScreenViewOptions ) {

    const options = optionize<SharingScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()(
      {
        showSyncButton: true
      },
      providedOptions
    );

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

    const meanCalculationDialog = new MeanCalculationDialog(
      model.plates,
      model.meanCalculationDialogVisibleProperty,
      notepadNode.bounds,
      providedOptions.tandem.createTandem( 'meanCalculationDialog' )
    );

    // Create table node upon which the table plates will be shown.
    const tableNode = new PartyTableNode();

    // Create the layer where the snacks and the plates that hold them will be shown.
    const snackLayerNode = new Node( {

      // The entire node containing snacks is centered.  If the invisible snacks contribute to the bounds, then
      // centering won't work correctly.
      excludeInvisibleChildrenFromBounds: true
    } );

    // Create the visual representation of the plates that sit on the table.
    const tablePlateNodes = model.plates.map( plate => new TablePlateNode( plate, {
      snackType: providedOptions.snackType,
      tandem: providedOptions.tandem.createTandem( `tablePlate${plate.linePlacement + 1}` )
    } ) );
    tablePlateNodes.forEach( tablePlateNode => { snackLayerNode.addChild( tablePlateNode ); } );

    // TODO: Do the people images need to be instrumented? https://github.com/phetsims/mean-share-and-balance/issues/140
    const people: Node[] = tablePlateNodes.map( ( plate, i ) => {
      const selectedImage = PEOPLE_IMAGES[ i ];
      assert && assert( selectedImage, `No corresponding image for index: ${i}` );
      return new PersonImage( selectedImage, plate, {
        visibleProperty: plate.visibleProperty, tandem: providedOptions.tandem.createTandem( `person${i + 1}` )
      } );
    } );

    const peopleLayerNode = new Node( {
      children: people,

      // The entire node containing people is centered.  If the invisible people contribute to the bounds, then when
      // only one person is showing, they will be way off to the left.
      excludeInvisibleChildrenFromBounds: true
    } );

    const superOptions = combineOptions<MeanShareAndBalanceScreenViewOptions>( options, {
      children: [ peopleLayerNode, tableNode, notepadNode, meanCalculationDialog, snackLayerNode ]
    } );

    super( model, questionBarStringProperty, questionBarColor, notepadNode, superOptions );

    // Position the notepad.
    notepadNode.centerX = this.playAreaCenterX;
    notepadNode.centerY = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y;

    // Position the table.
    tableNode.centerX = this.playAreaCenterX;

    this.tableNode = tableNode;
    this.tablePlateNodes = tablePlateNodes;
    this.peopleLayerNode = peopleLayerNode;
    this.snackLayerNode = snackLayerNode;
    this.controls = controls;

    // Don't include the questionBar in the usable bounds.
    const playAreaBounds = new Bounds2( this.layoutBounds.minX, this.layoutBounds.minY + this.questionBar.height,
      this.layoutBounds.maxX, this.layoutBounds.maxY );

    const controlsAlignBox = new AlignBox( controls, {
      alignBounds: playAreaBounds,
      xAlign: 'right',
      yAlign: 'top',
      rightMargin: MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      topMargin: MeanShareAndBalanceConstants.CONTROLS_VERTICAL_MARGIN
    } );

    model.numberOfPlatesProperty.link( () => {
      this.interruptSubtreeInput();
    } );

    this.meanCalculationDialog = meanCalculationDialog;
    this.addChild( controlsAlignBox );

    this.msabSetPDOMOrder( [ this.snackLayerNode ], this.tablePlateNodes, controls.controlsPDOMOrder );
  }

  protected centerPlayAreaNodes(): void {
    this.snackLayerNode.centerX = this.playAreaCenterX;

    // We want the people to be slightly to the left of their snacks.
    this.peopleLayerNode.centerX = this.playAreaCenterX - 40;

    this.meanCalculationDialog.centerX = this.playAreaCenterX;
  }
}

meanShareAndBalance.register( 'SharingScreenView', SharingScreenView );