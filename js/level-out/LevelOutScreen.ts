// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Leveling Out Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import LevelOutModel from './model/LevelOutModel.js';
import LevelOutScreenView from './view/LevelOutScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';

type SelfOptions = EmptySelfOptions;

type LevelingOutScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class LevelOutScreen extends Screen<LevelOutModel, LevelOutScreenView> {
  public constructor( providedOptions: LevelingOutScreenOptions ) {
    const options = optionize<LevelingOutScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.levelingOutStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.levelingOutScreenBackgroundColorProperty,
      createKeyboardHelpNode: () => new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );
    super(
      () => new LevelOutModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LevelOutScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'LevelOutScreen', LevelOutScreen );