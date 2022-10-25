// Copyright 2022, University of Colorado Boulder

/**
 * Instantiates Intro Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {
  public constructor( providedOptions: IntroScreenOptions ) {
    const options = optionize<IntroScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.introStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty,
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );
    super(
      () => new IntroModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'IntroScreen', IntroScreen );