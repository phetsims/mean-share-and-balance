// Copyright 2022, University of Colorado Boulder

/**
 * Model for the Leveling Out screen, which includes 2d cups, 3d cups, connecting pipes, and view options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
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
import WaterCupModel from './WaterCupModel.js';

type SelfOptions = {};

type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class IntroModel extends MeanShareAndBalanceModel {

  // TODO: Should this be able to go to 0 for PhET-iO?  Perhaps an issue for the designer
  readonly numberOfCupsRange = new Range( 1, 7 );
  readonly dragRange = new Range( 0, 1 );
  readonly cupRange = new Range( 0, 1 );

  readonly isShowingPredictMeanProperty: BooleanProperty;
  readonly isShowingMeanProperty: BooleanProperty;
  readonly isShowingTickMarksProperty: BooleanProperty;
  readonly numberOfCupsProperty: NumberProperty;
  readonly meanPredictionProperty: NumberProperty;
  readonly meanProperty: NumberProperty;

  readonly waterCup3DGroup: PhetioGroup<WaterCupModel, [ x: number ]>;
  readonly waterCup2DGroup: PhetioGroup<WaterCupModel, [ x: number ]>;

  readonly pipeGroup: PhetioGroup<PipeModel, [ number, number ]>;


  constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.isShowingPredictMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingPredictMeanProperty' )
    } );
    this.isShowingMeanProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingMeanProperty' )
    } );
    this.isShowingTickMarksProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isShowingTickMarksProperty' )
    } );
    this.meanPredictionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup',
      range: new Range( 0, 1 )
    } );

    // The sim starts with one water cup
    this.numberOfCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS, {
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' ),
      numberType: 'Integer',
      range: this.numberOfCupsRange
    } );

    // The 3D cups are the "ground truth" and the 2D cups mirror them
    this.waterCup3DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {

      return new WaterCupModel( {
        tandem: tandem,
        x: x,
        y: MeanShareAndBalanceConstants.CUPS_3D_Y_VALUE
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCupModel.WaterCupModelIO ),
      phetioDocumentation: 'Holds the models for the 3D water cups.',
      tandem: options.tandem.createTandem( 'waterCup3DGroup' )
    } );

    this.waterCup2DGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new WaterCupModel( {
        tandem: tandem,
        x: x,
        y: MeanShareAndBalanceConstants.CUPS_2D_Y_VALUE,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( WaterCupModel.WaterCupModelIO ),
      phetioDocumentation: 'Holds the models for the 2D water cups.',
      tandem: options.tandem.createTandem( 'waterCup2DGroup' )
    } );

    this.pipeGroup = new PhetioGroup( ( tandem: Tandem, x: number, y: number ) => {
      return new PipeModel( x, y, { tandem: tandem } );
    }, [ 0, 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( PipeModel.PipeModelIO ),
      phetioDocumentation: 'Holds the connecting pipes for the 2D water cups.',
      tandem: options.tandem.createTandem( 'pipeGroup' )
    } );

    this.meanProperty = new NumberProperty( MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT, {
      tandem: options.tandem.createTandem( 'meanProperty' ),
      phetioDocumentation: 'The ground truth water level mean.',
      phetioReadOnly: true,
      range: new Range( 0, 1 )
    } );

    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.link( numberOfCups => {
      while ( numberOfCups > this.waterCup3DGroup.count ) {

        const lastWaterCup: WaterCupModel | null = this.waterCup3DGroup.count > 0 ? this.waterCup3DGroup.getLastElement() : null;
        const x = lastWaterCup ?
                  lastWaterCup.x + ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH ) :
                  0;
        this.waterCup3DGroup.createNextElement( x );
        const new2DCup = this.waterCup2DGroup.createNextElement( x );

        lastWaterCup && this.pipeGroup.createNextElement( lastWaterCup.x, new2DCup.y );
      }
      while ( numberOfCups < this.waterCup3DGroup.count ) {
        this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getLastElement() );
        this.waterCup2DGroup.disposeElement( this.waterCup2DGroup.getLastElement() );
        this.matchCupWaterLevels();
        if ( numberOfCups > 0 ) {
          this.pipeGroup.disposeElement( this.pipeGroup.getLastElement() );
        }
      }
      this.updateMeanFrom3DCups();

      assert && assert( numberOfCups === this.waterCup3DGroup.count, `Expected ${numberOfCups} cups, but found: ${this.waterCup3DGroup.count}.` );
      assert && assert( numberOfCups > 0, 'There should always be at least 1 cup' );
      assert && assert( this.waterCup3DGroup.count - 1 === this.pipeGroup.count, `The length of pipes is: ${this.pipeGroup.count}, but should be one less the length of water cups or: ${this.waterCup3DGroup.count - 1}.` );
    } );
  }

  private updateMeanFrom3DCups(): void {
    this.meanProperty.set( calculateMean( this.waterCup3DGroup.map( waterCup3D => waterCup3D.waterLevelProperty.value ) ) );
  }

  // Return array of sets of cups connected by open pipes
  private classifyCups( waterCupGroup: PhetioGroup<WaterCupModel, [ x: number ]> ): Array<Set<WaterCupModel>> {
    const setsOfConnectedCups: Array<Set<WaterCupModel>> = [];
    let currentSet = new Set<WaterCupModel>();
    let index = 0;

    // organize into sets of connected cups
    this.waterCup2DGroup.forEach( cup => {
      currentSet.add( cup );
      if ( this.pipeGroup.count > index ) {
        if ( !this.pipeGroup.getElement( index ).isOpenProperty.value ) {
          setsOfConnectedCups.push( currentSet );
          currentSet = new Set<WaterCupModel>();
        }
        index += 1;
      }
      else if ( this.waterCup2DGroup.getLastElement() === cup ) {
        setsOfConnectedCups.push( currentSet );
      }
    } );

    return setsOfConnectedCups;
  }

  /**
   * Called during step(), levels out the water levels for the connected cups.
   */
  private levelWater( dt: number ): void {
    const setsOfConnectedCups = this.classifyCups( this.waterCup2DGroup );

    // calculate and set mean
    setsOfConnectedCups.forEach( cupsSet => {
      const waterMean = calculateMean( Array.from( cupsSet ).map( cup => cup.waterLevelProperty.value ) );
      cupsSet.forEach( cup => {
        const currentWaterLevel = cup.waterLevelProperty.value;
        const delta = waterMean - currentWaterLevel;

        // Animate water non-linearly. Higher discrepancy means the water will flow faster.
        // When the water levels are closer, it will slow down.
        cup.waterLevelProperty.set( currentWaterLevel + delta * dt * 5 );
      } );
    } );
  }

  // Reset 2D waterLevelProperty to 3D waterLevelProperty.
  private matchCupWaterLevels(): void {
    for ( let i = 0; i < this.numberOfCupsProperty.value; i++ ) {
      const cup2D = this.waterCup2DGroup.getElement( i );
      const cup3D = this.waterCup3DGroup.getElement( i );
      cup2D.waterLevelProperty.set( cup3D.waterLevelProperty.value );
    }
  }

  override syncData(): void {
    super.syncData();
    this.pipeGroup.forEach( pipe => pipe.isOpenProperty.set( false ) );
    this.matchCupWaterLevels();
  }

  override step( dt: number ): void {
    super.step( dt );
    this.levelWater( dt );
  }

  override reset(): void {
    super.reset();
    this.isShowingPredictMeanProperty.reset();
    this.isShowingMeanProperty.reset();
    this.isShowingTickMarksProperty.reset();
    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();

    // NOTE: This will auto-delete the corresponding 2d cups, since those are synchronized above
    while ( this.waterCup3DGroup.count > MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS ) {
      this.waterCup3DGroup.disposeElement( this.waterCup3DGroup.getLastElement() );
      this.pipeGroup.dispose();
    }
    this.waterCup3DGroup.forEach( waterCup3D => waterCup3D.reset() );
    this.waterCup2DGroup.forEach( waterCup2D => waterCup2D.reset() );

    this.meanProperty.reset();
  }

  // adapterProperty allows us to confirm water levels and their deltas are within range before setting each cups own waterLevelProperty.
  // Without an adapter property waterLevels become disconnected, and our visual representations do not match the data set.
  changeWaterLevel( cup3DModel: WaterCupModel, adapterProperty: NumberProperty, waterLevel: number, oldWaterLevel: number ): void {

    const index = this.waterCup3DGroup.indexOf( cup3DModel );
    const new2DCup = this.waterCup2DGroup.getElement( index );

    const proposedDelta = waterLevel - oldWaterLevel;

    // TODO: refactor out into separate function.
    const new2DWaterLevel = new2DCup.waterLevelProperty.value + proposedDelta;
    const constrained2D = this.cupRange.constrainValue( new2DWaterLevel );
    const constrained2DDelta = constrained2D - new2DCup.waterLevelProperty.value;

    const new3DWaterLevel = cup3DModel.waterLevelProperty.value + proposedDelta;
    const constrained3D = this.cupRange.constrainValue( new3DWaterLevel );
    const constrained3DDelta = constrained3D - cup3DModel.waterLevelProperty.value;

    const actualDelta = Math.abs( constrained2DDelta ) < Math.abs( constrained3DDelta ) ? constrained2DDelta : constrained3DDelta;

    cup3DModel.waterLevelProperty.set( cup3DModel.waterLevelProperty.value + actualDelta );
    new2DCup.waterLevelProperty.set( new2DCup.waterLevelProperty.value + actualDelta );

    // Whichever cup (2D or 3D) has more determines how high the user can drag that value.
    // If the 3D cup has more, the user can drag to 1.
    const max = Math.min( 1 - new2DCup.waterLevelProperty.value + cup3DModel.waterLevelProperty.value, 1 );

    // Whichever cup (2d or 3d cup) has less determines how low the user can drag that value.
    // If the 3d cup has less, the user can drag all the way to 0.
    const min = Math.max( cup3DModel.waterLevelProperty.value - new2DCup.waterLevelProperty.value, 0 );

    // Constrain range based on remaining space in cups.
    cup3DModel.enabledRangeProperty.set( new Range( min, max ) );

    this.updateMeanFrom3DCups();

    // TODO: investigate potentially removing other listener?
    // TODO: assertion to ensure waterlevel totals are equal.
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );