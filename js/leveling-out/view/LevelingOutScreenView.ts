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
import { InteractiveHighlightingNode, Node } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadPlateNode from './NotepadPlateNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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
import { Shape } from '../../../../kite/js/imports.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

export default class LevelingOutScreenView extends SharingScreenView {
  private readonly candyBarLayerNode: Node;
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
      readoutPatternStringProperty: totalCandyBarsPatternStringProperty
    } );

    super(
      model,
      MeanShareAndBalanceStrings.levelingOutQuestionStringProperty,
      MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty,
      notepadNode,
      options );

    // To constrain the dragging of candy bar nodes in the upper area, we need to track the bounds of the paper. But
    // since the candyBarLayerNode changes its horizontal position to keep things centered for varying numbers of
    // people, we must coordinate the drag bounds when that changes.  This is in the coordinate frame of the
    // candyBarLayerNode.  This initial value is not in the correct coordinate frame, but it is specified correctly
    // before the end of the constructor.
    this.notepadBoundsProperty = new Property( this.notepad.bounds );

    // function for what candy bars should do at the end of their drag
    const candyBarDropped = ( candyBarNode: NotepadCandyBarNode ) => {
      const platesWithSpace = model.getPlatesWithSpace( model.getActivePlates() );

      // Find the notepadPlate closest to where the candy bar was dropped.
      const closestPlate = _.minBy(
        platesWithSpace, plate => Math.abs( plate.xPosition - candyBarNode.candyBar.positionProperty.value.x )
      );
      assert && assert( closestPlate !== undefined, 'There should always be a plate with space when a bar is dropped.' );

      // Swap candy bars if parentPlate changes. Each person always has the same total number of candy bars so
      // that when their spinner is incremented, they can promote their own inactive candy bar to active.
      const currentParent = candyBarNode.candyBar.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveCandyBarForSwap = model.getBottomInactiveCandyBarAssignedToPlate( closestPlate! );
        inactiveCandyBarForSwap.parentPlateProperty.set( currentParent );
        candyBarNode.candyBar.parentPlateProperty.set( closestPlate! );
      }
      else {
        // When the parent plate stays the same we need to animate back to the top of the stack
        const newY = LevelingOutModel.getCandyBarYPosition( model.getNumberOfCandyBarsStackedOnPlate( closestPlate ) );
        candyBarNode.candyBar.travelTo( new Vector2( closestPlate.xPosition, newY ) );
      }
    };

    // Create a node on the node pad to represent each plate in the model.
    const notepadPlateNodes = model.plates.map( plate => new NotepadPlateNode( plate, {
      tandem: options.tandem.createTandem( `notepadPlate${plate.linePlacement + 1}` )
    } ) );

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );
    const notepadCandyBars = model.snacks.map( ( candyBar, i ) =>
      new NotepadCandyBarNode( model, candyBar, this.notepadBoundsProperty, candyBarDropped, {
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${i + 1}` ),
          visibleProperty: candyBar.isActiveProperty
        }
      ) );
    const notepadCandyBarsNode = new InteractiveHighlightingNode( {
      focusable: true,
      tagName: 'div',
      children: notepadCandyBars,
      excludeInvisibleChildrenFromBounds: true
    } );

    // This contains all the candy bars from the top (notepad) snackType and the bottom (table) snackType.
    this.candyBarLayerNode = new Node( {

      // See peopleLayerNode.excludeInvisibleChildrenFromBounds comment
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...this.tablePlateNodes, ...notepadPlateNodes, notepadCandyBarsNode ]
    } );

    this.screenViewRootNode.addChild( this.candyBarLayerNode );

    this.groupSortInteractionView = new GroupSortInteractionView(
      model.groupSortInteractionModel,
      notepadCandyBarsNode,
      {
        getNextSelectedGroupItem: ( delta, candyBar ) => {
          const plateLinePlacement = candyBar.parentPlateProperty.value.linePlacement;
          const numberOfPlates = model.numberOfPlatesProperty.value;
          const nextPlate = Utils.clamp( plateLinePlacement + delta, 0, numberOfPlates - 1 );
          return model.getTopActiveCandyBarAssignedToPlate( model.plates[ nextPlate ] );
        },
        getGroupItemToSelect: () => model.getTopActiveCandyBarAssignedToPlate( model.plates[ 0 ] ),
        getNodeFromModelItem: candyBar => {
          const node = notepadCandyBars.find( candyBarNode => candyBarNode.candyBar === candyBar );
          assert && assert( node !== undefined, 'A candyBar model must have an associated node' );
          return node!;
        },
        sortingRangeProperty: model.sortingRangeProperty,
        sortGroupItem: ( candyBar, newPlateIndex ) => candyBar.parentPlateProperty.set( model.plates[ newPlateIndex ] )
      }
    );

    model.numberOfPlatesProperty.link( () => {
      this.centerPlayAreaNodes();
    } );

    // TODO: Clean this up, https://github.com/phetsims/mean-share-and-balance/issues/151
    this.screenViewRootNode.setPDOMOrder( [
      notepadCandyBarsNode,
      ...this.tablePlateNodes
    ] );
  }

  protected override centerPlayAreaNodes(): void {
    super.centerPlayAreaNodes();

    // The candyBarLayerNode and peopleLayerNode bounds change when the number of people change, due to excludeInvisibleChildrenFromBounds
    this.candyBarLayerNode.centerX = this.playAreaCenterX;

    // Transform to the bounds of the candy bar, since they are in an intermediate layer.
    this.notepadBoundsProperty.value = this.candyBarLayerNode.globalToLocalBounds( this.notepad.globalBounds );

    // TODO: clean up the shape of the highlight, see: https://github.com/phetsims/mean-share-and-balance/issues/137
    this.groupSortInteractionView.groupSortGroupFocusHighlightPath.shape = Shape.rect(
      this.candyBarLayerNode.localBounds.x - 10,
      this.notepadBoundsProperty.value.y + 80,
      this.candyBarLayerNode.localBounds.width + 10,
      this.notepadBoundsProperty.value.height - 100
    );
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );