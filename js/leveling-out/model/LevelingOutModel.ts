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
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import PipeModel from './PipeModel.js';

type SelfOptions = {
  //TODO add options that are specific to MeanShareAndBalanceModel here
};

type LevelingOutModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  readonly isShowingPredictMeanProperty: BooleanProperty;
  readonly isShowingMeanProperty: BooleanProperty;
  readonly isShowingTickMarksProperty: BooleanProperty;
  readonly numberOfCupsProperty: NumberProperty;
  readonly levelingOutRange: Range;
  readonly dragRange = new Range( 0, 1 );
  readonly waterCups = createObservableArray<WaterCup2DModel>();
  readonly pipes = createObservableArray<PipeModel>();
  readonly meanPredictionProperty: NumberProperty;
  //TODO based on mean of cup water levels
  readonly meanProperty = new NumberProperty( 0.5 );

  constructor( providedOptions: LevelingOutModelOptions ) {
    super( providedOptions );

    this.isShowingPredictMeanProperty = new BooleanProperty( false );
    this.isShowingMeanProperty = new BooleanProperty( false );
    this.isShowingTickMarksProperty = new BooleanProperty( false );
    this.meanPredictionProperty = new NumberProperty( 0 );
    this.numberOfCupsProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );

    // The sim starts with one water cup
    // TODO: There will probably be other code that centers the cups when the number of cups changes
    this.waterCups.push( new WaterCup2DModel( { x: 50 } ) );

    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCups.length ) {
        const lastWaterCup = this.waterCups[ this.waterCups.length - 1 ];
        this.waterCups.push( new WaterCup2DModel( { x: lastWaterCup.xProperty.value + 100 } ) );
        if ( value > 1 ) {
          this.pipes.push( new PipeModel( lastWaterCup.xProperty, lastWaterCup.y ) );
        }
      }
      while ( value < this.waterCups.length ) {
        this.waterCups.pop();
        if ( value > 0 ) {
          this.pipes.pop();
        }
      }

      assert && assert( value === this.waterCups.length, `The value returned is: ${value}, but the waterCups length is: ${this.waterCups.length}.` );
    } );
  }

  override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.numberOfCupsProperty.reset();

    while ( this.waterCups.length > 1 ) {
      this.waterCups.pop();
      this.pipes.pop();
    }
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );