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
import FairShareModel from '../model/FairShareModel.js';
import SharingScreenView, { SharingScreenViewOptions } from '../../common/view/SharingScreenView.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FairShareNotepadNode from './FairShareNotepadNode.js';
import FairShareNotepadPlateNode from './FairShareNotepadPlateNode.js';
import NotepadAppleNode from './NotepadAppleNode.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Apple from '../model/Apple.js';

type SelfOptions = EmptySelfOptions;
type FairShareScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType' | 'tablePlateAccessibleNameSuffix'>;

export default class FairShareScreenView extends SharingScreenView<Apple> {

  public constructor( model: FairShareModel, providedOptions: FairShareScreenViewOptions ) {

    const options = optionize<FairShareScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'apples',
      showSyncButton: false,
      tablePlateAccessibleNameSuffix: 'Apples'
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
    const notepadNode = new FairShareNotepadNode(
      model.appleDistributionModeProperty,
      model.applesAnimationStateEmitter,
      model.totalSnacksProperty,
      model.numberOfPlatesProperty,
      {
        readoutPatternStringProperty: totalApplesPatternStringProperty,
        totalVisibleProperty: model.totalVisibleProperty,
        meanInfoPanelVisibleProperty: model.meanInfoPanelVisibleProperty,
        tandem: options.tandem.createTandem( 'notepadNode' )
      }
    );

    super(
      model,
      MeanShareAndBalanceStrings.fairShareQuestionStringProperty,
      MeanShareAndBalanceColors.fairShareQuestionBarColorProperty,
      notepadNode,
      options
    );

    // Create the Nodes on the notepad layer that represent the plates in the model.
    const modelToNotepadTransform = ModelViewTransform2.createOffsetScaleMapping(
      new Vector2( this.playAreaCenterX, FairShareModel.NOTEPAD_PLATE_CENTER_Y ),
      1
    );
    const notepadPlateNodes = model.plates.map(
      plate => new FairShareNotepadPlateNode( plate, modelToNotepadTransform, model.appleDistributionModeProperty )
    );
    notepadPlateNodes.forEach( plateNode => { this.notepadSnackLayerNode.addChild( plateNode ); } );

    // Add the Nodes that graphically represent the apples in the notepad.
    const appleNodesParentTandem = options.tandem.createTandem( 'appleNodes' );
    model.getAllSnacks().forEach( ( apple, i ) => {
      this.notepadSnackLayerNode.addChild( new NotepadAppleNode( apple, modelToNotepadTransform, {
        tandem: appleNodesParentTandem.createTandem( `appleNode${i + 1}` ),
        visibleProperty: apple.isActiveProperty
      } ) );
    } );
  }
}

meanShareAndBalance.register( 'FairShareScreenView', FairShareScreenView );