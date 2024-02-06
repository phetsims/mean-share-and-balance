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
import NotepadWithReadoutNode from './NotepadWithReadoutNode.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
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

export type SnackType = 'candyBars' | 'apples';

type SelfOptions = {
  snackType: SnackType;
  showSyncButton?: boolean;
};

export type SharingScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];
export const SNACK_OFFSET = 10;

export default class SharingScreenView extends MeanShareAndBalanceScreenView {
  protected readonly notepad: Node;
  private readonly tableNode: Node;
  protected readonly tablePlateNodes: Node[];
  private readonly peopleLayerNode: Node;
  private readonly meanCalculationDialog: Dialog;
  protected readonly playAreaCenterX: number;

  public constructor(
    model: SharingModel<Snack>,
    questionBarStringProperty: TReadOnlyProperty<string>,
    questionBarColor: TColor,
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

    // Create notepad.
    const notepad = new NotepadWithReadoutNode(
      model.totalSnacksProperty,
      MeanShareAndBalanceStrings.totalCandyBarsPatternStringProperty,
      MeanShareAndBalanceStrings.barStringProperty,
      MeanShareAndBalanceStrings.barsStringProperty
    );

    const meanCalculationDialog = new MeanCalculationDialog(
      model.plates,
      model.meanCalculationDialogVisibleProperty,
      notepad.bounds,
      providedOptions.tandem.createTandem( 'meanCalculationDialog' )
    );

    // Create table nodes and layers.
    const tableNode = new PartyTableNode();

    // Create the visual representation of the plates that sit on the table.
    const tablePlateNodes = model.plates.map( plate => new TablePlateNode( plate, {
      snackType: providedOptions.snackType,
      tandem: providedOptions.tandem.createTandem( `tablePlate${plate.linePlacement + 1}` )
    } ) );

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

    options.children = [ peopleLayerNode, tableNode, notepad, meanCalculationDialog ];

    super( model, questionBarStringProperty, questionBarColor, options );

    this.tableNode = tableNode;
    this.notepad = notepad;
    this.tablePlateNodes = tablePlateNodes;
    this.peopleLayerNode = peopleLayerNode;

    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH +
                                       MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    this.playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

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
  }

  protected centerPlayAreaNodes(): void {
    this.notepad.centerX = this.playAreaCenterX;
    this.tableNode.centerX = this.playAreaCenterX;

    // We want the people to be slightly to the left of their snacks.
    this.peopleLayerNode.centerX = this.playAreaCenterX - 30;

    this.meanCalculationDialog.centerX = this.playAreaCenterX;
  }
}

meanShareAndBalance.register( 'SharingScreenView', SharingScreenView );