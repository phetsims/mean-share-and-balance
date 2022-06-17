// Copyright 2022, University of Colorado Boulder

/**
 * Model for the MeanShareAndBalance Screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';

type SelfOptions = EmptyObjectType;

export type MeanShareAndBalanceModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class MeanShareAndBalanceModel {

  public constructor( providedOptions: MeanShareAndBalanceModelOptions ) {
    // Here for potential future use.
  }

  public syncData(): void {
    // See subclass for implementation
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    // See subclass for implementation
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    // See subclass for implementation
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceModel', MeanShareAndBalanceModel );