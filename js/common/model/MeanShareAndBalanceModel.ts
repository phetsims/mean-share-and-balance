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

export default abstract class MeanShareAndBalanceModel {

  protected constructor( providedOptions: MeanShareAndBalanceModelOptions ) {
    // Here for potential future use.
  }

  public abstract syncData(): void

  /**
   * Resets the model.
   */
  public abstract reset(): void

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public abstract step( dt: number ): void
}

meanShareAndBalance.register( 'MeanShareAndBalanceModel', MeanShareAndBalanceModel );