// Copyright 2022-2024, University of Colorado Boulder

/**
 * Representation for the Leveling Out Screen. Contains a table with people, each of whom have a plate with candy bars
 * on them.  It also includes a notepad that also show plates and candy bars that can be dragged and 'leveled out'.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import { InteractiveHighlightingNode } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import LevelingOutNotepadPlateNode from './LevelingOutNotepadPlateNode.js';
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
import SnackStacker from '../../common/SnackStacker.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Vector2 } from '../../../../dot/js/imports.js';
import { Shape } from '../../../../kite/js/imports.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

const CANDY_BAR_FOCUS_X_MARGIN = 10;
export default class LevelingOutScreenView extends SharingScreenView {
  private readonly notepadBoundsProperty: Property<Bounds2>;
  private readonly groupSortInteractionView: GroupSortInteractionView<CandyBar, NotepadCandyBarNode>;

  public constructor( model: LevelingOutModel, providedOptions: LevelingOutScreenViewOptions ) {

    const options = optionize<LevelingOutScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'candyBars'
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
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

    super(
      model,
      MeanShareAndBalanceStrings.levelingOutQuestionStringProperty,
      MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty,
      notepadNode,
      options
    );

    // Calculate the bounds for constraining the dragging of the candy bars in the notepad.
    this.notepadBoundsProperty = new Property( new Bounds2(
      -this.notepad.bounds.width / 2,
      -this.notepad.height + this.notepad.bounds.maxY - LevelingOutModel.NOTEPAD_PLATE_CENTER_Y,
      this.notepad.width / 2,
      this.notepad.bounds.maxY - LevelingOutModel.NOTEPAD_PLATE_CENTER_Y
    ) );

    // function for what candy bars should do at the end of their drag
    const candyBarDropped = ( candyBarNode: NotepadCandyBarNode ) => {
      const platesWithSpace = model.getPlatesWithSpace( model.getActivePlates() );

      // Find the notepadPlate closest to where the candy bar was dropped.
      const closestPlate = _.minBy(
        platesWithSpace,
        plate => Math.abs( plate.xPositionProperty.value - candyBarNode.candyBar.positionProperty.value.x )
      );
      assert && assert( closestPlate !== undefined, 'There should always be a plate with space when a bar is dropped.' );

      // Swap candy bars if parentPlate changes. Each person always has the same total number of candy bars so
      // that when their spinner is incremented, they can promote their own inactive candy bar to active.
      const currentParent = candyBarNode.candyBar.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveCandyBarForSwap = model.getBottomInactiveCandyBarAssignedToPlate( closestPlate! );
        assert && assert( inactiveCandyBarForSwap,
          `There are no inactive candy bars on the plate ${closestPlate!.linePlacement}` );
        inactiveCandyBarForSwap!.parentPlateProperty.set( currentParent );
        candyBarNode.candyBar.parentPlateProperty.set( closestPlate! );
      }
      else {

        // When the parent plate stays the same we need to animate back to the top of the stack
        candyBarNode.candyBar.moveTo(
          SnackStacker.getStackedCandyBarPosition(
            closestPlate,
            model.getNumberOfCandyBarsStackedOnPlate( closestPlate )
          ),
          true
        );
      }
    };

    // Create the nodes on the notepad that represent the plates in the model.
    const modelToNotepadTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, LevelingOutModel.NOTEPAD_PLATE_CENTER_Y ),
      1
    );
    const notepadPlateNodes = model.plates.map( plate => new LevelingOutNotepadPlateNode( plate, modelToNotepadTransform, {
      tandem: options.tandem.createTandem( `notepadPlate${plate.linePlacement + 1}` )
    } ) );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBarNodes' );
    const notepadCandyBarNodes = model.snacks.map( ( candyBar, i ) =>
      new NotepadCandyBarNode( model, candyBar, modelToNotepadTransform, this.notepadBoundsProperty, candyBarDropped, {
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
            'active candy bars is: ' + model.getActiveCandyBars().length
          );
          assert && assert(
            candyBar.parentPlateProperty.value,
            'the selected candyBar does not have a parent plate - how did that happen?'
          );
          const currentIndex = platesWithSnacks.indexOf( candyBar.parentPlateProperty.value! );
          const nextPlate = Utils.clamp( currentIndex + delta, 0, platesWithSnacks.length - 1 );
          const topCandyBar = model.getTopActiveCandyBarAssignedToPlate( platesWithSnacks[ nextPlate ] );
          return topCandyBar!;
        },
        getGroupItemToSelect: () => model.getTopActiveCandyBarAssignedToPlate( model.plates[ 0 ] ),
        getNodeFromModelItem: candyBar => {
          const node = notepadCandyBarNodes.find( candyBarNode => candyBarNode.candyBar === candyBar );
          assert && assert( node !== undefined, 'A candyBar model must have an associated node' );
          return node!;
        },
        sortingRangeProperty: model.sortingRangeProperty,
        sortGroupItem: ( candyBar, newPlateIndex ) => candyBar.parentPlateProperty.set( model.plates[ newPlateIndex ] )
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

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );