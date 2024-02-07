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
import { Node } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NotepadPlateNode from './NotepadPlateNode.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NotepadCandyBarNode from './NotepadCandyBarNode.js';
import SharingScreenView, { SharingScreenViewOptions, SNACK_OFFSET } from '../../common/view/SharingScreenView.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

export default class LevelingOutScreenView extends SharingScreenView {
  private readonly candyBarLayerNode: Node;
  private readonly notepadBoundsProperty: Property<Bounds2>;

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

    super(
      model,
      MeanShareAndBalanceStrings.levelingOutQuestionStringProperty,
      MeanShareAndBalanceColors.levelingOutQuestionBarColorProperty,
      totalCandyBarsPatternStringProperty,
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

      // Calculate and set the dropped candy bar's destination.
      const numberOfCandyBarsOnPlate = model.getNumberOfCandyBarsStackedOnPlate( closestPlate! );
      const oldY = candyBarNode.candyBar.positionProperty.value.y;
      const newY = LevelingOutModel.getCandyBarYPosition( numberOfCandyBarsOnPlate );
      candyBarNode.candyBar.travelTo( new Vector2( closestPlate!.xPosition, newY ) );

      // Swap candy bars if parentPlate changes, so that each person always has the same total number of candy bars so
      // that when their spinner is incremented, they can promote their own inactive candy bar to active.
      const currentParent = candyBarNode.candyBar.parentPlateProperty.value;
      if ( currentParent !== closestPlate ) {
        const inactiveCandyBarForSwap = model.getBottomInactiveCandyBarAssignedToPlate( closestPlate! );
        inactiveCandyBarForSwap.positionProperty.set( new Vector2( currentParent.xPosition, oldY ) );
        inactiveCandyBarForSwap.parentPlateProperty.set( currentParent );
      }

      candyBarNode.candyBar.parentPlateProperty.set( closestPlate! );
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

    // This contains all the candy bars from the top (notepad) snackType and the bottom (table) snackType.
    this.candyBarLayerNode = new Node( {

      // See peopleLayerNode.excludeInvisibleChildrenFromBounds comment
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...this.tablePlateNodes, ...notepadPlateNodes, ...notepadCandyBars ]
    } );

    this.addChild( this.candyBarLayerNode );
    model.numberOfPlatesProperty.link( () => {
      this.centerPlayAreaNodes();
    } );
  }

  protected override centerPlayAreaNodes(): void {
    super.centerPlayAreaNodes();

    // The candyBarLayerNode and peopleLayerNode bounds change when the number of people change, due to excludeInvisibleChildrenFromBounds
    this.candyBarLayerNode.centerX = this.playAreaCenterX + SNACK_OFFSET;

    // Transform to the bounds of the candy bar, since they are in an intermediate layer.
    this.notepadBoundsProperty.value = this.candyBarLayerNode.globalToLocalBounds( this.notepad.globalBounds );
  }
}

meanShareAndBalance.register( 'LevelingOutScreenView', LevelingOutScreenView );