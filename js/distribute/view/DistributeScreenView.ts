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
import DistributeModel from '../model/DistributeModel.js';
import { InteractiveHighlightingNode } from '../../../../scenery/js/imports.js';
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

type SelfOptions = EmptySelfOptions;
type DistributeScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

const CANDY_BAR_FOCUS_X_MARGIN = 10;
export default class DistributeScreenView extends SharingScreenView<CandyBar> {
  private readonly notepadBoundsProperty: Property<Bounds2>;
  private readonly groupSortInteractionView: GroupSortInteractionView<CandyBar, NotepadCandyBarNode>;

  public constructor( model: DistributeModel, providedOptions: DistributeScreenViewOptions ) {

    const options = optionize<DistributeScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'candyBars',
      predictMeanVisibleProperty: model.predictMeanVisibleProperty
    }, providedOptions );

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

    // Calculate the bounds for constraining the dragging of the candy bars in the notepad.
    this.notepadBoundsProperty = new Property( new Bounds2(
      -this.notepad.bounds.width / 2,
      -this.notepad.height + this.notepad.bounds.maxY - DistributeModel.NOTEPAD_PLATE_BOTTOM_Y,
      this.notepad.width / 2,
      this.notepad.bounds.maxY - DistributeModel.NOTEPAD_PLATE_BOTTOM_Y
    ) );

    // function for what candy bars should do at the end of their drag
    const candyBarDropped = ( candyBarNode: NotepadCandyBarNode ) => {
      const candyBar = candyBarNode.candyBar;

      const platesWithSpace = model.getPlatesWithSpace();
      const plateHoldingSnack = model.getPlateForSnack( candyBarNode.candyBar );
      assert && assert( plateHoldingSnack, 'the candy bar must be on a plate' );

      // Set the flag that will ensure that the candy bars animate to the top of the stacks when dropped.
      model.animateAddedSnacks = true;

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
      model.animateAddedSnacks = false;
    };

    // Create the nodes on the notepad that represent the plates in the model.
    const modelToNotepadTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, DistributeModel.NOTEPAD_PLATE_BOTTOM_Y ),
      1
    );
    const notepadPlateNodes = model.plates.map( plate => new DistributeNotepadPlateNode(
      model.groupSortInteractionModel.hasGroupItemBeenSortedProperty, plate, modelToNotepadTransform, {
        tandem: options.tandem.createTandem( `notepadPlate${plate.linePlacement + 1}` )
      } ) );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBarNodes' );
    const notepadCandyBarNodes = model.getAllSnacks().map( ( candyBar, i ) =>
      new NotepadCandyBarNode( model.groupSortInteractionModel.hasMouseSortedGroupItemProperty,
        candyBar, modelToNotepadTransform, this.notepadBoundsProperty, candyBarDropped, {
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
    this.notepadSnackLayerNode.addChild( notepadCandyBarsNode );

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
          return topCandyBar!;
        },
        getGroupItemToSelect: () => model.plates[ 0 ].getTopSnack(),
        getNodeFromModelItem: candyBar => {
          const node = notepadCandyBarNodes.find( candyBarNode => candyBarNode.candyBar === candyBar );
          assert && assert( node !== undefined, 'A candyBar model must have an associated node' );
          return node!;
        },
        sortingRangeProperty: model.sortingRangeProperty,
        sortGroupItem: ( candyBar, newPlateIndex ) => {
          const currentPlate = model.getPlateForSnack( candyBar );
          const newPlate = model.plates[ newPlateIndex ];
          const topCandyBar = currentPlate?.removeTopSnack();
          assert && assert( topCandyBar === candyBar, 'the selected candy bar should be the top one' );
          newPlate.addSnackToTop( topCandyBar! );
        }
      }
    );

    this.notepadSnackLayerNode.boundsProperty.link( () => {
      const focusRect = Shape.rect(
        this.notepadSnackLayerNode.localBounds.x - CANDY_BAR_FOCUS_X_MARGIN,

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
}

meanShareAndBalance.register( 'DistributeScreenView', DistributeScreenView );