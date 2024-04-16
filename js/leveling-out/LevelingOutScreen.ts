// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Intro Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import LevelingOutModel from './model/LevelingOutModel.js';
import LevelingOutScreenView from './view/LevelingOutScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class LevelingOutScreen extends Screen<LevelingOutModel, LevelingOutScreenView> {
  public constructor( providedOptions: IntroScreenOptions ) {
    const options = optionize<IntroScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.introStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.introScreenBackgroundColorProperty,
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );
    super(
      () => new LevelingOutModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LevelingOutScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'LevelingOutScreen', LevelingOutScreen );