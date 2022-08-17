// Copyright 2022, University of Colorado Boulder

/**
 * Model for the Intro screen, which includes 2D cups, 3D cups, connecting pipes, and view options.
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
import Pipe from './Pipe.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WaterCup from './WaterCup.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type IntroModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class IntroModel extends MeanShareAndBalanceModel {

  // TODO: Should this be able to go to 0 for PhET-iO? https://github.com/phetsims/mean-share-and-balance/issues/18
  public readonly numberOfCupsRange = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS );
  public readonly dragRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;
  public readonly cupRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;

  public readonly numberOfCupsProperty: Property<number>;
  public readonly meanPredictionProperty: Property<number>;
  public readonly meanProperty: TReadOnlyProperty<number>;

  public readonly waterCup3DArray: WaterCup[];
  public readonly waterCup2DArray: WaterCup[];
  public readonly pipeArray: Pipe[];
  public readonly arePipesOpenProperty: Property<boolean>;

  public constructor( providedOptions?: IntroModelOptions ) {

    const options = optionize<IntroModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.meanPredictionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup',
      range: MeanShareAndBalanceConstants.WATER_LEVEL_RANGE
    } );

    this.numberOfCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS, {
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' ),
      numberType: 'Integer',
      range: this.numberOfCupsRange
    } );

    this.arePipesOpenProperty = new BooleanProperty( false, { tandem: options.tandem.createTandem( 'arePipesOpenProperty' ) } );
    this.arePipesOpenProperty.lazyLink( arePipesOpen => this.matchCupWaterLevels() );

    // The 3D cups are the "ground truth" and the 2D cups mirror them
    this.waterCup3DArray = [];
    this.waterCup2DArray = [];
    this.pipeArray = [];

    // Statically allocate cups and pipes
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS; i++ ) {
      const x = i * ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH );
      const position3D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y );
      const waterLevel = i === 0 ? 0.75 : MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT;
      this.waterCup3DArray.push( new WaterCup( {
        tandem: options.tandem.createTandem( `waterCup3D${i}` ),
        waterLevel: waterLevel,
        position: position3D,
        isActive: i <= 1,
        linePlacement: i
      } ) );

      const position2D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y );
      this.waterCup2DArray.push( new WaterCup( {
        tandem: options.tandem.createTandem( `waterCup2D${i}` ),
        waterLevel: waterLevel,
        position: position2D,
        isActive: i <= 1,
        linePlacement: i,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } ) );

      if ( i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS - 1 ) {
        const pipe = new Pipe( this.arePipesOpenProperty, {
          position: position2D,
          isActive: i === 0,
          tandem: options.tandem.createTandem( `pipe${i}` )
        } );
        this.pipeArray.push( pipe );
      }
    }

    const dependencies = [
      ...this.waterCup3DArray.map( waterCup => waterCup.waterLevelProperty ),
      ...this.waterCup3DArray.map( waterCup => waterCup.isActiveProperty )
    ];

    // The implementation of DerivedProperty requires that any dependencies array passed has 15 or fewer elements.
    // .map() does not preserve a property of .length, requiring the usage of deriveAny.
    this.meanProperty = DerivedProperty.deriveAny( dependencies,
      () => {
        const mean = calculateMean( this.getActive3DCups().map( waterCup3D => waterCup3D.waterLevelProperty.value ) );
        assert && assert( mean >= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN && mean <= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX, 'mean out of bounds: ' + mean );
        return mean;
      },
      {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioDocumentation: 'The ground-truth water-level mean.',
        phetioReadOnly: true,
        phetioValueType: NumberIO
      } );

    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.lazyLink( ( numberOfCups: number, oldNumberOfCups: number ) => {

      // We only care about comparing water levels when a cup is removed, and need to grab the value before the cup is reset
      const removed3DCupWaterLevel = this.waterCup3DArray[ oldNumberOfCups - 1 ].waterLevelProperty.value;
      const removed2DCupWaterLevel = this.waterCup2DArray[ oldNumberOfCups - 1 ].waterLevelProperty.value;

      this.waterCup2DArray.forEach( ( waterCup, i ) => waterCup.isActiveProperty.set( i < numberOfCups ) );
      this.waterCup3DArray.forEach( ( waterCup, i ) => waterCup.isActiveProperty.set( i < numberOfCups ) );
      this.pipeArray.forEach( ( pipe, i ) => pipe.isActiveProperty.set( i < numberOfCups - 1 ) );

      if ( numberOfCups < oldNumberOfCups && removed3DCupWaterLevel !== removed2DCupWaterLevel ) {
        this.matchCupWaterLevels();
      }

      if ( !MeanShareAndBalanceQueryParameters.showAnimation ) {
        this.stepWaterLevels( 1 );
      }

      this.assertConsistentState();
    } );
  }

  private getNumberOfActiveCups(): number {
    const numberOf3DCups = this.getActive3DCups().length;
    const numberOf2DCups = this.getActive2DCups().length;

    assert && assert( numberOf3DCups === numberOf2DCups, `Number of cups should be equal. 2D cups: ${numberOf2DCups} 3D cups: ${numberOf3DCups}` );
    return numberOf3DCups;
  }

  public getActive3DCups(): Array<WaterCup> {
    return this.waterCup3DArray.filter( waterCup => waterCup.isActiveProperty.value );
  }

  public getActive2DCups(): Array<WaterCup> {
    return this.waterCup2DArray.filter( waterCup => waterCup.isActiveProperty.value );
  }

  public getActivePipes(): Array<Pipe> {
    return this.pipeArray.filter( pipe => pipe.isActiveProperty.value );
  }

  /**
   * Called during step(), levels out the water levels for the connected cups.
   * @param dt - time elapsed since last frame in seconds
   */
  private stepWaterLevels( dt: number ): void {

    // TODO: Rippling out
    // Just look at neighbors for the mean, rather than across all of the cups
    // iterate out from target cup
    // the new mean calculation needs to include itself plus neighbor cups

    if ( this.arePipesOpenProperty.value ) {
      this.getActive2DCups().forEach( cup => {
        const currentWaterLevel = cup.waterLevelProperty.value;
        const delta = this.meanProperty.value - currentWaterLevel;

        let discrepancy = 4;

        // Adjusts discrepancy so that water flows faster between cups when the mean is very low or very high.
        if ( this.meanProperty.value >= 0.9 ) {
          discrepancy = Utils.linear( 0.9, 1, 5, 50, this.meanProperty.value );
        }
        else if ( this.meanProperty.value <= 0.1 ) {
          discrepancy = Utils.linear( 0.1, 0, 5, 50, this.meanProperty.value );
        }

        // Animate water non-linearly. Higher discrepancy means the water will flow faster.
        // When the water levels are closer, it will slow down.
        let newWaterLevel = Math.max( 0, currentWaterLevel + delta * dt * discrepancy );

        // Clamp newWaterLevel to ensure it is not outside the currentWaterLevel and waterMean range.
        if ( this.meanProperty.value > currentWaterLevel ) {
          newWaterLevel = Utils.clamp( newWaterLevel, currentWaterLevel, this.meanProperty.value );
        }
        else {
          newWaterLevel = Utils.clamp( newWaterLevel, this.meanProperty.value, currentWaterLevel );
        }

        cup.waterLevelProperty.set( newWaterLevel );
      } );
    }
  }

  /**
   * Reset 2D waterLevelProperty to 3D waterLevelProperty.
   */
  private matchCupWaterLevels(): void {
    this.iterateCups( ( cup2D, cup3D ) => {
      cup2D.waterLevelProperty.set( cup3D.waterLevelProperty.value );
    } );
  }

  /**
   * Visit pairs of 2D/3D cups
   */
  private iterateCups( callback: ( cup2D: WaterCup, cup3D: WaterCup ) => void ): void {
    this.assertConsistentState();

    for ( let i = 0; i < this.numberOfCupsProperty.value; i++ ) {
      callback( this.getActive2DCups()[ i ], this.getActive3DCups()[ i ] );
    }
  }

  /**
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    this.assertConsistentState();
    this.stepWaterLevels( dt );
    this.pipeArray.forEach( pipe => pipe.step( dt ) );

    assert && assert( !phet.joist.sim.isSettingPhetioStateProperty.value, 'Cannot step while setting state' );
  }

  private assertConsistentState(): void {
    const numberOfCups = this.numberOfCupsProperty.value;
    assert && assert( numberOfCups === this.getNumberOfActiveCups(), `Expected ${numberOfCups} cups, but found: ${this.getNumberOfActiveCups()}.` );
    assert && assert( numberOfCups > 0, 'There should always be at least 1 cup' );
    assert && assert( this.getNumberOfActiveCups() - 1 === this.getActivePipes().length, `The length of pipes is: ${this.getActivePipes().length}, but should be one less the length of water cups or: ${this.getNumberOfActiveCups() - 1}.` );
    assert && assert( this.waterCup3DArray.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS}, but there were actually ${this.waterCup3DArray.length} cups` );
    assert && assert( this.waterCup2DArray.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS}, but there were actually ${this.waterCup2DArray.length} cups` );
  }

  public reset(): void {

    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();
    this.arePipesOpenProperty.reset();

    this.pipeArray.forEach( pipe => pipe.reset() );
    this.waterCup3DArray.forEach( waterCup3D => waterCup3D.reset() );
    this.waterCup2DArray.forEach( waterCup2D => waterCup2D.reset() );

    this.assertConsistentState();
  }


  /**
   * @param cup3DModel - The model for the affected 3D cup
   * @param waterLevel - the new water level from the 3D cup's listener
   * @param oldWaterLevel - the old water level from the 3D cup's listener
   */
  public changeWaterLevel( cup3DModel: WaterCup, waterLevel: number, oldWaterLevel: number ): void {
    const delta = waterLevel - oldWaterLevel;
    const cup2D = this.waterCup2DArray[ cup3DModel.linePlacement ];
    const cup2DWaterLevel = Utils.clamp( cup2D.waterLevelProperty.value + delta, 0, 1 );
    cup2D.waterLevelProperty.set( cup2DWaterLevel );
  }

  public syncData(): void {
    //abstract method... no longer need?
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );