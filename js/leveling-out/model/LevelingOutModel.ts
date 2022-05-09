// Copyright 2022, University of Colorado Boulder

/**
 * Model for the Leveling Out screen, which includes 2d cups, 3d cups, connecting pipes, and view options.
 *
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
  readonly meanProperty: NumberProperty;
  readonly waterCup2DGroup: PhetioGroup<WaterCup2DModel, [ x: number ]>;
  readonly waterCup3DGroup: PhetioGroup<WaterCup3DModel, [ x: number ]>;

  constructor( providedOptions?: LevelingOutModelOptions ) {
    const options = optionize<LevelingOutModelOptions, SelfOptions>()( {
        //TODO add in custom options
      }, providedOptions
    );
    super( options );

    this.isShowingPredictMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPredictMeanProperty' )
    } );
    this.isShowingMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMeanProperty' )
    } );
    this.isShowingTickMarksProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTickMarksProperty' )

      // TODO: add phetioDocumentation where appropriate
    } );
    this.meanPredictionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup'
    } );

    this.levelingOutRange = new Range( 1, 7 );

    // The sim starts with one water cup
    this.numberOfCupsProperty = new NumberProperty( 1, {
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' ),
      numberType: 'Integer',
      range: this.levelingOutRange
    } );

    // The 3D cups are the "ground truth" and the 2D cups mirror them
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

    const validWaterLevelRange = new Range( 0, 1 );

    this.meanProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT );

    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.link( numberOfCups => {
      while ( numberOfCups > this.waterCup3DGroup.count ) {
        const lastWaterCup3D = this.waterCup3DGroup.getElement( this.waterCup3DGroup.count - 1 );
        const x = lastWaterCup3D ?
                  lastWaterCup3D.xProperty.value + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH ) :
                  0;
        const new3DCup = this.waterCup3DGroup.createNextElement( x );
        const new2DCup = this.waterCup2DGroup.createNextElement( x );

        // Wire up the water level, treating the 3d model as the ground truth
        new3DCup.waterLevelProperty.lazyLink( ( waterLevel, oldWaterLevel ) => {

          const delta = waterLevel - oldWaterLevel;
          const new2DWaterLevel = new2DCup.waterLevelProperty.value + delta;
          new2DCup.waterLevelProperty.value = validWaterLevelRange.constrainValue( new2DWaterLevel );

          this.levelWater();
          this.updateMeanFrom3DCups();
        } );

        if ( numberOfCups > 1 ) {
          const newPipe = this.pipeGroup.createNextElement( lastWaterCup3D.xProperty, new2DCup.y );
          newPipe.isOpenProperty.link( isOpen => {
            if ( isOpen ) {
              this.levelWater();
            }
          } );
        }
      }
      while ( numberOfCups < this.waterCup3DGroup.count ) {
        this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getElement( this.waterCup3DGroup.count - 1 ) );
        this.waterCup2DGroup.disposeElement( this.waterCup2DGroup.getElement( this.waterCup2DGroup.count - 1 ) );
        if ( numberOfCups > 0 ) {
          const lastPipe = this.pipeGroup.getElement( this.pipeGroup.count - 1 );
          this.pipeGroup.disposeElement( lastPipe );
        }
      }

      this.updateMeanFrom3DCups();

      assert && assert( numberOfCups === this.waterCup3DGroup.count, `The value returned is: ${numberOfCups}, but the waterCups length is: ${this.waterCup3DGroup.count}.` );
      if ( numberOfCups > 0 ) {
        assert && assert( this.waterCup3DGroup.count - 1 === this.pipeGroup.count, `The length of pipes is: ${this.pipeGroup.count}, but should be one less the length of water cups or: ${this.waterCup3DGroup.count - 1}.` );
      }

    } );
  }

  private updateMeanFrom3DCups(): void {
    this.meanProperty.set( calculateMean( this.waterCup3DGroup.map( waterCup3D => waterCup3D.waterLevelProperty.value ) ) );
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
      const waterMean = calculateMean( Array.from( cupsSet ).map( cup => cup.waterLevelProperty.value ) );
      cupsSet.forEach( cup => cup.waterLevelProperty.set( waterMean ) );
    } );
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

function calculateMean( values: number[] ): number {
  let sum = 0;
  values.forEach( value => {
    sum += value;
  } );
  return sum / values.length;
}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );