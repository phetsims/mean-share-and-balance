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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';

type SelfOptions = EmptySelfOptions;

type IntroModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

export default class IntroModel extends MeanShareAndBalanceModel {

  // TODO: Should this be able to go to 0 for PhET-iO? https://github.com/phetsims/mean-share-and-balance/issues/18
  public readonly numberOfCupsRange = new Range( 1, 7 );
  public readonly dragRange = new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX );
  public readonly cupRange = new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX );

  public readonly numberOfCupsProperty: Property<number>;
  public readonly meanPredictionProperty: Property<number>;
  public readonly meanProperty: IReadOnlyProperty<number>;

  public readonly waterCup3DArray: WaterCup[];
  public readonly waterCup2DArray: WaterCup[];
  public readonly pipeArray: Pipe[];
  private readonly isResetting = new BooleanProperty( false, { phetioFeatured: false } );

  public constructor( providedOptions?: IntroModelOptions ) {

    const options = optionize<IntroModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );


    this.meanPredictionProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup',
      range: new Range( MeanShareAndBalanceConstants.CUP_RANGE_MIN, MeanShareAndBalanceConstants.CUP_RANGE_MAX )
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

    for ( let i = 0; i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS; i++ ) {
      const x = i * ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH );
      const position3D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_3D_CENTER_Y );
      const waterLevel = i === 0 ? 0.75 : MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT;
      this.waterCup3DArray.push( new WaterCup( {
        tandem: options.tandem.createTandem( `waterCup3D${i}` ),
        waterLevel: waterLevel,
        position: position3D,
        isActive: i <= 1,
        isResetting: this.isResetting
      } ) );

      const position2D = new Vector2( x, MeanShareAndBalanceConstants.CUPS_2D_CENTER_Y );
      this.waterCup2DArray.push( new WaterCup( {
        tandem: options.tandem.createTandem( `waterCup2D${i}` ),
        waterLevel: waterLevel,
        position: position2D,
        isActive: i <= 1,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } ) );

      if ( i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_CUPS - 1 ) {
        this.pipeArray.push( new Pipe( {
          position: position2D,
          isOpen: false,
          isActive: i === 0,
          tandem: options.tandem.createTandem( `pipe${i}` )
        } ) );
      }
    }

    // This value is derived from the water levels in all the cups, but cannot be modeled as a DerivedProperty since
    // the number of cups varies
    const dependencies = [
      ...this.waterCup3DArray.map( waterCup => waterCup.waterLevelProperty ),
      ...this.waterCup3DArray.map( waterCup => waterCup.isActiveProperty )
    ];

    // map() does not preserve a property of .length required for DerivedProperty
    this.meanProperty = DerivedProperty.deriveAny( dependencies,
      () => {
        const mean = calculateMean( this.getActive3DCups().map( waterCup3D => waterCup3D.waterLevelProperty.value ) );
        assert && assert( mean >= MeanShareAndBalanceConstants.CUP_RANGE_MIN && mean <= MeanShareAndBalanceConstants.CUP_RANGE_MAX, 'mean out of bounds: ' + mean );
        return mean;
      },
      {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioDocumentation: 'The ground truth water level mean.',
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
    assert && assert( this.waterCup3DArray.length === 7, 'There should be a static amount of 7 cups.' );
    assert && assert( this.waterCup2DArray.length === 7, 'There should be a static amount of 7 cups.' );
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

    assert && assert( !phet.joist.sim.isSettingPhetioStateProperty.value, 'Cannot step while setting state' );

    this.iterateCups( ( cup2D, cup3D ) => {

      // Whichever cup (2D or 3D) has more determines how high the user can drag that value.
      // If the 3D cup has more, the user can drag to 1.
      const max = Math.min( 1 - cup2D.waterLevelProperty.value + cup3D.waterLevelProperty.value, 1 );

      // Whichever cup (2d or 3d cup) has less determines how low the user can drag that value.
      // If the 3d cup has less, the user can drag all the way to 0.
      const min = Math.max( cup3D.waterLevelProperty.value - cup2D.waterLevelProperty.value, 0 );

      // Constrain range based on remaining space in cups.
      cup3D.enabledRangeProperty.set( new Range( min, max ) );
    } );
  }

  private assertConsistentState(): void {
    const numberOfCups = this.numberOfCupsProperty.value;
    assert && assert( numberOfCups === this.getNumberOfActiveCups(), `Expected ${numberOfCups} cups, but found: ${this.getNumberOfActiveCups()}.` );
    assert && assert( numberOfCups > 0, 'There should always be at least 1 cup' );
    assert && assert( this.getNumberOfActiveCups() - 1 === this.getActivePipes().length, `The length of pipes is: ${this.getActivePipes().length}, but should be one less the length of water cups or: ${this.getNumberOfActiveCups() - 1}.` );
  }

  public reset(): void {

    // Short circuit changeWaterLevel during reset.
    this.isResetting.set( true );

    this.numberOfCupsProperty.reset();
    this.meanPredictionProperty.reset();

    this.pipeArray.forEach( pipe => pipe.reset() );
    this.waterCup3DArray.forEach( waterCup3D => waterCup3D.reset() );
    this.waterCup2DArray.forEach( waterCup2D => waterCup2D.reset() );

    this.isResetting.set( false );

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

  /**
   * @param cup3DModel - The model for the affected 3D cup
   * @param adapterProperty - allows us to confirm water levels and their deltas are within range before setting each cup's own waterLevelProperty.
   *  Without an adapter property waterLevels become disconnected, and our visual representations do not match the data set.
   * @param waterLevel - The current waterLevel
   * @param oldWaterLevel - The previous waterLevel
   */
  public changeWaterLevel( cup3DModel: WaterCup, adapterProperty: Property<number>, waterLevel: number, oldWaterLevel: number ): void {

    // During reset we only want to specify the exact values of the adapterProperty and waterLevelProperties.
    // We do not want to compensate with waterLevel deltas.
    if ( this.isResetting.value ) {
      return;
    }

    assert && assert( this.waterCup3DArray.length === 7, 'There should be a static amount of 7 cups.' );
    assert && assert( this.waterCup2DArray.length === 7, 'There should be a static amount of 7 cups.' );

    const index = this.waterCup3DArray.indexOf( cup3DModel );
    const new2DCup = this.waterCup2DArray[ index ];

    const proposedDelta = waterLevel - oldWaterLevel;

    const constrained2DDelta = IntroModel.constrainDelta( proposedDelta, this.cupRange, new2DCup.waterLevelProperty );
    const constrained3DDelta = IntroModel.constrainDelta( proposedDelta, this.cupRange, cup3DModel.waterLevelProperty );

    // Use whichever delta is more limiting
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

    const total2DWater = _.sum( this.waterCup2DArray.map( cup => cup.waterLevelProperty.value ) );
    const total3DWater = _.sum( this.waterCup3DArray.map( cup => cup.waterLevelProperty.value ) );
    const totalWaterThreshold = Math.abs( total2DWater - total3DWater );
    assert && assert( totalWaterThreshold <= 1E-8, `Total 2D and 3D water should be equal. 2D Water: ${total2DWater} 3D Water: ${total3DWater}` );
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );