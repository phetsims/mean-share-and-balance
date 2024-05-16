// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the Distribute Screen. Contains a table with people, each of whom have a plate with candy bars
 * on them.  It also includes a notepad that also show plates and candy bars that can be dragged and 'leveled out'.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import DistributeModel, { NOTEPAD_PLATE_BOTTOM_Y } from '../model/DistributeModel.js';
import { HighlightPath, Image, InteractiveHighlightingNode, ManualConstraint, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import DistributeNotepadPlateNode from './DistributeNotepadPlateNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NotepadCandyBarNode from './NotepadCandyBarNode.js';
import SharingScreenView, { SharingScreenViewOptions } from '../../common/view/SharingScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import NotepadNode from '../../common/view/NotepadNode.js';
import GroupSortInteractionView from '../../../../scenery-phet/js/accessibility/group-sort/view/GroupSortInteractionView.js';
import CandyBar from '../model/CandyBar.js';
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import PredictMeanSlider from '../../common/view/PredictMeanSlider.js';
import SnackStacker from '../../common/SnackStacker.js';
import GroupSortInteractionModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSortInteractionModel.js';
import selectionArpeggio009_mp3 from '../../../../tambo/sounds/selectionArpeggio009_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dragIndicatorHand_png from '../../../../scenery-phet/images/dragIndicatorHand_png.js';

type SelfOptions = EmptySelfOptions;
type DistributeScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

// constants
const CANDY_BAR_FOCUS_X_MARGIN = 10; // in screen coords, empirically determined
const CUEING_ARROW_SCALE = 0.7;
export const CUEING_ARROW_MARGIN = 2; // in screen coords, empirically determined

export default class DistributeScreenView extends SharingScreenView<CandyBar> {
  private readonly notepadBoundsProperty: Property<Bounds2>;

  // class members needed for the group sort interaction
  private readonly groupSortInteractionView: GroupSortInteractionView<CandyBar, NotepadCandyBarNode>;
  private readonly groupSortInteractionModel: GroupSortInteractionModel<CandyBar>;
  private readonly keyboardSortCueNode: Node;
  private readonly mouseSortIndicatorArrowNode: Node;
  private readonly cueingHighlight: Node;
  private readonly modelToNotepadTransform: ModelViewTransform2;

  public constructor( private readonly model: DistributeModel, providedOptions: DistributeScreenViewOptions ) {

    const options = optionize<DistributeScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'candyBars',
      predictMeanVisibleProperty: model.predictMeanVisibleProperty
    }, providedOptions );

    // Create the notepad and necessary pattern strings.
    const measurementStringProperty = new DerivedProperty( [ model.totalSnacksProperty,
        MeanShareAndBalanceStrings.barStringProperty,
        MeanShareAndBalanceStrings.barsStringProperty ],
      ( total, singular, plural ) => total === 1 ? singular : plural );
    const totalCandyBarsPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.totalCandyBarsPatternStringProperty, {
      total: model.totalSnacksProperty,
      measurement: measurementStringProperty
    } );
    const notepadNode = new NotepadNode( {
      readoutPatternStringProperty: totalCandyBarsPatternStringProperty,
      totalVisibleProperty: model.totalVisibleProperty,
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

    super(
      model,
      MeanShareAndBalanceStrings.distributeQuestionStringProperty,
      MeanShareAndBalanceColors.distributeQuestionBarColorProperty,
      notepadNode,
      options
    );

    this.modelToNotepadTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, NOTEPAD_PLATE_BOTTOM_Y ),
      1
    );

    // Calculate the bounds for constraining the dragging of the candy bars in the notepad.
    this.notepadBoundsProperty = new Property( new Bounds2(
      -this.notepad.bounds.width / 2,
      -this.notepad.height + this.notepad.bounds.maxY - NOTEPAD_PLATE_BOTTOM_Y,
      this.notepad.width / 2,
      this.notepad.bounds.maxY - NOTEPAD_PLATE_BOTTOM_Y
    ) );

    // Create and register sort cue nodes.
    this.groupSortInteractionModel = model.groupSortInteractionModel;
    this.keyboardSortCueNode = GroupSortInteractionView.createSortCueNode(
      model.groupSortInteractionModel.keyboardSortCueVisibleProperty, CUEING_ARROW_SCALE );
    this.mouseSortIndicatorArrowNode = GroupSortInteractionView.createSortCueNode(
      model.groupSortInteractionModel.mouseSortCueVisibleProperty, CUEING_ARROW_SCALE );
    const mouseSortHandCueNode = new Image( dragIndicatorHand_png, {
      scale: 0.06,
      visibleProperty: model.groupSortInteractionModel.mouseSortCueVisibleProperty,
      rotation: Math.PI / 4
    } );

    this.cueingHighlight = new Rectangle( -2, -1.5,
      MeanShareAndBalanceConstants.CANDY_BAR_WIDTH + 2, MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + 2, {
        stroke: HighlightPath.INNER_FOCUS_COLOR,
        lineWidth: 2,
        cornerRadius: 2,
        visibleProperty: model.groupSortInteractionModel.mouseSortCueVisibleProperty
      }
    );

    const mouseSortCueNode = new Node( {
      children: [ this.mouseSortIndicatorArrowNode, mouseSortHandCueNode ]
    } );

    ManualConstraint.create( mouseSortCueNode, [ this.mouseSortIndicatorArrowNode, mouseSortHandCueNode ],
      ( arrowProxy, handProxy ) => {

        // Pixel adjustments needed with rotation option on mouseSortHandCueNode and empirically determined to match design
        handProxy.right = arrowProxy.left + 22;
        handProxy.top = arrowProxy.bottom + CUEING_ARROW_MARGIN;
      } );


    model.groupSortInteractionModel.registerUpdateSortCueNode( this.updateMouseSortCueNode.bind( this ) );
    model.groupSortInteractionModel.registerUpdateSortCueNode( this.updateKeyboardSortCueNode.bind( this ) );
    model.stackChangedEmitter.addListener( this.updateMouseSortCueNode.bind( this ) );
    model.stackChangedEmitter.addListener( this.updateKeyboardSortCueNode.bind( this ) );

    const notepadPlateNodes = model.plates.map( plate => {
      plate.xPositionProperty.link( this.updateMouseSortCueNode.bind( this ) );
      plate.xPositionProperty.link( this.updateKeyboardSortCueNode.bind( this ) );
      return new DistributeNotepadPlateNode( plate, this.modelToNotepadTransform,
        {
          tandem: options.tandem.createTandem( `notepadPlate${plate.linePlacement + 1}` )
        } );
    } );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBarNodes' );
    const notepadCandyBarNodes = model.getAllSnacks().map( ( candyBar, i ) =>
      new NotepadCandyBarNode(
        candyBar,
        this.modelToNotepadTransform,
        this.notepadBoundsProperty,
        this.candyBarDropped.bind( this ),
        {
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${i + 1}` ),
          visibleProperty: candyBar.isActiveProperty
        }
      )
    );
    const notepadCandyBarsNode = new InteractiveHighlightingNode( {
      focusable: true,
      tagName: 'div',
      children: notepadCandyBarNodes,
      excludeInvisibleChildrenFromBounds: true
    } );

    this.notepadSnackLayerNode.addChild( this.cueingHighlight );
    this.notepadSnackLayerNode.addChild( notepadCandyBarsNode );
    this.notepadSnackLayerNode.addChild( mouseSortCueNode );
    this.notepadSnackLayerNode.addChild( this.keyboardSortCueNode );

    // Create predict mean line that acts as a slider for alternative input.
    const predictMeanModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ),
      new Vector2( this.playAreaCenterX,
        NOTEPAD_PLATE_BOTTOM_Y - MeanShareAndBalanceConstants.PLATE_DIMENSION.height - MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ),
      MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING
    );
    const meanPredictionSuccessSoundClip = new SoundClip( selectionArpeggio009_mp3, {
      initialOutputLevel: 0.1,
      enableControlProperties: [ DerivedProperty.not( ResetAllButton.isResettingAllProperty ) ]
    } );
    soundManager.addSoundGenerator( meanPredictionSuccessSoundClip );
    const createSuccessIndicatorMultilink = ( predictMeanLine: Path, successRectangle: Node ) => {
      Multilink.multilink( [ model.meanPredictionProperty, model.meanProperty, model.areSnacksDistributedProperty ],
        ( meanPrediction, meanValue, areSnacksDistributed ) => {

          const successRectangleWasVisible = successRectangle.visible;
          const successStrokeColorWasSet = predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty;

          if ( areSnacksDistributed ) {
            const meanTolerance = 0.5;
            const roundedPrediction = Utils.roundToInterval( meanPrediction, 0.1 );
            const roundedMean = Utils.roundToInterval( meanValue, 0.1 );
            const closeToMean = Utils.equalsEpsilon( roundedPrediction, roundedMean, meanTolerance );

            predictMeanLine.stroke = roundedPrediction === roundedMean ?
                                     MeanShareAndBalanceColors.meanColorProperty :
                                     MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN;
            successRectangle.visible = roundedPrediction !== roundedMean && closeToMean;
          }
          else {
            predictMeanLine.stroke = MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN;
            successRectangle.visible = false;
          }

          // If one of the success indicators was just activated, play the "successful prediction" sound.
          if ( model.predictMeanVisibleProperty.value && !successRectangleWasVisible && !successStrokeColorWasSet &&
               ( successRectangle.visible || predictMeanLine.stroke === MeanShareAndBalanceColors.meanColorProperty ) ) {
            meanPredictionSuccessSoundClip.play();
          }
        } );
    };

    const predictMeanSlider = new PredictMeanSlider(
      model.meanPredictionProperty, model.predictMeanDragRange,
      createSuccessIndicatorMultilink,
      predictMeanModelViewTransform,
      {
        visibleProperty: model.predictMeanVisibleProperty,
        valueProperty: model.meanPredictionProperty,

        // Constant range
        enabledRangeProperty: new Property( model.predictMeanDragRange ),

        // phet-io
        tandem: options.tandem.createTandem( 'predictMeanSlider' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );

    // Update line length and dilation based on the number of objects.
    model.numberOfPlatesProperty.link( () => {
      const activePlates = model.getActivePlates();
      const firstPlate = activePlates[ 0 ];
      const lastPlate = activePlates[ activePlates.length - 1 ];
      predictMeanSlider.updateLine(
        firstPlate.xPositionProperty.value,
        lastPlate.xPositionProperty.value + MeanShareAndBalanceConstants.PLATE_DIMENSION.width / 2
      );
    } );

    this.notepadSnackLayerNode.addChild( predictMeanSlider );

    this.groupSortInteractionView = new GroupSortInteractionView(
      model.groupSortInteractionModel,
      notepadCandyBarsNode,
      {
        getNextSelectedGroupItem: ( delta, candyBar ) => {
          const platesWithSnacks = model.getPlatesWithSnacks();
          assert && assert(
            platesWithSnacks.length !== 0,
            'In order to select the next group item there must be active candy bars. The number of' +
            'active candy bars is: ' + model.totalSnacksProperty.value
          );
          const plateContainingSnack = model.getPlateForSnack( candyBar );
          assert && assert( plateContainingSnack, 'snack must be on plate' );
          const currentIndex = platesWithSnacks.indexOf( plateContainingSnack! );
          const nextPlateIndex = Utils.clamp( currentIndex + delta, 0, platesWithSnacks.length - 1 );
          const topCandyBar = platesWithSnacks[ nextPlateIndex ].getTopSnack();
          assert && assert( topCandyBar, 'If a plate has a snack, there must be a top candy bar' );
          return topCandyBar!;
        },
        getGroupItemToSelect: () => model.plates[ 0 ].getTopSnack(),
        getNodeFromModelItem: candyBar => {
          const node = notepadCandyBarNodes.find( candyBarNode => candyBarNode.candyBar === candyBar );
          assert && assert( node !== undefined, 'A candyBar model must have an associated node' );
          return node!;
        },
        sortingRangeProperty: model.sortingRangeProperty,
        sortingRangeListener: range => {
          const selectedGroupItem = model.groupSortInteractionModel.selectedGroupItemProperty.value;
          if ( selectedGroupItem ) {
            const currentValue = model.groupSortInteractionModel.getGroupItemValue( selectedGroupItem );
            if ( !currentValue || !range.contains( currentValue ) ) {
              model.groupSortInteractionModel.selectedGroupItemProperty.value = model.plates[ 0 ].getTopSnack();
            }
          }
        },
        sortGroupItem: ( candyBar, newPlateIndex ) => {
          const currentPlate = model.getPlateForSnack( candyBar );
          const newPlate = model.plates[ newPlateIndex ];

          if ( assert ) {
            const topCandyBar = currentPlate!.getTopSnack();
            assert && assert( topCandyBar === candyBar, 'the selected candy bar should be the top one' );
          }

          // Remove the candy bar from the current plate and add it to the top of the new plate.
          currentPlate!.removeSnack( candyBar );
          newPlate.addSnackToTop( candyBar );
        }
      }
    );

    this.notepadSnackLayerNode.boundsProperty.link( () => {
      const focusRect = Shape.rect(
        this.notepadSnackLayerNode.visibleLocalBounds.x - CANDY_BAR_FOCUS_X_MARGIN,

        // Empirically determined to sit below the total readout, but have enough vertical space for 10 candy bars.
        this.notepad.boundsProperty.value.y + 80,

        this.notepadSnackLayerNode.visibleLocalBounds.width + 2 * CANDY_BAR_FOCUS_X_MARGIN,
        this.notepad.boundsProperty.value.height - 100 // empirically determined
      );
      this.groupSortInteractionView.groupSortGroupFocusHighlightPath.setShape( focusRect );

      this.groupSortInteractionView.grabReleaseCueNode.centerBottom = new Vector2(
        focusRect.bounds.centerX,
        focusRect.bounds.minY
      );
    } );
  }

  // Handle a candy bar being dropped in the notepad.
  private candyBarDropped( candyBarNode: NotepadCandyBarNode ): void {
    const candyBar = candyBarNode.candyBar;

    const platesWithSpace = this.model.getPlatesWithSpace();
    const plateHoldingSnack = this.model.getPlateForSnack( candyBarNode.candyBar );
    assert && assert( plateHoldingSnack, 'the candy bar must be on a plate' );

    // Set the flag that will ensure that the candy bars animate to the top of the stacks when dropped.
    this.model.animateAddedSnacks = true;

    // Even if there are no plates with space the plate our candy bar came from should always have space for the candy
    // bar to return.
    !platesWithSpace.includes( plateHoldingSnack! ) && platesWithSpace.push( plateHoldingSnack! );

    // Find the plate closest to where the candy bar was dropped.
    const closestPlate = platesWithSpace.reduce(
      ( previousPlate, thisPlate ) => {
        const candyBarXPosition = candyBar.positionProperty.value.x;
        const distanceToThisPlate = Math.abs( thisPlate.xPositionProperty.value - candyBarXPosition );
        const distanceToPreviousPlate = Math.abs( previousPlate.xPositionProperty.value - candyBarXPosition );
        return distanceToThisPlate < distanceToPreviousPlate ? thisPlate : previousPlate;
      },
      platesWithSpace[ 0 ]
    );

    if ( closestPlate !== plateHoldingSnack ) {

      // If the candy bar was dropped on a different plate, update the groupSortInteractionModel in order to remove
      // any related visual cues.
      this.model.groupSortInteractionModel.setMouseSortedGroupItem( true );

      // Move the candy bar to the new plate, since it's closer.
      plateHoldingSnack!.removeSnack( candyBar );
      closestPlate.addSnackToTop( candyBar );
    }
    else {
      assert && assert( plateHoldingSnack.hasSnack( candyBar ), 'this situation should be impossible' );

      // Put the candy bar back on the same plate.
      candyBar.moveTo( plateHoldingSnack.getStackingPositionForSnack( candyBar ), true );
    }

    // Clear the flag for animating added snacks, since any adding due to the drop action should now be complete.
    this.model.animateAddedSnacks = false;
  }

  // Update the visibility and position of the mouse sort cue node based on the model's state.
  private updateMouseSortCueNode(): void {
    if ( this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value ||
         this.groupSortInteractionModel.isKeyboardFocusedProperty.value ) {
      this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = false;
    }
    else if ( this.groupSortInteractionModel.selectedGroupItemProperty.value === null ) {
      const plate = this.model.getPlateWithMostSnacks();
      if ( plate ) {
        this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = true;
        const topCandyBarIndex = plate.snacksOnNotepadPlate.length - 1;
        const highlightPosition = this.modelToNotepadTransform.modelToViewPosition(
          SnackStacker.getStackedCandyBarPosition( plate.xPositionProperty.value, topCandyBarIndex )
        );
        this.cueingHighlight.x = highlightPosition.x;
        this.cueingHighlight.y = highlightPosition.y;
        this.mouseSortIndicatorArrowNode.centerBottom = this.modelToNotepadTransform.modelToViewPosition(
          SnackStacker.getCueingArrowPosition( plate, MeanShareAndBalanceConstants.PLATE_DIMENSION.height )
        );
      }
      else {
        this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = false;
      }
    }
    else {
      const selectedCandyBar = this.groupSortInteractionModel.selectedGroupItemProperty.value;
      const plate = this.model.getPlateForSnack( selectedCandyBar );
      assert && assert( plate, 'selected candy bar must be on a plate' );
      this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = true;
      this.mouseSortIndicatorArrowNode.centerBottom = this.modelToNotepadTransform.modelToViewPosition(
        SnackStacker.getCueingArrowPosition( plate!, MeanShareAndBalanceConstants.PLATE_DIMENSION.height )
      );
    }
  }

  private updateKeyboardSortCueNode(): void {
    const selectedCandyBar = this.groupSortInteractionModel.selectedGroupItemProperty.value;
    if ( !this.groupSortInteractionModel.hasGroupItemBeenSortedProperty.value && selectedCandyBar ) {
      const plate = this.model.getPlateForSnack( selectedCandyBar );
      assert && assert( plate, 'selected candy bar must be on a plate' );
      this.keyboardSortCueNode.centerBottom = this.modelToNotepadTransform.modelToViewPosition(
        SnackStacker.getCueingArrowPosition( plate!, MeanShareAndBalanceConstants.PLATE_DIMENSION.height )
      );
    }
  }
}

meanShareAndBalance.register( 'DistributeScreenView', DistributeScreenView );