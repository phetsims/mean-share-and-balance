// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the Distribute Screen. Contains a table with people, each of whom have a plate with candy bars
 * on them. It also includes a notepad that also show plates and candy bars that can be dragged and 'leveled out'.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import DistributeModel, { NOTEPAD_PLATE_BOTTOM_Y } from '../model/DistributeModel.js';
import { HighlightPath, Image, InteractiveHighlightingNode, ManualConstraint, Node, Rectangle } from '../../../../scenery/js/imports.js';
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
import Utils from '../../../../dot/js/Utils.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Shape } from '../../../../kite/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanPredictionLine from '../../common/view/MeanPredictionLine.js';
import SnackStacker from '../../common/SnackStacker.js';
import GroupSortInteractionModel from '../../../../scenery-phet/js/accessibility/group-sort/model/GroupSortInteractionModel.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import dragIndicatorHand_png from '../../../../scenery-phet/images/dragIndicatorHand_png.js';
import Snack from '../../common/model/Snack.js';
import grabCandyBarV2_mp3 from '../../../sounds/grabCandyBarV2_mp3.js';
import releaseCandyBarV2_mp3 from '../../../sounds/releaseCandyBarV2_mp3.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type DistributeScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType' | 'snackAccessibleName'>;

// constants
const CANDY_BAR_FOCUS_X_MARGIN = 10; // in screen coords, empirically determined
const CUEING_ARROW_SCALE = 0.7;
export const MOUSE_CUEING_ARROW_MARGIN = 2; // in screen coords, empirically determined
export const KEYBOARD_CUEING_ARROW_MARGIN = -2; // in screen coords, empirically determined

export default class DistributeScreenView extends SharingScreenView<Snack> {
  private readonly notepadBoundsProperty: Property<Bounds2>;

  // class members needed for the group sort interaction
  private readonly groupSortInteractionView: GroupSortInteractionView<Snack, NotepadCandyBarNode>;
  private readonly groupSortInteractionModel: GroupSortInteractionModel<Snack>;
  private readonly keyboardSortCueNode: Node;
  private readonly mouseSortIndicatorArrowNode: Node;
  private readonly cueingHighlight: Node;
  private readonly modelToNotepadTransform: ModelViewTransform2;

  public constructor( private readonly model: DistributeModel, providedOptions: DistributeScreenViewOptions ) {

    const options = optionize<DistributeScreenViewOptions, SelfOptions, WithRequired<SharingScreenViewOptions, 'meanWithRemainderProperty'>>()( {
      snackType: 'candyBars',
      predictMeanVisibleProperty: model.predictMeanVisibleProperty,
      meanWithRemainderProperty: model.meanWithRemainderProperty,
      snackAccessibleName: MeanShareAndBalanceStrings.a11y.candyBarsStringProperty
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
      totalVisibleProperty: model.totalVisibleProperty
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
        handProxy.top = arrowProxy.bottom + MOUSE_CUEING_ARROW_MARGIN;
      } );

    model.groupSortInteractionModel.registerUpdateSortCueNode( this.updateMouseSortCueNode.bind( this ) );
    model.groupSortInteractionModel.registerUpdateSortCueNode( this.updateKeyboardSortCueNode.bind( this ) );
    model.stackChangedEmitter.addListener( this.updateMouseSortCueNode.bind( this ) );
    model.stackChangedEmitter.addListener( this.updateKeyboardSortCueNode.bind( this ) );

    // Create the notepad plates and candy bars.
    const notepadPlateNodes = model.plates.map( plate => {
      plate.xPositionProperty.link( this.updateMouseSortCueNode.bind( this ) );
      plate.xPositionProperty.link( this.updateKeyboardSortCueNode.bind( this ) );
      return new DistributeNotepadPlateNode( plate, this.modelToNotepadTransform );
    } );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBarNodes' );
    const notepadCandyBarNodes = model.allSnacks.map( ( candyBar, i ) =>
      new NotepadCandyBarNode(
        candyBar,
        model.groupSortInteractionModel,
        this.modelToNotepadTransform,
        this.notepadBoundsProperty,
        this.candyBarDropped.bind( this ),
        {
          tandem: candyBarsParentTandem.createTandem( `candyBarNode${i + 1}` ),
          visibleProperty: candyBar.isActiveProperty
        }
      )
    );
    const notepadCandyBarsHighlightNode = new InteractiveHighlightingNode( {
      children: notepadCandyBarNodes,
      excludeInvisibleChildrenFromBounds: true
    } );

    const stackValueDependencies: Property<number>[] = model.plates.map( plate => plate.snacksOnNotepadPlate.lengthProperty );
    const currentStackIndexProperty = DerivedProperty.deriveAny( [ model.groupSortInteractionModel.selectedGroupItemProperty, ...stackValueDependencies ], () => {
      const selectedItem = model.groupSortInteractionModel.selectedGroupItemProperty.value;
      return selectedItem === null ? 0 : model.groupSortInteractionModel.getGroupItemValue( selectedItem );
    } );
    const stackHeightProperty = new DerivedProperty( [ currentStackIndexProperty, model.groupSortInteractionModel.selectedGroupItemProperty ], stackNumber => {
      if ( stackNumber === null ) {
        return 0;
      }
      return model.plates[ stackNumber ].snacksOnNotepadPlate.lengthProperty.value;
    } );
    const patternValues = {
      currentStack: currentStackIndexProperty,
      totalStacks: model.numberOfPlatesProperty,
      stackHeight: stackHeightProperty
    };
    const sharedOptions = {
      maps: {
        currentStack: ( value: number | null ) => value === null ? 0 : value + 1 // If value is null there are no candy bars to grab and this string will not appear.
      }
    };
    const selectingCandyBarPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.a11y.selectingCandyBarPatternStringProperty, patternValues, sharedOptions );
    const sortingCandyBarPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.a11y.sortingCandyBarPatternStringProperty, patternValues, sharedOptions );
    Multilink.multilink( [
      model.groupSortInteractionModel.isGroupItemKeyboardGrabbedProperty,
      model.totalSnacksProperty,
      model.groupSortInteractionModel.selectedGroupItemProperty,
      currentStackIndexProperty
    ], ( isGrabbed, totalSnacks ) => {
      if ( totalSnacks === 0 ) {
        notepadCandyBarsHighlightNode.accessibleName = MeanShareAndBalanceStrings.a11y.noCandyBarsToGrabStringProperty;
      }
      else {
        notepadCandyBarsHighlightNode.accessibleName = isGrabbed ? sortingCandyBarPatternStringProperty : selectingCandyBarPatternStringProperty;
      }
    } );
    this.notepadSnackLayerNode.addChild( this.cueingHighlight );
    this.notepadSnackLayerNode.addChild( notepadCandyBarsHighlightNode );
    this.notepadSnackLayerNode.addChild( mouseSortCueNode );
    this.notepadSnackLayerNode.addChild( this.keyboardSortCueNode );

    // Create predict mean line that acts as a slider for alternative input.
    const predictMeanModelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( 0, 0 ),
      new Vector2( this.playAreaCenterX,
        NOTEPAD_PLATE_BOTTOM_Y - MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height - MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ),
      MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING
    );

    const meanPredictionLine = new MeanPredictionLine(
      model.meanPredictionProperty,
      model.predictMeanDragRange,
      model.snacksDistributedProperty,
      model.meanValueProperty,
      model.successIndicatorsOperatingProperty,
      predictMeanModelViewTransform,
      {
        visibleProperty: model.predictMeanVisibleProperty,
        meanTolerance: 0.5,
        roundingInterval: 0.1,

        // We have to hide the mean prediction line manually when the info panel is visible so that we cannot navigate
        // to it when the info panel is covering the line.
        pdomVisibleProperty: DerivedProperty.not( model.meanInfoPanelVisibleProperty ),

        // phet-io
        tandem: options.tandem.createTandem( 'meanPredictionLine' ),
        phetioDocumentation: 'Line user can drag to predict water level mean.'
      }
    );
    meanPredictionLine.addLinkedElement( model.successIndicatorsOperatingProperty );

    // Update line length and dilation based on the number of objects.
    model.numberOfPlatesProperty.link( () => {
      const activePlates = model.getActivePlates();
      const firstPlate = activePlates[ 0 ];
      const lastPlate = activePlates[ activePlates.length - 1 ];
      meanPredictionLine.updateLine(
        firstPlate.xPositionProperty.value - MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2,
        lastPlate.xPositionProperty.value + MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width / 2
      );
    } );
    this.notepadSnackLayerNode.addChild( meanPredictionLine );

    // Create sound players from grab and release during group sort interactions.
    const grabSoundClip = new SoundClip( grabCandyBarV2_mp3, {
      initialOutputLevel: MeanShareAndBalanceConstants.GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( grabSoundClip );
    const releaseSoundClip = new SoundClip( releaseCandyBarV2_mp3, {
      initialOutputLevel: MeanShareAndBalanceConstants.GRAB_RELEASE_SOUND_LEVEL
    } );
    soundManager.addSoundGenerator( releaseSoundClip );

    this.groupSortInteractionView = new GroupSortInteractionView(
      model.groupSortInteractionModel,
      notepadCandyBarsHighlightNode,
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
        getGroupItemToSelect: () => model.getFirstAvailableSnack(),
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
          const parentPlate = model.getPlateForSnack( candyBar );
          const parentPlateIndex = model.plates.indexOf( parentPlate! );
          const platesWithSpace = model.getPlatesWithSpace();
          let newPlate = model.plates[ newPlateIndex ];

          if ( assert ) {
            const topCandyBar = parentPlate!.getTopSnack();
            assert && assert( topCandyBar === candyBar, 'the selected candy bar should be the top one' );
          }

          // If the new plate is full, find the next plate with space.
          if ( !platesWithSpace.includes( newPlate ) ) {
            const sortDirection = Math.sign( newPlateIndex - model.plates.indexOf( parentPlate! ) );
            newPlate = _.reduce( platesWithSpace, ( closestPlate, plate ) => {
              const closestPlateIndex = model.plates.indexOf( closestPlate );
              const indexOfPlate = model.plates.indexOf( plate );

              // Find the closest plate in the direction of the sort that is not the parent plate.
              if ( Math.sign( indexOfPlate - parentPlateIndex ) === sortDirection
                   && plate !== parentPlate
                   && ( Math.abs( indexOfPlate - parentPlateIndex ) < Math.abs( closestPlateIndex - parentPlateIndex )
                        || closestPlate === parentPlate ) ) {
                closestPlate = plate;
              }
              return closestPlate;

              // If there are no other plates with space, the candy bar should return to the plate it came from.
            }, parentPlate! );
          }

          // Remove the candy bar from the current plate and add it to the top of the new plate.
          parentPlate!.removeSnack( candyBar );
          newPlate.addSnackToTop( candyBar );
        },
        onGrab: () => grabSoundClip.play(),
        onRelease: () => releaseSoundClip.play()
      }
    );

    // The candy bars are not a child of the notepad, so we have to hide them manually when the info panel is visible
    // (overlaps the notepad).
    notepadCandyBarsHighlightNode.pdomVisibleProperty = DerivedProperty.not( model.meanInfoPanelVisibleProperty );

    const focusHighlightWidthProperty = new DerivedProperty( [ model.numberOfPlatesProperty ], numberOfPlates => {
      const firstPlateXPosition = model.getPlateXPosition( numberOfPlates, 0 );
      const lastPlateXPosition = model.getPlateXPosition( numberOfPlates, numberOfPlates - 1 );
      return lastPlateXPosition - firstPlateXPosition + MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.width;
    } );
    focusHighlightWidthProperty.link( highlightWidth => {
      const focusRect = Shape.rect(
        this.notepadSnackLayerNode.visibleLocalBounds.x - CANDY_BAR_FOCUS_X_MARGIN,

        // Empirically determined to sit below the total readout, but have enough vertical space for 10 candy bars.
        this.notepad.boundsProperty.value.y + 80,

        highlightWidth + 2 * CANDY_BAR_FOCUS_X_MARGIN,
        this.notepad.boundsProperty.value.height - 100 // empirically determined
      );
      this.groupSortInteractionView.groupSortGroupFocusHighlightPath.setShape( focusRect );

      this.groupSortInteractionView.grabReleaseCueNode.centerBottom = new Vector2(
        focusRect.bounds.centerX,
        focusRect.bounds.minY
      );
    } );
  }

  /**
   * Handle a candy bar being dropped in the notepad by mouse or touch.
   */
  private candyBarDropped( candyBarNode: NotepadCandyBarNode ): void {

    const candyBar = candyBarNode.candyBar;

    // Only process the candy bar if it is active.  It generally will be, but in some multitouch cases where the
    // dragging was interrupted, it may not.
    if ( candyBar.isActiveProperty.value ) {

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
          SnackStacker.getCueingArrowPosition( plate, MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height,
            MOUSE_CUEING_ARROW_MARGIN )
        );
      }
      else {
        this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = false;
      }
    }
    else {
      const selectedCandyBar = this.groupSortInteractionModel.selectedGroupItemProperty.value;
      const plate = this.model.getPlateForSnack( selectedCandyBar );

      // Update the position of the mouse cue.  Note that it's legit for the snack to not be on a plate - this can occur
      // when the snack is moving between plates or being removed altogether from the model.
      if ( plate ) {
        const topCandyBarIndex = plate.snacksOnNotepadPlate.length - 1;
        const highlightPosition = this.modelToNotepadTransform.modelToViewPosition(
          SnackStacker.getStackedCandyBarPosition( plate.xPositionProperty.value, topCandyBarIndex )
        );
        this.cueingHighlight.x = highlightPosition.x;
        this.cueingHighlight.y = highlightPosition.y;
        this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = true;
        this.mouseSortIndicatorArrowNode.centerBottom = this.modelToNotepadTransform.modelToViewPosition(
          SnackStacker.getCueingArrowPosition( plate, MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height,
            MOUSE_CUEING_ARROW_MARGIN )
        );
      }
      else {
        this.groupSortInteractionModel.mouseSortCueVisibleProperty.value = false;
      }
    }
  }

  /**
   * Update the position of the keyboard sort cue node based on the model's state.
   */
  private updateKeyboardSortCueNode(): void {
    const selectedCandyBar = this.groupSortInteractionModel.selectedGroupItemProperty.value;
    if ( !this.groupSortInteractionModel.hasKeyboardSortedGroupItemProperty.value && selectedCandyBar ) {
      const plate = this.model.getPlateForSnack( selectedCandyBar );

      // Note that it's possible that the candy bar won't be on a plate.  This can happen if it's being moved from one
      // plate to another or being removed from the model altogether.
      if ( plate ) {

        // Update the position of the keyboard sort cue node to be with the selected candy bar.
        this.keyboardSortCueNode.centerBottom = this.modelToNotepadTransform.modelToViewPosition(
          SnackStacker.getCueingArrowPosition( plate, MeanShareAndBalanceConstants.NOTEPAD_PLATE_DIMENSION.height,
            KEYBOARD_CUEING_ARROW_MARGIN )
        );
      }
    }
  }
}

meanShareAndBalance.register( 'DistributeScreenView', DistributeScreenView );