// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Distribute Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import DistributeModel from './model/DistributeModel.js';
import DistributeScreenView from './view/DistributeScreenView.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;

type DistributeScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class DistributeScreen extends Screen<DistributeModel, DistributeScreenView> {
  public constructor( providedOptions: DistributeScreenOptions ) {
    const options = optionize<DistributeScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.levelingOutStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.distributeScreenColorProperty,
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );
    super(
      () => new DistributeModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new DistributeScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'DistributeScreen', DistributeScreen );