// Copyright 2022, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type MeanShareAndBalanceModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class MeanShareAndBalanceModel {

  constructor( providedOptions: MeanShareAndBalanceModelOptions ) {

  }

  /**
   * Resets the model.
   */
  public reset(): void {
    //TODO
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    //TODO
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceModel', MeanShareAndBalanceModel );
export default MeanShareAndBalanceModel;