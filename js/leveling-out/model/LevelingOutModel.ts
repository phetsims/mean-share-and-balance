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
import meanShareAndBalance from '../../meanShareAndBalance.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import PipeModel from './PipeModel.js';
import WaterCupModel from './WaterCupModel.js';

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
  readonly waterCups = createObservableArray<WaterCupModel>();
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
    this.waterCups.push( new WaterCupModel() );

    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCups.length ) {
        const lastWaterCup = this.waterCups[ this.waterCups.length - 1 ];
        this.waterCups.push( new WaterCupModel( { x: lastWaterCup.xProperty.value + 100 } ) );
        if ( value > 1 ) {
          // new pipe model to const
          const pipeModel = new PipeModel(
            lastWaterCup.xProperty,
            lastWaterCup.waterCup2DChild.y,
            this.waterCups.slice( -2 )
          );
          pipeModel.isOpenProperty.link( isOpen => {
            if ( isOpen ) {
              const index = this.pipes.findIndex( pipe => pipe === pipeModel );
              this.levelWater( index );
            }
          } );
          // create callback outside of loop and pass in
          this.pipes.push( pipeModel );
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

  private levelWater( index: number ): void {
    // remove duplicates
    const affectedCups = new Set<WaterCupModel>( this.getAffectedCups( index ) );
    // calculate mean
    let totalWater = 0;
    affectedCups.forEach( cup => {
      totalWater += cup.waterLevelProperty.value;
    } );
    const waterMean = totalWater / affectedCups.size;

    affectedCups.forEach( cup => cup.waterLevelProperty.set( waterMean ) );
  }

  private getAffectedCups( index: number ): Array<WaterCupModel> {
    const cups: Array<WaterCupModel> = [];
    for ( const pipe of this.pipes.slice( index ) ) {
      if ( pipe.isOpenProperty.value ) {
        pipe.connectedCups.forEach( cup => cups.push( cup ) );
      }
      else {
        return cups;
      }
    }
    return cups;
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