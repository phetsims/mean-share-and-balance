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
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

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
        this.waterCups.push( new WaterCupModel( { x: lastWaterCup.xProperty.value + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH ) } ) );
        if ( value > 1 ) {
          const pipeModel = new PipeModel(
            lastWaterCup.xProperty,
            lastWaterCup.waterCup2DChild.y
          );
          pipeModel.isOpenProperty.link( isOpen => {
            if ( isOpen ) {
              this.levelWater();
            }
          } );
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
      if ( value > 0 ) {
        assert && assert( this.waterCups.length - 1 === this.pipes.length, `The length of pipes is: ${this.pipes.length}, but should be one less the length of water cups or: ${this.waterCups.length - 1}.` );
      }
    } );
  }

  private levelWater(): void {
    const affectedCups: Array<Set<WaterCupModel>> = [];
    let cupsSet = new Set<WaterCupModel>();
    // organize into sets of connected cups
    this.pipes.forEach( ( pipe, index ) => {
      if ( pipe.isOpenProperty.value ) {
        cupsSet.add( this.waterCups[ index ] );
        cupsSet.add( this.waterCups[ index + 1 ] );
        if ( index === this.pipes.length - 1 ) {
          affectedCups.push( cupsSet );
        }
      }
      else if ( cupsSet.size > 1 ) {
        affectedCups.push( cupsSet );
        cupsSet = new Set<WaterCupModel>();
      }
    } );
    // calculate and set mean
    affectedCups.forEach( cupsSet => {
      const waterMean = this.calculateMean( cupsSet );
      cupsSet.forEach( cup => cup.waterLevelProperty.set( waterMean ) );
    } );
  }

  private calculateMean( cups: Set<WaterCupModel> ): number {
    let totalWater = 0;
    cups.forEach( cup => {
      totalWater += cup.waterLevelProperty.value;
    } );
    return totalWater / cups.size;
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