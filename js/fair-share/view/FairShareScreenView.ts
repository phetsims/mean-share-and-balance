// Copyright 2024, University of Colorado Boulder

/**
 * Representation for the "Fair Share" Screen. Contains a table with people, each of whom have a plate with cookies
 * on them.  It also includes a notepad that also show plates and cookies that can be synced, collected, or shared.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreenView, { MeanShareAndBalanceScreenViewOptions } from '../../common/view/MeanShareAndBalanceScreenView.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import FairShareModel from '../model/FairShareModel.js';
import NotepadWithReadoutNode from '../../common/view/NotepadWithReadoutNode.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import PartyTableNode from '../../common/view/PartyTableNode.js';

type SelfOptions = EmptySelfOptions;
type FairShareScreenViewOptions = SelfOptions & StrictOmit<MeanShareAndBalanceScreenViewOptions, 'children'>;

export default class FairShareScreenView extends MeanShareAndBalanceScreenView {

  public constructor( model: FairShareModel, providedOptions: FairShareScreenViewOptions ) {

    const options = providedOptions;

    const superOptions = optionize<FairShareScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, options );

    super(
      model,
      MeanShareAndBalanceStrings.fairShareQuestionStringProperty,
      MeanShareAndBalanceColors.fairShareQuestionBarColorProperty,
      superOptions
    );

    // TODO: The following code for adding the notepad and table should all go into a shared base class.  See https://github.com/phetsims/mean-share-and-balance/issues/1.
    const checkboxGroupWidthOffset = ( MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH +
                                       MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN ) / 2;
    const playAreaCenterX = this.layoutBounds.centerX - checkboxGroupWidthOffset;

    const notepad = new NotepadWithReadoutNode(
      model.totalSnacksProperty,
      MeanShareAndBalanceStrings.totalApplesPatternStringProperty,
      MeanShareAndBalanceStrings.appleStringProperty,
      MeanShareAndBalanceStrings.applesStringProperty
    );
    notepad.centerX = playAreaCenterX;
    this.addChild( notepad );
    const tableNode = new PartyTableNode( { centerX: playAreaCenterX } );
    this.addChild( tableNode );
  }
}

meanShareAndBalance.register( 'FairShareScreenView', FairShareScreenView );