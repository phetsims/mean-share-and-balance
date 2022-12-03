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
import WaterCup from './WaterCup.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';


type IntroModelOptions = PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class IntroModel extends MeanShareAndBalanceModel {

  // TODO: Should this be able to go to 0 for PhET-iO? https://github.com/phetsims/mean-share-and-balance/issues/18
  public readonly numberOfCupsRange = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS );
  public readonly dragRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;
  public readonly cupRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;

  public readonly numberOfCupsProperty: Property<number>;
  public readonly meanPredictionProperty: Property<number>;
  public readonly meanProperty: TReadOnlyProperty<number>;

  public readonly waterCup3DArray: WaterCup[];
  public readonly waterCup2DArray: WaterCup[];
  public readonly pipeArray: Pipe[];
  public readonly arePipesOpenProperty: Property<boolean>;

  // visible properties
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly meanVisibleProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;
  public readonly cupLevelVisibleProperty: Property<boolean>;

  public constructor( providedOptions: IntroModelOptions ) {

    const options = providedOptions;
    super( options );

    // Visibility properties
    this.predictMeanVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'predictMeanVisibleProperty' )
    } );
    this.meanVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'meanVisibleProperty' )
    } );
    this.tickMarksVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'tickMarksVisibleProperty' )
    } );
    this.cupLevelVisibleProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'cupLevelVisibleProperty' )
    } );


    this.meanPredictionProperty = new NumberProperty( 0, {
      range: MeanShareAndBalanceConstants.WATER_LEVEL_RANGE,

      // phet-io
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup'
    } );

    this.numberOfCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS, {
      numberType: 'Integer',
      range: this.numberOfCupsRange,

      // phetio
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' )
    } );

    this.arePipesOpenProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'arePipesOpenProperty' )
    } );

    // The 3D cups are the "ground truth" and the 2D cups mirror them
    this.waterCup3DArray = [];
    this.waterCup2DArray = [];
    this.pipeArray = [];

    const pipesParentTandem = options.tandem.createTandem( 'pipes' );
    const waterCups2DParentTandem = options.tandem.createTandem( 'waterCups2D' );
    const waterCups3DParentTandem = options.tandem.createTandem( 'waterCups3D' );

    // Statically allocate cups and pipes
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS; i++ ) {
      const x = i * ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH );
      const position3D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y );
      const waterLevel = i === 0 ? 0.75 : MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT;
      this.waterCup3DArray.push( new WaterCup( waterCups3DParentTandem.createTandem( `waterCup3D${i + 1}` ), {
        waterLevel: waterLevel,
        position: position3D,
        isActive: i <= 1,
        linePlacement: i
      } ) );

      const position2D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y );
      this.waterCup2DArray.push( new WaterCup( waterCups2DParentTandem.createTandem( `waterCup2D${i + 1}` ), {
        waterLevel: waterLevel,
        position: position2D,
        isActive: i <= 1,
        linePlacement: i,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } ) );

      if ( i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS - 1 ) {
        const pipe = new Pipe( this.arePipesOpenProperty, {
          position: position2D,
          isActive: i === 0,

          // phet-io
          tandem: pipesParentTandem.createTandem( `pipe${i + 1}` )
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
        // phet-io
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioDocumentation: 'The ground-truth water-level mean.',
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
   * Called as part of dragListener on 3D cups from changeWaterLevel.
   * Distributes water delta to neighbors at a gradually smaller fraction the further away from the target cup.
   * @param connectedCups - passed in from changeWaterLevel for testing
   * @param targetCup - the cup directly affected by the drag listener
   * @param waterDelta - the amount of water added or removed
   */
  private distributeWaterRipple( connectedCups: Array<WaterCup>, targetCup: WaterCup, waterDelta: number ): void {
    // Loop through neighbors with target cup at center
    for ( let i = 1; i < 7; i++ ) {
      const neighbors = connectedCups.filter( cup => Math.abs( targetCup.linePlacement - cup.linePlacement ) === i );

      // the larger the denominator the more subtle the ripple
      const fraction = waterDelta / ( i * 5 );

      // eslint-disable-next-line @typescript-eslint/no-loop-func
      neighbors.forEach( neighbor => {
        waterDelta -= fraction;

        const proposedValue = neighbor.waterLevelProperty.value + fraction;
        neighbor.waterLevelProperty.value = Utils.clamp( proposedValue, 0, 1 );
      } );
    }
  }

  /**
   * Called during step(), levels out the water levels for the connected cups.
   * @param dt - time elapsed since last frame in seconds
   */
  private stepWaterLevels( dt: number ): void {
    this.iterateCups( ( cup2D, cup3D ) => {
      const currentWaterLevel = cup2D.waterLevelProperty.value;
      let newWaterLevel;
      if ( this.arePipesOpenProperty.value ) {
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
        newWaterLevel = Math.max( 0, currentWaterLevel + delta * dt * discrepancy );

        // Clamp newWaterLevel to ensure it is not outside the currentWaterLevel and waterMean range.
        if ( this.meanProperty.value > currentWaterLevel ) {
          newWaterLevel = Utils.clamp( newWaterLevel, currentWaterLevel, this.meanProperty.value );
        }
        else {
          newWaterLevel = Utils.clamp( newWaterLevel, this.meanProperty.value, currentWaterLevel );
        }
      }
      else {
        const delta = cup3D.waterLevelProperty.value - currentWaterLevel;
        newWaterLevel = Utils.clamp( currentWaterLevel + delta * dt * 4, 0, 1 );
      }
      cup2D.waterLevelProperty.set( newWaterLevel );
    } );
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
  }

  private assertConsistentState(): void {
    const numberOfCups = this.numberOfCupsProperty.value;
    assert && assert( numberOfCups === this.getNumberOfActiveCups(), `Expected ${numberOfCups} cups, but found: ${this.getNumberOfActiveCups()}.` );
    assert && assert( numberOfCups > 0, 'There should always be at least 1 cup' );
    assert && assert( this.getNumberOfActiveCups() - 1 === this.getActivePipes().length, `The length of pipes is: ${this.getActivePipes().length}, but should be one less the length of water cups or: ${this.getNumberOfActiveCups() - 1}.` );
    assert && assert( this.waterCup3DArray.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.waterCup3DArray.length} cups` );
    assert && assert( this.waterCup2DArray.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.waterCup2DArray.length} cups` );
  }

  public reset(): void {
    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();
    this.arePipesOpenProperty.reset();

    this.predictMeanVisibleProperty.reset();
    this.meanVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();
    this.cupLevelVisibleProperty.reset();

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

    this.arePipesOpenProperty.value && this.distributeWaterRipple( this.getActive2DCups(), cup2D, delta );
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );