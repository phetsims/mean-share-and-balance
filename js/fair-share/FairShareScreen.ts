// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Fair SHare Model and Screen View.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import FairShareScreenView from './view/FairShareScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';
import FairShareModel from './model/FairShareModel.js';

type SelfOptions = EmptySelfOptions;

type FairShareScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class FairShareScreen extends Screen<FairShareModel, FairShareScreenView> {
  public constructor( providedOptions: FairShareScreenOptions ) {
    const options = optionize<FairShareScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.fairShareStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.fairShareScreenColorProperty,
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );
    super(
      () => new FairShareModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new FairShareScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'FairShareScreen', FairShareScreen );