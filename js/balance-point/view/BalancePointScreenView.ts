// Copyright 2023, University of Colorado Boulder

/**
 * BalancePointScreenView defines the range and field size for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SoccerScreenView, { SoccerScreenViewOptions } from '../../../../soccer-common/js/view/SoccerScreenView.js';
import BalancePointSceneModel from '../model/BalancePointSceneModel.js';
import BalancePointModel from '../model/BalancePointModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { EmptySelfOptions, optionize } from '../../../../phet-core/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;
export type BalancePointScreenViewOptions = SelfOptions & PickRequired<SoccerScreenViewOptions, 'tandem'>;
export default class BalancePointScreenView extends SoccerScreenView<BalancePointSceneModel, BalancePointModel> {

  public constructor( model: BalancePointModel, providedOptions: BalancePointScreenViewOptions ) {

    const options = optionize<BalancePointScreenViewOptions, SelfOptions, SoccerScreenViewOptions>()( {
      physicalRange: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE,
      chartViewWidth: 300,
      numberLineXMargin: 10
    }, providedOptions );
    super( model, options );
  }
}

meanShareAndBalance.register( 'BalancePointScreenView', BalancePointScreenView );