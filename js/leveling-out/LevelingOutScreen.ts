// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import LevelingOutModel from './model/LevelingOutModel.js';
import LevelingOutScreenView from './view/LevelingOutScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceScreen from '../common/MeanShareAndBalanceScreen.js';

type SelfOptions = {
  //TODO add options that are specific to LevelingOutScreen here
};

type LevelingOutScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>

class LevelingOutScreen extends MeanShareAndBalanceScreen<LevelingOutModel, LevelingOutScreenView> {
  constructor( providedOptions: LevelingOutScreenOptions ) {
    const options = optionize<LevelingOutScreenOptions, SelfOptions, ScreenOptions>()( {
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
export default LevelingOutScreen;