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
import { Node } from '../../../../scenery/js/imports.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import FairShareNotepadNode from './FairShareNotepadNode.js';

type SelfOptions = EmptySelfOptions;
type FairShareScreenViewOptions = SelfOptions & StrictOmit<SharingScreenViewOptions, 'children' | 'snackType'>;

export default class FairShareScreenView extends SharingScreenView {

  private readonly applesLayerNode: Node;

  public constructor( model: FairShareModel, providedOptions: FairShareScreenViewOptions ) {

    const options = optionize<FairShareScreenViewOptions, SelfOptions, SharingScreenViewOptions>()( {
      snackType: 'apples',
      showSyncButton: false
    }, providedOptions );

    const measurementStringProperty = new DerivedProperty( [ model.totalSnacksProperty,
        MeanShareAndBalanceStrings.appleStringProperty,
        MeanShareAndBalanceStrings.applesStringProperty ],
      ( total, singular, plural ) => total === 1 ? singular : plural );

    const totalApplesPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.totalApplesPatternStringProperty, {
      total: model.totalSnacksProperty,
      measurement: measurementStringProperty
    } );

    const notepadNode = new FairShareNotepadNode( model.notepadModeEnumerationProperty, {
      readoutPatternStringProperty: totalApplesPatternStringProperty
    } );

    super(
      model,
      MeanShareAndBalanceStrings.fairShareQuestionStringProperty,
      MeanShareAndBalanceColors.fairShareQuestionBarColorProperty,
      notepadNode,
      options
    );

    this.applesLayerNode = new Node( {

      // See peopleLayerNode.excludeInvisibleChildrenFromBounds comment
      excludeInvisibleChildrenFromBounds: true,
      children: [ ...this.tablePlateNodes ]
    } );
    this.addChild( this.applesLayerNode );

    model.numberOfPlatesProperty.link( numberOfPlates => {
      this.centerPlayAreaNodes();
    } );
  }

  protected override centerPlayAreaNodes(): void {
    super.centerPlayAreaNodes();
    this.applesLayerNode.centerX = this.playAreaCenterX;
  }
}

meanShareAndBalance.register( 'FairShareScreenView', FairShareScreenView );