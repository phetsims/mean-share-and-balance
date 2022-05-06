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
import PipeModel from './PipeModel.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import optionize from '../../../../phet-core/js/optionize.js';
import WaterCup2DModel from './WaterCup2DModel.js';
import WaterCup3DModel from './WaterCup3DModel.js';

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
  readonly pipeGroup: PhetioGroup<PipeModel, [ NumberProperty, number ]>;
  readonly meanPredictionProperty: NumberProperty;
  //TODO based on mean of cup water levels
  readonly meanProperty: NumberProperty;
  waterCup2DGroup: PhetioGroup<WaterCup2DModel, [ x: number ]>;
  waterCup3DGroup: PhetioGroup<WaterCup3DModel, [ x: number ]>;

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

    this.waterCup3DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new WaterCup3DModel( { tandem: tandem, x: x } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCup3DModel.WaterCup3DModelIO ),
      tandem: options.tandem.createTandem( 'waterCup3DGroup' )
    } );

    this.waterCup2DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new WaterCup2DModel( { tandem: tandem, x: x } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCup2DModel.WaterCup2DModelIO ),
      tandem: options.tandem.createTandem( 'waterCup2DGroup' )
    } );

    this.pipeGroup = new PhetioGroup( ( tandem: Tandem, xProperty: NumberProperty, y: number ) => {
      return new PipeModel( xProperty, y, { tandem: tandem } );
    }, [ new NumberProperty( 0 ), 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( PipeModel.PipeModelIO ),
      tandem: options.tandem.createTandem( 'pipeGroup' )
    } );

    // The sim starts with one water cup
    const first3DCup = this.waterCup3DGroup.createNextElement( 0 );
    const first2DCup = this.waterCup2DGroup.createNextElement( 0 );
    this.meanProperty = new NumberProperty( this.calculateMean( this.waterCup3DGroup ) );

    const validRange = new Range( 0, 1 );

    // Wire up the water level, treating the 3d model as the ground truth
    const syncCups = ( waterCup3D: WaterCup3DModel, waterCup2D: WaterCup2DModel ) => {
      waterCup3D.waterLevelProperty.lazyLink( ( waterLevel, oldWaterLevel ) => {

        const delta = waterLevel - oldWaterLevel;
        const new2DWaterLevel = waterCup2D.waterLevelProperty.value + delta;
        waterCup2D.waterLevelProperty.value = validRange.constrainValue( new2DWaterLevel );

        this.levelWater();
        this.meanProperty.set( this.calculateMean( this.waterCup3DGroup ) );
      } );
    };

    syncCups( first3DCup, first2DCup );

    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.link( value => {
      while ( value > this.waterCup3DGroup.count ) {
        const lastWaterCup3D = this.waterCup3DGroup.getElement( this.waterCup3DGroup.count - 1 );
        const x = lastWaterCup3D.xProperty.value + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH );
        const new3DCup = this.waterCup3DGroup.createNextElement( x );
        const new2DCup = this.waterCup2DGroup.createNextElement( x );

        syncCups( new3DCup, new2DCup );

        if ( value > 1 ) {
          const newPipe = this.pipeGroup.createNextElement( lastWaterCup3D.xProperty, 200 ); // TODO: Get the y value from the 2D cup
          newPipe.isOpenProperty.link( isOpen => {
            if ( isOpen ) {
              this.levelWater();
            }
          } );
        }
      }
      while ( value < this.waterCup3DGroup.count ) {
        this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getElement( this.waterCup3DGroup.count - 1 ) );
        this.waterCup2DGroup.disposeElement( this.waterCup2DGroup.getElement( this.waterCup2DGroup.count - 1 ) );
        if ( value > 0 ) {
          const lastPipe = this.pipeGroup.getElement( this.pipeGroup.count - 1 );
          this.pipeGroup.disposeElement( lastPipe );
        }
      }

      this.meanProperty.set( this.calculateMean( this.waterCup3DGroup ) );

      assert && assert( value === this.waterCup3DGroup.count, `The value returned is: ${value}, but the waterCups length is: ${this.waterCup3DGroup.count}.` );
      if ( value > 0 ) {
        assert && assert( this.waterCup3DGroup.count - 1 === this.pipeGroup.count, `The length of pipes is: ${this.pipeGroup.count}, but should be one less the length of water cups or: ${this.waterCup3DGroup.count - 1}.` );
      }

    } );
  }

  /**
   * Called when a pipe is opened or closed, levels out the water levels for the connected cups.
   */
  private levelWater(): void {
    const affectedCups: Array<Set<WaterCup2DModel>> = [];
    let cupsSet = new Set<WaterCup2DModel>();
    // organize into sets of connected cups
    let index = 0;
    this.pipeGroup.forEach( pipe => {
      if ( pipe.isOpenProperty.value ) {
        cupsSet.add( this.waterCup2DGroup.getElement( index ) );
        cupsSet.add( this.waterCup2DGroup.getElement( index + 1 ) );
        if ( index === this.pipeGroup.count - 1 ) {
          affectedCups.push( cupsSet );
        }
      }
      else if ( cupsSet.size > 1 ) {
        affectedCups.push( cupsSet );
        cupsSet = new Set<WaterCup2DModel>();
      }
      index += 1;
    } );
    // calculate and set mean
    affectedCups.forEach( cupsSet => {
      const waterMean = this.calculateMean( cupsSet );
      cupsSet.forEach( cup => cup.waterLevelProperty.set( waterMean ) );
    } );
  }

  private calculateMean( cups: Set<WaterCup2DModel> | PhetioGroup<WaterCup3DModel, [ number ]> ): number {
    let totalWater = 0;
    cups.forEach( cup => {
      totalWater += cup.waterLevelProperty.value;
    } );
    const totalCups = cups instanceof Set ? cups.size : cups.count;
    return totalWater / totalCups;
  }

  override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.numberOfCupsProperty.reset();

    while ( this.waterCup3DGroup.count > 1 ) {
      const lastWaterCup = this.waterCup3DGroup.getElement( this.waterCup3DGroup.count - 1 );
      this.waterCup3DGroup.disposeElement( lastWaterCup );
      this.pipeGroup.dispose();
    }
    this.waterCup3DGroup.forEach( waterCup3D => waterCup3D.waterLevelProperty.reset() );
    this.waterCup2DGroup.forEach( waterCup2D => waterCup2D.waterLevelProperty.reset() );
  }
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );