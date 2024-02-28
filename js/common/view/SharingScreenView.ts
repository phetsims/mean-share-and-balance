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
import TablePlateNode from './TablePlateNode.js';
import person1_png from '../../../images/person1_png.js';
import person2_png from '../../../images/person2_png.js';
import person3_png from '../../../images/person3_png.js';
import person4_png from '../../../images/person4_png.js';
import person5_png from '../../../images/person5_png.js';
import person6_png from '../../../images/person6_png.js';
import person7_png from '../../../images/person7_png.js';
import NotepadNode from './NotepadNode.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';

export type SnackType = 'candyBars' | 'apples';

type SelfOptions = {
  snackType: SnackType;
  showSyncButton?: boolean;
};

export type SharingScreenViewOptions = SelfOptions & MeanShareAndBalanceScreenViewOptions;

const PEOPLE_IMAGES = [ person1_png, person2_png, person3_png, person4_png, person5_png, person6_png, person7_png ];

export default class SharingScreenView extends MeanShareAndBalanceScreenView {

  // Layers upon which other nodes will be placed.
  private readonly peopleLayerNode: Node;
  protected readonly tableSnackLayerNode: Node;
  protected readonly notepadSnackLayerNode: Node;

  // Various nodes used to depict visual elements in the view.
  private readonly tableNode: Node;
  protected readonly tablePlateNodes: Node[];
  private readonly meanCalculationDialog: Dialog;
  private readonly controls: SharingControls;

  // An animation that can be created to move the layers that hold the plates and snacks.
  private layerPositionAnimation: Animation | null = null;

  public constructor( model: SharingModel<Snack>,
                      questionBarStringProperty: TReadOnlyProperty<string>,
                      questionBarColor: TColor,
                      notepadNode: NotepadNode,
                      providedOptions: SharingScreenViewOptions ) {

    const options = optionize<SharingScreenViewOptions, SelfOptions, MeanShareAndBalanceScreenViewOptions>()(
      { showSyncButton: true },
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
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
        tandem: providedOptions.tandem.createTandem( 'meanCalculationDialog' )
      }
    );

    // Create table node upon which the table plates will be shown.
    const tableNode = new PartyTableNode();

    // Create the layer where the snacks and the plates that appear on the tablewill reside.
    const tableSnackLayerNode = new Node( {

      // The entire node containing snacks is centered.  If the invisible snacks contribute to the bounds, then
      // centering won't work correctly.
      excludeInvisibleChildrenFromBounds: true
    } );

    // Create the layer where the snacks and the plates that appear on the notepad will reside.
    const notepadSnackLayerNode = new Node( {

      // The entire node containing snacks is centered.  If the invisible snacks contribute to the bounds, then
      // centering won't work correctly.
      excludeInvisibleChildrenFromBounds: true
    } );

    // Create the visual representation of the plates that sit on the table.
    const tablePlateNodes = model.plates.map( plate => new TablePlateNode( plate, {
      snackType: providedOptions.snackType,
      tandem: providedOptions.tandem.createTandem( `tablePlate${plate.linePlacement + 1}` )
    } ) );
    tablePlateNodes.forEach( tablePlateNode => { tableSnackLayerNode.addChild( tablePlateNode ); } );

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
      children: [ peopleLayerNode, tableNode, notepadNode, tableSnackLayerNode, notepadSnackLayerNode, meanCalculationDialog ]
    } );

    super( model, questionBarStringProperty, questionBarColor, notepadNode, superOptions );

    // Position the notepad.
    notepadNode.centerX = this.playAreaCenterX;
    notepadNode.centerY = MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y;

    // Position the table.
    tableNode.centerX = this.playAreaCenterX;

    // Position the dialog.  TODO: Move this to initialization after restructure, see https://github.com/phetsims/mean-share-and-balance/issues/149.
    meanCalculationDialog.centerX = this.playAreaCenterX;

    this.tableNode = tableNode;
    this.tablePlateNodes = tablePlateNodes;
    this.peopleLayerNode = peopleLayerNode;
    this.tableSnackLayerNode = tableSnackLayerNode;
    this.notepadSnackLayerNode = notepadSnackLayerNode;
    this.controls = controls;

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
    this.addChild( controlsAlignBox );

    this.msabSetPDOMOrder( [ this.notepadSnackLayerNode ], this.tablePlateNodes, controls.controlsPDOMOrder );
  }

  /**
   * Update the X positions of the nodes in the play area.  This is generally done when something changes, such as the
   * number of people shown, that requires the nodes to be shifted such that things stay centered on the table and/or
   * the notepad.
   */
  protected updatePlayAreaLayerPositions(): void {

    // If there is an animation in progress, stop it.
    if ( this.layerPositionAnimation ) {
      this.layerPositionAnimation.stop();
    }

    const currentCenterX = this.tableSnackLayerNode.centerX;
    const targetCenterX = this.playAreaCenterX;

    // Create a new animation to update the layer positions.
    this.layerPositionAnimation = new Animation( {
      from: currentCenterX,
      to: targetCenterX,
      setValue: xPosition => {

        // Set the positions of the layers.
        this.tableSnackLayerNode.centerX = xPosition;

        if ( this.notepadSnackLayerNode.centerX !== this.playAreaCenterX ) {
          this.notepadSnackLayerNode.centerX = xPosition;
        }

        // We want the people to be slightly to the left of their snacks, hence the offset.
        this.peopleLayerNode.centerX = xPosition - 40;
      },
      duration: 0.5,
      easing: Easing.CUBIC_OUT
    } );

    const finish = () => {
      this.layerPositionAnimation = null;
    };

    // handlers for when the animation completes
    this.layerPositionAnimation.finishEmitter.addListener( finish );
    this.layerPositionAnimation.stopEmitter.addListener( finish );

    // Kick off the animation.
    this.layerPositionAnimation.start();
  }
}

meanShareAndBalance.register( 'SharingScreenView', SharingScreenView );