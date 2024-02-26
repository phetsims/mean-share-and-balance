// Copyright 2024, University of Colorado Boulder

/**
 * Representation for the "Fair Share" Screen. Contains a table with people, each of whom have a plate with apples
 * on them.  It also includes a notepad that also show plates and apples that can be synced, collected, or shared.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FairShareModel, { NotepadMode } from '../model/FairShareModel.js';
import SharingScreenView, { SharingScreenViewOptions } from '../../common/view/SharingScreenView.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FairShareNotepadNode from './FairShareNotepadNode.js';
import FairShareNotepadPlateNode from './FairShareNotepadPlateNode.js';
import NotepadAppleNode from './NotepadAppleNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;
type FairShareScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

export default class FairShareScreenView extends SharingScreenView {

  public constructor( model: FairShareModel, providedOptions: FairShareScreenViewOptions ) {

    const options = optionize<FairShareScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'apples',
      showSyncButton: false
    }, providedOptions );

    // Create the string that will be used to describe the apples on the notepad, e.g. "Total = 3 apples".
    const measurementStringProperty = new DerivedProperty(
      [
        model.totalSnacksProperty,
        MeanShareAndBalanceStrings.appleStringProperty,
        MeanShareAndBalanceStrings.applesStringProperty
      ],
      ( total, singular, plural ) => total === 1 ? singular : plural
    );
    const totalApplesPatternStringProperty = new PatternStringProperty(
      MeanShareAndBalanceStrings.totalApplesPatternStringProperty,
      {
        total: model.totalSnacksProperty,
        measurement: measurementStringProperty
      }
    );

    // Create the notepad Node where the graphical representations of the snacks will be displayed.
    const notepadNode = new FairShareNotepadNode( model.notepadModeProperty, {
      readoutPatternStringProperty: totalApplesPatternStringProperty,
      tandem: options.tandem.createTandem( 'notepadNode' )
    } );

    super(
      model,
      MeanShareAndBalanceStrings.fairShareQuestionStringProperty,
      MeanShareAndBalanceColors.fairShareQuestionBarColorProperty,
      notepadNode,
      options
    );

    // Add the box that will depict the collection area, only shown in 'Collect' mode.
    const collectionAreaVisibleProperty = new DerivedProperty(
      [ model.notepadModeProperty ],
      mode => mode === NotepadMode.COLLECT
    );
    const collectionAreaNode = new Rectangle(
      0,
      0,
      FairShareModel.COLLECTION_AREA_SIZE.width,
      FairShareModel.COLLECTION_AREA_SIZE.height,
      {
        stroke: 'black',
        cornerRadius: 8,
        centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y + 20,
        centerX: this.playAreaCenterX,
        visibleProperty: collectionAreaVisibleProperty
      }
    );
    this.addChild( collectionAreaNode );

    // Create the Nodes on the notepad layer that represent the plates in the model.
    const notepadPlateNodes = model.plates.map(
      plate => new FairShareNotepadPlateNode( plate, model.notepadModeProperty )
    );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    // Update the center of the play area when the number of active plates changes.
    model.numberOfPlatesProperty.link( this.updatePlayAreaLayerPositions.bind( this ) );

    // Add the Nodes that graphically represent the apples in the notepad.
    const appleNodesParentTandem = options.tandem.createTandem( 'appleNodes' );
    model.snacks.forEach( ( apple, i ) => {
      this.notepadSnackLayerNode.addChild( new NotepadAppleNode( apple, {
            tandem: appleNodesParentTandem.createTandem( `notepadAppleNode${i + 1}` ),
            visibleProperty: apple.isActiveProperty
          }
        )
      );
    } );

    model.snacksAdjusted.addListener( () => {
      if ( this.notepadSnackLayerNode.centerX !== this.playAreaCenterX ) {
        this.updatePlayAreaLayerPositions();
      }
    } );
  }
}

meanShareAndBalance.register( 'FairShareScreenView', FairShareScreenView );