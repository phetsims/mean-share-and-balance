// Copyright 2022, University of Colorado Boulder

/**
 * Creates model and view for Mean Share and Balance, contains background color
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceColors from './MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceModel from './model/MeanShareAndBalanceModel.js';
import MeanShareAndBalanceScreenView from './view/MeanShareAndBalanceScreenView.js';
import SliderControlsAndBasicActionsKeyboardHelpContent from '../../../scenery-phet/js/keyboard/help/SliderControlsAndBasicActionsKeyboardHelpContent.js';

type SelfOptions = EmptyObjectType;

type MeanShareAndBalanceScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem' | 'keyboardHelpNode'>;

export default class MeanShareAndBalanceScreen<T extends MeanShareAndBalanceModel, V extends MeanShareAndBalanceScreenView> extends Screen<T, V> {

  public constructor( createModel: () => T, createView: ( m: T ) => V, providedOptions: MeanShareAndBalanceScreenOptions ) {

    const options = optionize<MeanShareAndBalanceScreenOptions, SelfOptions, ScreenOptions>()( {
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty,
      keyboardHelpNode: new SliderControlsAndBasicActionsKeyboardHelpContent()
    }, providedOptions );

    super( createModel, createView, options );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreen', MeanShareAndBalanceScreen );