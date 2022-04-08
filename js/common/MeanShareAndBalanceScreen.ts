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
import MeanShareAndBalanceModel from './model/MeanShareAndBalanceModel.js';
import MeanShareAndBalanceScreenView from './view/MeanShareAndBalanceScreenView.js';
// import LevelingOutScreenView from '../leveling-out/LevelingOutScreenView.js';
// import LevelingOutModel from '../leveling-out/LevelingOutModel.js';

type SelfOptions = {
  //TODO add options that are specific to MeanSh≥areAndBalanceScreen here
};

type MeanShareAndBalanceScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

class MeanShareAndBalanceScreen<T extends MeanShareAndBalanceModel, V extends MeanShareAndBalanceScreenView> extends Screen<T, V> {

  constructor( createModel: () => T, createView: ( m: T ) => V, providedOptions: MeanShareAndBalanceScreenOptions ) {

    const options = optionize<MeanShareAndBalanceScreenOptions, SelfOptions, ScreenOptions>( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty
    }, providedOptions );

    //TODO add LevelingOutScreen
    super( createModel, createView, options );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreen', MeanShareAndBalanceScreen );
export default MeanShareAndBalanceScreen;