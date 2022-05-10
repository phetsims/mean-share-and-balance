// Copyright 2022, University of Colorado Boulder

/**
 * Model for the MeanShareAndBalance Screen. Rest and step functions
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {};

type MeanShareAndBalanceModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeanShareAndBalanceModel {

  constructor( providedOptions: MeanShareAndBalanceModelOptions ) {

  }

  /**
   * Resets the model.
   */
  public reset(): void {
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceModel', MeanShareAndBalanceModel );