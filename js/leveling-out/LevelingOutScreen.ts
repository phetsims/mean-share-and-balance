// Copyright 2022, University of Colorado Boulder

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import LevelingOutModel from './LevelingOutModel.js';
import LevelingOutScreenView from './LevelingOutScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';

type SelfOptions = {
  //TODO add options that are specific to LevelingOutScreen here
}
type LevelingOutScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>

// REVIEW: extend MeanShareAndBalanceScreen instead of Screen directly.  See VariabilityScreen extends CAVScreen for reference
class LevelingOutScreen extends Screen<LevelingOutModel, LevelingOutScreenView> {
  constructor( providedOptions: LevelingOutScreenOptions ) {
    const options = optionize<LevelingOutScreenOptions, SelfOptions, ScreenOptions>( {
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