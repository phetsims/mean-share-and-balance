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

  readonly isShowingPredictMeanProperty: BooleanProperty;
  readonly isShowingMeanProperty: BooleanProperty;
  readonly isShowingTickMarksProperty: BooleanProperty;
  readonly numberOfCupsProperty: NumberProperty;
  readonly levelingOutRange: Range;
  readonly dragRange: Range;
  readonly waterCups: ObservableArray<WaterCup2DModel>;
  readonly predictionProperty: NumberProperty;

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.isShowingPredictMeanProperty = new BooleanProperty( false );
    this.isShowingMeanProperty = new BooleanProperty( false );
    this.isShowingTickMarksProperty = new BooleanProperty( false );
    this.predictionProperty = new NumberProperty( 0.5 );
    this.numberOfCupsProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );
    this.dragRange = new Range( 0, 1 );
    this.waterCups = createObservableArray();

    this.waterCups.push( new WaterCup2DModel( { x: 50 } ) );

    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCups.length ) {
        const lastWaterCup = this.waterCups[ this.waterCups.length - 1 ];
        this.waterCups.push( new WaterCup2DModel( { x: lastWaterCup.xProperty.value + 100 } ) );
      }
      while ( value < this.waterCups.length ) {
        this.waterCups.pop();
      }

      assert && assert( value === this.waterCups.length, `The value returned is: ${value}, but the waterCups length is: ${this.waterCups.length}.` );
    } );
  }

  public override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.numberOfCupsProperty.reset();

    while ( this.waterCups.length > 1 ) {
      this.waterCups.pop();
    }
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );
export default LevelingOutModel;