// Copyright 2022-2023, University of Colorado Boulder

/**
 * Model for the MeanShareAndBalance Screen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TModel from '../../../../joist/js/TModel.js';

type SelfOptions = EmptySelfOptions;

export type MeanShareAndBalanceModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class MeanShareAndBalanceModel implements TModel {

  protected constructor( providedOptions: MeanShareAndBalanceModelOptions ) {
    // Here for potential future use.
  }

  /**
   * Resets the model.
   */
  public abstract reset(): void;

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public abstract step( dt: number ): void;
}

meanShareAndBalance.register( 'MeanShareAndBalanceModel', MeanShareAndBalanceModel );