// Copyright 2022, University of Colorado Boulder

import MeanShareAndBalanceModel from '../../common/model/MeanShareAndBalanceModel.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import WaterCup2DNodeModel from './WaterCup2DNodeModel.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type LevelingOutModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LevelingOutModel extends MeanShareAndBalanceModel {
  readonly predictMeanProperty: BooleanProperty;
  readonly showMeanProperty: BooleanProperty;
  readonly tickMarksProperty: BooleanProperty;
  readonly initialValueProperty: NumberProperty;
  readonly levelingOutRange: Range;
  //Review: remove Node out of model name
  readonly waterCup: WaterCup2DNodeModel;

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.predictMeanProperty = new BooleanProperty( false );
    this.showMeanProperty = new BooleanProperty( false );
    this.tickMarksProperty = new BooleanProperty( false );
    this.initialValueProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );
    this.waterCup = new WaterCup2DNodeModel();
  }

  public override reset(): void {
    super.reset();
    this.predictMeanProperty.reset();
    this.showMeanProperty.reset();
    this.tickMarksProperty.reset();
    this.initialValueProperty.reset();
  }


}

export default LevelingOutModel;