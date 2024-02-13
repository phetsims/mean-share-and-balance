// Copyright 2023, University of Colorado Boulder

/**
 * BalancePointModel contains the scene model for the balance point screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import SoccerModel, { SoccerModelOptions } from '../../../../soccer-common/js/model/SoccerModel.js';
import BalancePointSceneModel from './BalancePointSceneModel.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = EmptySelfOptions;
type BalancePointModelOptions = SelfOptions & WithRequired<SoccerModelOptions<BalancePointSceneModel>, 'tandem'>;

export default class BalancePointModel extends SoccerModel<BalancePointSceneModel> {

  public constructor( options: BalancePointModelOptions ) {

    const sceneModel = new BalancePointSceneModel( {
      tandem: options.tandem.createTandem( 'sceneModel' )
    } );
    super( [ sceneModel ], options );
  }
}

meanShareAndBalance.register( 'BalancePointModel', BalancePointModel );