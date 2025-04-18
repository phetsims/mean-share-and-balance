// Copyright 2022-2025, University of Colorado Boulder

/**
 * Model for the LevelOut screen, which includes tableCups, notepadCups, connecting pipes, and view options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnabledProperty from '../../../../axon/js/EnabledProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import VoidIO from '../../../../tandem/js/types/VoidIO.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Cup, { WATER_LEVEL_ROUNDING_INTERVAL } from './Cup.js';
import Pipe from './Pipe.js';

type LevelOutModelOptions = EmptySelfOptions & WithRequired<PhetioObjectOptions, 'tandem'>;

// constants
const DEFAULT_INITIAL_WATER_LEVELS = [ 0.75, 0.5, 0.2, 0.65, 0.9, 0.35, 0.75 ];
const NUMBER_OF_CUPS_RANGE = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS );
const INTER_CUP_DISTANCE = MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH;

export default class LevelOutModel extends PhetioObject implements TModel {

  // The range controls the drag range of the slider control
  public readonly dragRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;
  public readonly numberOfCupsRangeProperty: Property<Range>;
  public readonly numberOfCupsProperty: Property<number>;

  public readonly meanPredictionProperty: Property<number>;
  public readonly meanValueProperty: TReadOnlyProperty<number>;

  public readonly tableCups: Cup[];
  public readonly notepadCups: Cup[];

  public readonly pipeArray: Pipe[];

  // When pipes are open water will flow through and evenly level out.
  public readonly pipesOpenProperty: Property<boolean>;
  public readonly pipesEnabledProperty: Property<boolean>;

  // Tracks whether the water levels in the notepadCups match the mean.
  public readonly waterLevelsMatchMeanProperty: TReadOnlyProperty<boolean>;

  // visible Properties
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;

  // phet-io specific Properties
  public readonly successIndicatorsOperatingProperty: Property<boolean>;
  private readonly maxCupsProperty: Property<number>;
  private readonly initialWaterLevelsProperty: Property<number[]>;

  public constructor( providedOptions: LevelOutModelOptions ) {

    const options = optionize<LevelOutModelOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      phetioType: LevelOutModel.LevelOutModelIO,
      phetioState: false,
      phetioDocumentation: 'The model for the LevelOut screen, which includes tableCups and notepadCups.',
      isDisposable: false
    }, providedOptions );

    super( options );

    // Visibility properties
    this.predictMeanVisibleProperty = new BooleanProperty( false, {
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'predictMeanVisibleProperty' )
    } );
    this.tickMarksVisibleProperty = new BooleanProperty( false, {
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'tickMarksVisibleProperty' )
    } );


    this.meanPredictionProperty = new NumberProperty( 0, {
      range: MeanShareAndBalanceConstants.WATER_LEVEL_RANGE,

      // phet-io
      tandem: options.tandem.createTandem( 'meanPredictionProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Indicates where the user predicted the mean would be, or the default value at startup'
    } );

    this.numberOfCupsRangeProperty = new Property( NUMBER_OF_CUPS_RANGE );

    this.numberOfCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_CUPS, {
      numberType: 'Integer',
      range: this.numberOfCupsRangeProperty,

      // phet-io
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'numberOfCupsProperty' )
    } );

    this.maxCupsProperty = new NumberProperty( MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, {
      numberType: 'Integer',
      range: NUMBER_OF_CUPS_RANGE,

      // phet-io
      phetioDocumentation: 'The maximum number of cups that can be displayed in the simulation. The simulation will reset when the number of max cups is changed.',
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'maxCupsProperty' )
    } );

    const pipesParentTandem = options.tandem.createTandem( 'pipes' );

    this.pipesOpenProperty = new BooleanProperty( false, {
      phetioFeatured: true,
      tandem: pipesParentTandem.createTandem( 'pipesOpenProperty' )
    } );
    this.pipesEnabledProperty = new EnabledProperty( true, {
      tandem: pipesParentTandem.createTandem( EnabledProperty.TANDEM_NAME )
    } );
    const notepadCupsParentTandem = options.tandem.createTandem( 'notepadCups' );
    const tableCupsParentTandem = options.tandem.createTandem( 'tableCups' );

    this.initialWaterLevelsProperty = new Property( DEFAULT_INITIAL_WATER_LEVELS, {
      tandem: options.tandem.createTandem( 'initialWaterLevelsProperty' ),
      isValidValue: ( waterLevels: number[] ) =>
        waterLevels.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS &&
        _.every( waterLevels,
          waterLevel => waterLevel >= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN
        && waterLevel <= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX ),
      phetioValueType: ArrayIO( NumberIO ),
      phetioFeatured: true,
      phetioDocumentation: `Set the initial water levels of each cup. The array length should be equal to ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS} (the default max number of cups).` +
                           `The water levels should be between ${MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN} and ${MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX}.` +
                           `The default initial water levels are: ${DEFAULT_INITIAL_WATER_LEVELS}.`
    } );

    // Statically allocate cups and pipes
    // The tableCups are the "ground truth" and the notepadCups mirror them.
    this.tableCups = [];
    this.notepadCups = [];
    this.pipeArray = [];
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS; i++ ) {
      const totalSpan = Math.max( ( this.numberOfCupsProperty.value - 1 ) * ( INTER_CUP_DISTANCE ), 0 );
      const leftCupCenterX = -( totalSpan / 2 );
      const initialXPosition = leftCupCenterX + ( i * INTER_CUP_DISTANCE ) - MeanShareAndBalanceConstants.CUP_WIDTH / 2;
      const waterLevel = this.initialWaterLevelsProperty.value[ i ];
      this.tableCups.push( new Cup( tableCupsParentTandem.createTandem( `tableCup${i + 1}` ), {
        waterLevel: waterLevel,
        xPosition: initialXPosition,
        isActive: i <= 1,
        linePlacement: i,
        isTableCup: true
      } ) );

      this.notepadCups.push( new Cup( notepadCupsParentTandem.createTandem( `notepadCup${i + 1}` ), {
        waterLevel: waterLevel,
        xPosition: initialXPosition,
        isActive: i <= 1,
        linePlacement: i,
        isTableCup: false,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } ) );

      if ( i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS - 1 ) {
        const pipe = new Pipe( this.pipesOpenProperty, {
          xPosition: initialXPosition + MeanShareAndBalanceConstants.CUP_WIDTH,
          isActive: i === 0,

          // phet-io
          tandem: pipesParentTandem.createTandem( `pipe${i + 1}` )
        } );
        this.pipeArray.push( pipe );
      }
    }

    const meanDependencies = [
      ...this.tableCups.map( waterCup => waterCup.waterLevelProperty ),
      ...this.tableCups.map( waterCup => waterCup.isActiveProperty )
    ];
    this.meanValueProperty = DerivedProperty.deriveAny( meanDependencies,
      () => {
        const mean = calculateMean( this.getActiveTableCups().map( tableCup => tableCup.waterLevelProperty.value ) );
        assert && assert( mean >= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MIN && mean <= MeanShareAndBalanceConstants.WATER_LEVEL_RANGE_MAX, 'mean out of bounds: ' + mean );
        return mean;
      },
      {
        // phet-io
        phetioFeatured: true,
        tandem: options.tandem.createTandem( 'meanValueProperty' ),
        phetioDocumentation: 'The ground-truth water-level mean.',
        phetioValueType: NumberIO
      } );

    // add/remove water cups and pipes according to number spinner
    this.numberOfCupsProperty.lazyLink( ( numberOfCups: number, oldNumberOfCups: number ) => {
      const totalSpan = Math.max( ( numberOfCups - 1 ) * ( INTER_CUP_DISTANCE ), 0 );
      const leftCupCenterX = -( totalSpan / 2 );

      // We only care about comparing water levels when a cup is removed, and need to grab the value before the cup is reset
      const removedTableCupWaterLevel = this.tableCups[ oldNumberOfCups - 1 ].waterLevelProperty.value;
      const removedNotepadCupWaterLevel = this.notepadCups[ oldNumberOfCups - 1 ].waterLevelProperty.value;

      this.notepadCups.forEach( ( waterCup, i ) => {
        waterCup.isActiveProperty.set( i < numberOfCups );
        waterCup.xPositionProperty.value = leftCupCenterX + ( i * INTER_CUP_DISTANCE ) - MeanShareAndBalanceConstants.CUP_WIDTH / 2;
      } );
      this.tableCups.forEach( ( waterCup, i ) => {
        waterCup.isActiveProperty.set( i < numberOfCups );
        waterCup.xPositionProperty.value = leftCupCenterX + ( i * INTER_CUP_DISTANCE ) - MeanShareAndBalanceConstants.CUP_WIDTH / 2;
      } );
      this.pipeArray.forEach( ( pipe, i ) => {
        pipe.isActiveProperty.set( i < numberOfCups - 1 );
        pipe.xPositionProperty.value = leftCupCenterX + ( i * INTER_CUP_DISTANCE ) + MeanShareAndBalanceConstants.CUP_WIDTH / 2;
      } );

      // When we remove a cup and the water levels are different between the notepad and table representations
      // we need to synchronize the values first
      if ( numberOfCups < oldNumberOfCups && removedTableCupWaterLevel !== removedNotepadCupWaterLevel ) {
        this.matchCupWaterLevels();
      }
      this.assertConsistentState();
    } );

    const waterLevelDependencies = this.notepadCups.map( waterCup => waterCup.waterLevelProperty );
    const activeCupsDependencies = this.notepadCups.map( waterCup => waterCup.isActiveProperty );
    this.waterLevelsMatchMeanProperty = DerivedProperty.deriveAny( [
      ...waterLevelDependencies,
      ...activeCupsDependencies,
      this.meanValueProperty
    ], () => {
      return _.every( this.getActiveNotepadCups(), notepadCup =>
        Utils.roundToInterval( notepadCup.waterLevelProperty.value, 0.1 ) === Utils.roundToInterval( this.meanValueProperty.value, 0.1 ) );
    } );

    // For phet-io client use only.
    this.successIndicatorsOperatingProperty = new BooleanProperty( true, {
      phetioDocumentation: 'A Property that controls whether visual and audio elements are activated to indicate success when a user has gotten close to or matched the mean with the meanPredictionLine.',
      phetioFeatured: true,
      tandem: options.tandem.createTandem( 'successIndicatorsOperatingProperty' )
    } );
    this.maxCupsProperty.lazyLink( max => {
      this.resetData();
      this.numberOfCupsProperty.value = Math.min( this.numberOfCupsProperty.value, max );
      this.numberOfCupsRangeProperty.value = new Range( NUMBER_OF_CUPS_RANGE.min, max );
    } );
    this.initialWaterLevelsProperty.link( waterLevels => {

      // We change both the value and initial value of each cup's waterLevelProperty because client has set initial
      // water values, and we want waterLevelProperty.reset to behave correctly.
      this.tableCups.forEach( ( tableCup, i ) => {
        tableCup.waterLevelProperty.value = waterLevels[ i ];
        tableCup.waterLevelProperty.setInitialValue( this.initialWaterLevelsProperty.value[ i ] );
      } );
      this.notepadCups.forEach( ( notepadCup, i ) => {
        notepadCup.waterLevelProperty.value = waterLevels[ i ];
        notepadCup.waterLevelProperty.setInitialValue( this.initialWaterLevelsProperty.value[ i ] );
      } );

      this.matchCupWaterLevels();
    } );
  }

  private getNumberOfActiveCups(): number {
    const numberOfTableCups = this.getActiveTableCups().length;
    const numberOfNotepadCups = this.getActiveNotepadCups().length;

    assert && assert( numberOfTableCups === numberOfNotepadCups, `Number of cups should be equal. notepad cups: ${numberOfNotepadCups} table cups: ${numberOfTableCups}` );
    return numberOfTableCups;
  }

  public getActiveTableCups(): Array<Cup> {
    return this.tableCups.filter( waterCup => waterCup.isActiveProperty.value );
  }

  public getActiveNotepadCups(): Array<Cup> {
    return this.notepadCups.filter( waterCup => waterCup.isActiveProperty.value );
  }

  public getActivePipes(): Array<Pipe> {
    return this.pipeArray.filter( pipe => pipe.isActiveProperty.value );
  }

  /**
   * Called as part of dragListener on tableCups from changeWaterLevel.
   * Distributes water delta to neighbors at a gradually smaller fraction the further away from the target cup.
   * @param connectedCups - passed in from changeWaterLevel for testing
   * @param targetCup - the cup directly affected by the drag listener
   * @param waterDelta - the amount of water added or removed
   */
  private distributeWaterRipple( connectedCups: Array<Cup>, targetCup: Cup, waterDelta: number ): void {

    // Define the callback function outside the loop
    const updateNeighborWaterLevel = ( neighbor: Cup, fraction: number ) => {
      waterDelta -= fraction;

      const proposedValue = neighbor.waterLevelProperty.value + fraction;
      neighbor.waterLevelProperty.value = Utils.clamp( proposedValue, 0, 1 );
    };

    // Loop through neighbors with target cup at center
    for ( let i = 1; i < connectedCups.length; i++ ) {
      const neighbors = connectedCups.filter( cup => Math.abs( targetCup.linePlacement - cup.linePlacement ) === i );

      // the larger the denominator the more subtle the ripple
      const fraction = waterDelta / ( i * 5 );

      neighbors.forEach( neighbor => updateNeighborWaterLevel( neighbor, fraction ) );
    }
  }

  /**
   * Called during step(), causes water to flow between the cups as needed based on their levels and whether the pipes
   * are open or closed.
   * @param dt - (delta time) - time elapsed since last step, in seconds
   */
  private stepWaterLevels( dt: number ): void {

    const roundedMeanValue = Utils.roundToInterval( this.meanValueProperty.value, WATER_LEVEL_ROUNDING_INTERVAL );

    // Determine whether water exchange is needed between the cups.  Exchange is needed when either the pipes are open
    // and the notepad cups aren't all at the mean value, or when the pipes are closed and the cups don't have the same
    // value as their counterpart table cups.
    let waterExchangeNeeded = false;
    this.iterateActiveCups( ( notepadCup, tableCup ) => {
      if ( ( this.pipesOpenProperty.value && notepadCup.waterLevelProperty.value !== roundedMeanValue ) ||
           !this.pipesOpenProperty.value && notepadCup.waterLevelProperty.value !== tableCup.waterLevelProperty.value ) {
        waterExchangeNeeded = true;
      }
    } );
    if ( waterExchangeNeeded ) {

      // Loop through the cups and make water flow between them based on the state of the pipe valves and the current
      // water levels.
      this.iterateActiveCups( ( notepadCup, tableCup ) => {
        const currentWaterLevel = notepadCup.waterLevelProperty.value;
        let newWaterLevel;
        if ( this.pipesOpenProperty.value ) {
          const delta = this.meanValueProperty.value - currentWaterLevel;

          let discrepancy = 4;

          // Adjusts discrepancy so that water flows faster between cups when the mean is very low or very high.
          if ( this.meanValueProperty.value >= 0.9 ) {
            discrepancy = Utils.linear( 0.9, 1, 5, 50, this.meanValueProperty.value );
          }
          else if ( this.meanValueProperty.value <= 0.1 ) {
            discrepancy = Utils.linear( 0.1, 0, 5, 50, this.meanValueProperty.value );
          }

          // Animate water non-linearly. Higher discrepancy means the water will flow faster.
          // When the water levels are closer, it will slow down.
          newWaterLevel = Math.max( 0, currentWaterLevel + delta * dt * discrepancy );

          // Clamp newWaterLevel to ensure it is not outside the currentWaterLevel and waterMean range.
          if ( this.meanValueProperty.value > currentWaterLevel ) {
            newWaterLevel = Utils.clamp( newWaterLevel, currentWaterLevel, this.meanValueProperty.value );
          }
          else {
            newWaterLevel = Utils.clamp( newWaterLevel, this.meanValueProperty.value, currentWaterLevel );
          }
        }
        else {
          const delta = tableCup.waterLevelProperty.value - currentWaterLevel;
          newWaterLevel = Utils.clamp( currentWaterLevel + delta * dt * 4, 0, 1 );
        }
        notepadCup.waterLevelProperty.set( newWaterLevel );
      } );
    }
  }

  /**
   * Reset notepadCup waterLevelProperty to tableCup waterLevelProperty.
   */
  private matchCupWaterLevels(): void {
    this.iterateActiveCups( ( notepadCup, tableCup ) => {
      notepadCup.waterLevelProperty.set( tableCup.waterLevelProperty.value );
    } );
  }

  /**
   * Visit pairs of active table/notepad cups
   */
  private iterateActiveCups( callback: ( notepadCup: Cup, tableCup: Cup, index: number ) => void ): void {
    this.assertConsistentState();

    for ( let i = 0; i < this.numberOfCupsProperty.value; i++ ) {
      callback( this.getActiveNotepadCups()[ i ], this.getActiveTableCups()[ i ], i );
    }
  }

  /**
   * For use by PhET-iO clients. Sets the waterLevelProperty of the table cups to the provided array
   * of numbers. If the array is longer than the number of table cups, the excess values are ignored.
   */
  public setDataPoints( dataPoints: number[] ): void {
    this.resetData();
    this.numberOfCupsProperty.value = dataPoints.length;
    dataPoints.forEach( ( dataPoint, index ) => {
      this.tableCups[ index ].waterLevelProperty.set( dataPoint );
    } );
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
    assert && assert( this.tableCups.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.tableCups.length} cups` );
    assert && assert( this.notepadCups.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.notepadCups.length} cups` );
  }

  /**
   * Resets the data in the simulation to it's initial state.
   */
  private resetData(): void {
    this.numberOfCupsProperty.reset();
    this.pipeArray.forEach( pipe => pipe.reset() );
    this.tableCups.forEach( tableCup => tableCup.reset() );
    this.notepadCups.forEach( notepadCup => notepadCup.reset() );

    // The maximum number of cups should still be respected after reset.
    const max = this.maxCupsProperty.value;
    this.numberOfCupsProperty.value = Math.min( this.numberOfCupsProperty.value, max );
    this.numberOfCupsRangeProperty.value = new Range( NUMBER_OF_CUPS_RANGE.min, max );
    this.assertConsistentState();
  }

  public reset(): void {
    this.meanPredictionProperty.reset();
    this.pipesOpenProperty.reset();

    this.predictMeanVisibleProperty.reset();
    this.tickMarksVisibleProperty.reset();

    this.resetData();
    this.assertConsistentState();
  }


  /**
   * Increase or decrease water levels for the notepadCup according to the water levels of the tableCup
   * and the state of the model.
   * @param tableCup - The model for the affected table cup
   * @param waterLevel - the new water level from the table cup's listener
   * @param oldWaterLevel - the old water level from the table cup's listener
   */
  public changeWaterLevel( tableCup: Cup, waterLevel: number, oldWaterLevel: number | null ): void {
    const notepadCup = this.notepadCups[ tableCup.linePlacement ];

    let notepadCupWaterLevel = waterLevel;

    // At startup the water levels are the same, so we don't need to distribute water
    if ( oldWaterLevel ) {
      const delta = waterLevel - oldWaterLevel;
      notepadCupWaterLevel = Utils.clamp( notepadCup.waterLevelProperty.value + delta, 0, 1 );
      this.pipesOpenProperty.value && this.distributeWaterRipple( this.getActiveNotepadCups(), notepadCup, delta );
    }

    notepadCup.waterLevelProperty.set( notepadCupWaterLevel );
  }

  /**
   * For use by PhET-iO clients. Set the water levels of the notepadCups.
   * @param waterLevels
   */
  private setWaterLevels( waterLevels: number[] ): void {

    // Validate water level array
    // If a client passes through an empty array of data points, ignore and return early.
    if ( waterLevels.length === 0 ) {
      return;
    }
    else if ( waterLevels.length > this.maxCupsProperty.value ) {
      waterLevels = waterLevels.slice( 0, this.maxCupsProperty.value );
    }
    waterLevels.forEach( ( dataPoint, i ) => {
      const tableCup = this.tableCups[ i ];
      const error = tableCup.waterLevelProperty.getValidationError( dataPoint );
      if ( error ) {
        throw new Error( error );
      }
    } );

    this.resetData();
    this.numberOfCupsProperty.value = waterLevels.length;
    waterLevels.forEach( ( dataPoint, index ) => {
      this.tableCups[ index ].waterLevelProperty.set( dataPoint );
    } );
  }

  private static readonly LevelOutModelIO = new IOType<IntentionalAny, IntentionalAny>( 'LevelOutModelIO', {
    valueType: LevelOutModel,
    methods: {
      setDataPoints: {
        returnType: VoidIO,
        parameterTypes: [ ArrayIO( NumberIO ) ],
        implementation: function( this: LevelOutModel, dataPoints: number[] ) {
          this.setWaterLevels( dataPoints );
        },
        documentation: 'Sets the data points for the scene model. Array lengths that exceed maxCups will ignore excess values.'
      },

      getDataPoints: {
        returnType: ArrayIO( NumberIO ),
        parameterTypes: [],
        implementation: function( this: LevelOutModel ) {
          return this.getActiveTableCups().map( cup => cup.waterLevelProperty.value );
        },
        documentation: 'Gets the data points for the scene model.'
      }
    }
  } );
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'LevelOutModel', LevelOutModel );