// Copyright 2022, University of Colorado Boulder

/**
 * Instantiates Intro Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceScreen from '../common/MeanShareAndBalanceScreen.js';
import meanShareAndBalanceStrings from '../meanShareAndBalanceStrings.js';

type SelfOptions = EmptyObjectType;

type IntroScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class IntroScreen extends MeanShareAndBalanceScreen<IntroModel, IntroScreenView> {
  public constructor( providedOptions: IntroScreenOptions ) {
    const options = optionize<IntroScreenOptions, SelfOptions, ScreenOptions>()( {
      name: meanShareAndBalanceStrings.screen.intro,
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty
    }, providedOptions );
    super(
      () => new IntroModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'IntroScreen', IntroScreen );