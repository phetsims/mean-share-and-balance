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
  private readonly isResettingProperty = new BooleanProperty( false, { phetioFeatured: false } );

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
        isResettingProperty: this.isResettingProperty,
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
        const pipe = new Pipe( {
          position: position2D,
          isOpen: false,
          isActive: i === 0,
          tandem: options.tandem.createTandem( `pipe${i}` )
        } );
        this.pipeArray.push( pipe );

        pipe.isCurrentlyClickedProperty.lazyLink( isCurrentlyClicked => {
          if ( isCurrentlyClicked ) {
            this.updateEnabledRange( this.waterCup3DArray[ i ], this.waterCup2DArray[ i ] );
            this.updateEnabledRange( this.waterCup3DArray[ i + 1 ], this.waterCup2DArray[ i + 1 ] );
          }
        } );
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
        assert && assert( mean >= MeanShareAndBalanceConstants.CUP_RANGE_MIN && mean <= MeanShareAndBalanceConstants.CUP_RANGE_MAX, 'mean out of bounds: ' + mean );
        return mean;
      },
      {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioDocumentation: 'The ground-truth water-level mean.',
        phetioReadOnly: true,
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
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
   * Return array of sets of cups connected by open pipes
   */
  private getSetsOfConnectedCups(): Array<Set<WaterCup>> {
    const setsOfConnectedCups: Array<Set<WaterCup>> = [];
    let currentSet = new Set<WaterCup>();
    let index = 0;

    // organize into sets of connected cups
    this.getActive2DCups().forEach( cup => {
      currentSet.add( cup );
      if ( this.getActivePipes().length > index ) {
        if ( !this.pipeArray[ index ].isOpenProperty.value ) {
          setsOfConnectedCups.push( currentSet );
          currentSet = new Set<WaterCup>();
        }
        index += 1;
      }
      else if ( this.getActive2DCups()[ this.getActive2DCups().length - 1 ] === cup ) {
        setsOfConnectedCups.push( currentSet );
      }
    } );

    return setsOfConnectedCups;
  }

  /**
   * Called during step(), levels out the water levels for the connected cups.
   * @param dt - time elapsed since last frame in seconds
   */
  private stepWaterLevels( dt: number ): void {
    const setsOfConnectedCups = this.getSetsOfConnectedCups();

    // calculate and set mean
    setsOfConnectedCups.forEach( cupsSet => {
      const waterMean = calculateMean( Array.from( cupsSet ).map( cup => cup.waterLevelProperty.value ) );
      cupsSet.forEach( cup => {
        const currentWaterLevel = cup.waterLevelProperty.value;
        const delta = waterMean - currentWaterLevel;

        let discrepancy = 5;

        // Adjusts discrepancy so that water flows faster between cups when the mean is very low or very high.
        if ( waterMean >= 0.9 ) {
          discrepancy = Utils.linear( 0.9, 1, 5, 50, waterMean );
        }
        else if ( waterMean <= 0.1 ) {
          discrepancy = Utils.linear( 0.1, 0, 5, 50, waterMean );
        }

        // Animate water non-linearly. Higher discrepancy means the water will flow faster.
        // When the water levels are closer, it will slow down.
        let newWaterLevel = Math.max( 0, currentWaterLevel + delta * dt * discrepancy );

        // Clamp newWaterLevel to ensure it is not outside the currentWaterLevel and waterMean range.
        if ( waterMean > currentWaterLevel ) {
          newWaterLevel = Utils.clamp( newWaterLevel, currentWaterLevel, waterMean );
        }
        else {
          newWaterLevel = Utils.clamp( newWaterLevel, waterMean, currentWaterLevel );
        }

        cup.waterLevelProperty.set( newWaterLevel );
      } );
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
   * Matches the 2D cup water level representations to their respective 3D cup water level
   * Will close all open pipe valves
   * Called when the syncDataRectangularButton is pressed.
   */
  public syncData(): void {
    this.assertConsistentState();
    this.pipeArray.forEach( pipe => pipe.isOpenProperty.set( false ) );
    this.matchCupWaterLevels();
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

    this.iterateCups( ( cup2D, cup3D ) => this.updateEnabledRange( cup3D, cup2D ) );
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

    // Short circuit changeWaterLevel during reset.
    this.isResettingProperty.set( true );

    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();

    this.pipeArray.forEach( pipe => pipe.reset() );
    this.waterCup3DArray.forEach( waterCup3D => waterCup3D.reset() );
    this.waterCup2DArray.forEach( waterCup2D => waterCup2D.reset() );

    this.isResettingProperty.set( false );

    this.assertConsistentState();
  }

  /**
   * Constrains water level deltas within cup range.
   * @param delta - the number value between the oldWaterLevel and the newWaterLevel
   * @param range - the allowed waterLevelProperty range in each cup
   * @param waterLevelProperty - The property tracking the water level in each cup's model.
   */
  private static constrainDelta( delta: number, range: Range, waterLevelProperty: Property<number> ): number {
    const newWaterLevel = waterLevelProperty.value + delta;
    const constrainedWaterLevel = range.constrainValue( newWaterLevel );
    return constrainedWaterLevel - waterLevelProperty.value;
  }

  // recursive function
  // base case: water delta can be distributed evenly amongst all connected cups
  // => if so divide water delta equally among them.
  // else: find bottleneck cup
  //    - waterDelta positive = fullest cup
  //    - waterDelta negative = lowest cup
  // => take what you can from that cup, change waterDelta
  // => remove bottleneck cup from connected cups
  // Go again
  // exit recursive function if set of connected cups is empty, then revert 3DCup by remaining waterDelta

  private evenlyDistributeWater( connectedCups: Array<WaterCup>, waterDelta: number ): number {

    if ( !connectedCups.length ) {
      return waterDelta;
    }

    const meanWaterDelta = waterDelta / connectedCups.length;
    const isDivisible = connectedCups.every( cup => {
      const remainingCupSpace = cup.waterLevelProperty.value + meanWaterDelta;
      return remainingCupSpace >= 0 && remainingCupSpace <= 1;
    } );

    // base case
    if ( isDivisible ) {
      connectedCups.forEach( cup => { cup.waterLevelProperty.value += meanWaterDelta; } );
      return 0;
    }

    // else case
    let bottleneckCup: WaterCup;
    if ( waterDelta < 0 ) {
      bottleneckCup = connectedCups.reduce( ( previousCup, currentCup ) => ( previousCup.waterLevelProperty.value > currentCup.waterLevelProperty.value ) ? previousCup : currentCup );
      waterDelta += bottleneckCup.waterLevelProperty.value;
      bottleneckCup.waterLevelProperty.value = 0;
    }
    else {
      bottleneckCup = connectedCups.reduce( ( previousCup, currentCup ) => ( previousCup.waterLevelProperty.value < currentCup.waterLevelProperty.value ) ? previousCup : currentCup );
      waterDelta -= 1 - bottleneckCup.waterLevelProperty.value;
      bottleneckCup.waterLevelProperty.value = 1;
    }

    const filteredCups = connectedCups.filter( cup => cup !== bottleneckCup );

    return this.evenlyDistributeWater( filteredCups, waterDelta );
  }

  //TODO: distribute as much water to starting cup first then iterate out.
  private distributeWater( connectedCups: Array<WaterCup>, startingCup: WaterCup, waterDelta: number ): void {
    let remainingWaterDelta = waterDelta;

    const waterDeltaBefore = remainingWaterDelta;
    remainingWaterDelta = this.evenlyDistributeWater( connectedCups, remainingWaterDelta );
    assert && assert( Math.abs( remainingWaterDelta ) <= Math.abs( waterDeltaBefore ), 'remaining water to distribute should be decreasing' );


    // If the 3D water cup tried to go further than it was allowed, then revert by that amount.
    if ( Math.abs( remainingWaterDelta ) > 1E-6 ) {
      const associated3DCup = this.waterCup3DArray[ startingCup.linePlacement ];
      associated3DCup.waterLevelProperty.value += remainingWaterDelta;
    }

    assert && assert( remainingWaterDelta <= 1E-6, `The remainingWaterDelta is too high: ${remainingWaterDelta}` );
  }

  /**
   * @param cup3DModel - The model for the affected 3D cup
   * @param waterDelta - The amount of water added (positive) or removed (negative)
   */
  public changeWaterLevel( cup3DModel: WaterCup, waterDelta: number ): void {

    // During reset we only want to specify the exact values of the waterLevelProperties.
    // We do not want to compensate with waterLevel deltas.
    if ( this.isResettingProperty.value ) {
      return;
    }

    if ( waterDelta !== 0 ) {
      const index = this.waterCup3DArray.indexOf( cup3DModel );
      const cup2DModel = this.waterCup2DArray[ index ];
      const connectedCups = this.getCupsConnectedToTargetCup( cup2DModel );
      assert && assert( waterDelta <= connectedCups.length, `The water delta is: ${waterDelta}, but there are only ${connectedCups.length} connected cups.` );
      this.distributeWater( connectedCups, cup2DModel, waterDelta );
    }

    const total2DWater = _.sum( this.waterCup2DArray.map( cup => cup.waterLevelProperty.value ) );
    const total3DWater = _.sum( this.waterCup3DArray.map( cup => cup.waterLevelProperty.value ) );
    const totalWaterThreshold = Math.abs( total2DWater - total3DWater );

    assert && assert( totalWaterThreshold <= 1E-8, `Total 2D and 3D water should be equal. 2D Water: ${total2DWater} 3D Water: ${total3DWater}` );

  }

  private getCupsConnectedToTargetCup( cup2DModel: WaterCup ): WaterCup[] {
    const setsOfConnectedCups = this.getSetsOfConnectedCups();
    const setsThatContainTargetCup = setsOfConnectedCups.filter( set => set.has( cup2DModel ) );
    assert && assert( setsThatContainTargetCup.length === 1, 'there should be exactly one set with our target cup' );
    return Array.from( setsThatContainTargetCup[ 0 ] );
  }

  public updateEnabledRange( cup3DModel: WaterCup, cup2DModel: WaterCup ): void {

    const connectedCups = this.getCupsConnectedToTargetCup( cup2DModel );

    // Add up the total amount of water in the connected cups
    const totalWater = _.sum( connectedCups.map( cup => cup.waterLevelProperty.value ) );
    const maxWater = connectedCups.length;

    const missingWater = maxWater - totalWater;
    const maxValue = cup3DModel.waterLevelProperty.value + missingWater;
    const max = Math.min( maxValue, 1 );

    assert && assert( totalWater >= 0, `Total water should be non-negative. Total water: ${totalWater}` );

    // 3D cup's drag range is determined by the amount of total water and space in the connected 2D cup representations.
    const min = Math.max( cup3DModel.waterLevelProperty.value - totalWater, 0 );

    cup3DModel.enabledRangeProperty.set( new Range( min, max ) );
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );