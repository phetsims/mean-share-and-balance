// Copyright 2024, University of Colorado Boulder

/**
 * Model for the "Fair Share" Screen which includes people, cookies, visual mean snackType, and a numerical
 * mean snackType.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SharingModel, { SharingModelOptions } from '../../common/model/SharingModel.js';
import Apple from './Apple.js';

type SelfOptions = EmptySelfOptions;
type FairShareModelOptions = SelfOptions & PickRequired<SharingModelOptions, 'tandem'>;

export default class FairShareModel extends SharingModel<Apple> {

  public constructor( providedOptions?: FairShareModelOptions ) {
    const options = optionize<FairShareModelOptions, SelfOptions, SharingModelOptions>()( {}, providedOptions );
    super( options );
  }

  public override reset(): void {
    // TBD
  }
}

meanShareAndBalance.register( 'FairShareModel', FairShareModel );