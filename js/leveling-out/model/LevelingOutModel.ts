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
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WaterCup2DModel from './WaterCup2DModel.js';

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
  readonly waterCupGroup: PhetioGroup<WaterCupModel, [ number ]>;
  readonly pipes = createObservableArray<PipeModel>();
  readonly meanPredictionProperty: NumberProperty;
  //TODO based on mean of cup water levels
  readonly meanProperty: NumberProperty;

  constructor( providedOptions: LevelingOutModelOptions ) {
    const options = optionize<LevelingOutModelOptions, SelfOptions>()( {
        //TODO add in custom options
      }, providedOptions
    );
    super( options );

    this.isShowingPredictMeanProperty = new BooleanProperty( false );
    this.isShowingMeanProperty = new BooleanProperty( false );
    this.isShowingTickMarksProperty = new BooleanProperty( false );
    this.meanPredictionProperty = new NumberProperty( 0 );
    this.numberOfCupsProperty = new NumberProperty( 1 );
    this.levelingOutRange = new Range( 1, 7 );
    this.waterCupGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new WaterCupModel( { tandem: tandem, x: x } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCupModel.WaterCupModelIO ),
      tandem: options.tandem.createTandem( 'waterCupGroup' )
    } );

    // The sim starts with one water cup
    const firstCup = this.waterCupGroup.createNextElement( 0 );
    this.meanProperty = new NumberProperty( this.calculateGroupMean( this.waterCupGroup ) );

    firstCup.waterLevelProperty.link( () => {
      this.levelWater();
      this.meanProperty.set( this.calculateGroupMean( this.waterCupGroup ) );
    } );


    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCupGroup.count ) {
        const lastWaterCup = this.waterCupGroup.getElement( this.waterCupGroup.count - 1 );
        const newCup = this.waterCupGroup.createNextElement( lastWaterCup.xProperty.value + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH ) );

        newCup.waterLevelProperty.link( () => {
          this.levelWater();
          this.meanProperty.set( this.calculateGroupMean( this.waterCupGroup ) );
        } );

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
      while ( value < this.waterCupGroup.count ) {
        const lastWaterCup = this.waterCupGroup.getElement( this.waterCupGroup.count - 1 );
        this.waterCupGroup.disposeElement( lastWaterCup );
        if ( value > 0 ) {
          this.pipes.pop();
        }
      }

      assert && assert( value === this.waterCupGroup.count, `The value returned is: ${value}, but the waterCups length is: ${this.waterCupGroup.count}.` );
      if ( value > 0 ) {
        assert && assert( this.waterCupGroup.count - 1 === this.pipes.length, `The length of pipes is: ${this.pipes.length}, but should be one less the length of water cups or: ${this.waterCupGroup.count - 1}.` );
      }
    } );
  }

  private levelWater(): void {
    const affectedCups: Array<Set<WaterCup2DModel>> = [];
    let cupsSet = new Set<WaterCup2DModel>();
    // organize into sets of connected cups
    this.pipes.forEach( ( pipe, index ) => {
      if ( pipe.isOpenProperty.value ) {
        cupsSet.add( this.waterCupGroup.getElement( index ).waterCup2DChild );
        cupsSet.add( this.waterCupGroup.getElement( index + 1 ).waterCup2DChild );
        if ( index === this.pipes.length - 1 ) {
          affectedCups.push( cupsSet );
        }
      }
      else if ( cupsSet.size > 1 ) {
        affectedCups.push( cupsSet );
        cupsSet = new Set<WaterCup2DModel>();
      }
    } );
    // calculate and set mean
    affectedCups.forEach( cupsSet => {
      const waterMean = this.calculateSetMean( cupsSet );
      cupsSet.forEach( cup => cup.waterLevelProperty.set( waterMean ) );
    } );
  }

  //TODO refactor into one function
  private calculateSetMean( cups: Set<WaterCup2DModel> ): number {
    let totalWater = 0;
    cups.forEach( cup => {
      totalWater += cup.waterLevelProperty.value;
    } );
    return totalWater / cups.size;
  }

  private calculateGroupMean( cups: PhetioGroup<WaterCupModel, [ number ]> ): number {
    let totalWater = 0;
    cups.forEach( cup => {
      totalWater += cup.waterLevelProperty.value;
    } );
    return totalWater / cups.count;
  }

  override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.numberOfCupsProperty.reset();

    while ( this.waterCupGroup.count > 1 ) {
      const lastWaterCup = this.waterCupGroup.getElement( this.waterCupGroup.count - 1 );
      this.waterCupGroup.disposeElement( lastWaterCup );
      this.pipes.pop();
    }
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );