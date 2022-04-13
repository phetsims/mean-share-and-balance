// Copyright 2022, University of Colorado Boulder

/**
 * Base class for LevelingOut view
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceModel from '../../common/model/MeanShareAndBalanceModel.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import WaterCup2DModel from './WaterCup2DModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type LevelingOutModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class LevelingOutModel extends MeanShareAndBalanceModel {
  readonly predictMeanProperty: BooleanProperty;
  readonly showMeanProperty: BooleanProperty;
  readonly tickMarksProperty: BooleanProperty;
  readonly numberOfCupsProperty: NumberProperty;
  readonly levelingOutRange: Range;
  readonly waterCups: ObservableArray<WaterCup2DModel>;

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.predictMeanProperty = new BooleanProperty( false );
    this.showMeanProperty = new BooleanProperty( false );
    this.tickMarksProperty = new BooleanProperty( false );
    this.numberOfCupsProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );
    this.waterCups = createObservableArray();

    this.waterCups.push( new WaterCup2DModel() );

    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCups.length ) {
        const lastWaterCup = this.waterCups[ this.waterCups.length - 1 ];
        this.waterCups.push( new WaterCup2DModel( lastWaterCup.xProperty.value + 100 ) );
      }
      while ( value < this.waterCups.length ) {
        this.waterCups.pop();
      }
    } );
  }

  public override reset(): void {
    super.reset();
    this.predictMeanProperty.reset();
    this.showMeanProperty.reset();
    this.tickMarksProperty.reset();
    this.numberOfCupsProperty.reset();

    const firstCup = this.waterCups[ 0 ];
    this.waterCups.length = 0;
    this.waterCups.push( firstCup );
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );
export default LevelingOutModel;