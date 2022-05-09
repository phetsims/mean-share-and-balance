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

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceScreen here
};

type MeanShareAndBalanceScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class MeanShareAndBalanceScreen<T extends MeanShareAndBalanceModel, V extends MeanShareAndBalanceScreenView> extends Screen<T, V> {

  constructor( createModel: () => T, createView: ( m: T ) => V, providedOptions: MeanShareAndBalanceScreenOptions ) {

    const options = optionize<MeanShareAndBalanceScreenOptions, SelfOptions, ScreenOptions>()( {

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: MeanShareAndBalanceColors.screenBackgroundColorProperty
    }, providedOptions );

    super( createModel, createView, options );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceScreen', MeanShareAndBalanceScreen );