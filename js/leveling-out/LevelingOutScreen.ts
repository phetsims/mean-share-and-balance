// Copyright 2022, University of Colorado Boulder

/**
 * Instantiates Leveling Out Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceScreen from '../common/MeanShareAndBalanceScreen.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import EmptyObjectType from '../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import LevelingOutModel from './model/LevelingOutModel.js';
import LevelingOutScreenView from './view/LevelingOutScreenView.js';
import meanShareAndBalanceStrings from '../meanShareAndBalanceStrings.js';

type SelfOptions = EmptyObjectType;

type LevelingOutScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>

export default class LevelingOutScreen extends MeanShareAndBalanceScreen<LevelingOutModel, LevelingOutScreenView> {
  public constructor( providedOptions: LevelingOutScreenOptions ) {
    const options = optionize<LevelingOutScreenOptions, SelfOptions, ScreenOptions>()( {
      name: meanShareAndBalanceStrings.screen.levelingOut,
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty
    }, providedOptions );
    super(
      () => new LevelingOutModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LevelingOutScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'LevelingOutScreen', LevelingOutScreen );