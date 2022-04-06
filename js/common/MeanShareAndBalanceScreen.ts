// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceColors from './MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
// import MeanShareAndBalanceModel from './model/MeanShareAndBalanceModel.js';
import MeanShareAndBalanceScreenView from './view/MeanShareAndBalanceScreenView.js';
import LevelingOutScreenView from '../leveling-out/LevelingOutScreenView.js';
import LevelingOutModel from '../leveling-out/LevelingOutModel.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceScreen here
};

type MeanShareAndBalanceScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

class MeanShareAndBalanceScreen extends Screen<LevelingOutModel, MeanShareAndBalanceScreenView> {

  constructor( providedOptions: MeanShareAndBalanceScreenOptions ) {

    const options = optionize<MeanShareAndBalanceScreenOptions, SelfOptions, ScreenOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty
    }, providedOptions );

    //TODO add LevelingOutScreen
    super(
      () => new LevelingOutModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LevelingOutScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreen', MeanShareAndBalanceScreen );
export default MeanShareAndBalanceScreen;