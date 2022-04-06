// Copyright 2022, University of Colorado Boulder

import MeanShareAndBalanceModel from '../common/model/MeanShareAndBalanceModel.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../axon/js/BooleanProperty.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type LevelingOutModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LevelingOutModel extends MeanShareAndBalanceModel {
  readonly predictMeanProperty: BooleanProperty;
  readonly showMeanProperty: BooleanProperty;
  readonly tickMarksProperty: BooleanProperty;

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.predictMeanProperty = new BooleanProperty( false );
    this.showMeanProperty = new BooleanProperty( false );
    this.tickMarksProperty = new BooleanProperty( false );
  }


}

export default LevelingOutModel;