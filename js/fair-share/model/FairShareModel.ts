// Copyright 2024, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen which includes people, cookies, visual mean representation, and a numerical
 * mean representation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class FairShareModel extends MeanShareAndBalanceModel {

  public constructor( providedOptions?: FairShareModelOptions ) {

    const options = optionize<FairShareModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );
  }

  public reset(): void {
    // TBD
  }

  public step(): void {
    // TBD
  }
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );