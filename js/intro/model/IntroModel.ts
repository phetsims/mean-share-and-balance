// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for the Intro screen, which includes tableCups, notepadCups, connecting pipes, and view options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Pipe from './Pipe.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Cup from './Cup.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import MeanShareAndBalanceQueryParameters from '../../common/MeanShareAndBalanceQueryParameters.js';
import TModel from '../../../../joist/js/TModel.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';

type IntroModelOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

export default class IntroModel implements TModel {

  public readonly numberOfCupsRange = new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS );
  public readonly dragRange = MeanShareAndBalanceConstants.WATER_LEVEL_RANGE;

  public readonly numberOfCupsProperty: Property<number>;
  public readonly meanPredictionProperty: Property<number>;
  public readonly meanProperty: TReadOnlyProperty<number>;

  public readonly tableCups: Cup[];
  public readonly notepadCups: Cup[];
  public readonly pipeArray: Pipe[];
  public readonly arePipesOpenProperty: Property<boolean>;

  // visible properties
  public readonly predictMeanVisibleProperty: Property<boolean>;
  public readonly meanVisibleProperty: Property<boolean>;
  public readonly tickMarksVisibleProperty: Property<boolean>;
  public readonly cupLevelVisibleProperty: Property<boolean>;

  public constructor( providedOptions: IntroModelOptions ) {

    const options = providedOptions;

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

    // The tableCups are the "ground truth" and the notepadCups mirror them.
    this.tableCups = [];
    this.notepadCups = [];
    this.pipeArray = [];

    const pipesParentTandem = options.tandem.createTandem( 'pipes' );
    const notepadCupsParentTandem = options.tandem.createTandem( 'notepadCups' );
    const tableCupsParentTandem = options.tandem.createTandem( 'tableCups' );

    // Statically allocate cups and pipes
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS; i++ ) {
      const x = i * ( MeanShareAndBalanceConstants.CUP_WIDTH + MeanShareAndBalanceConstants.PIPE_LENGTH );
      const tableCupPosition = new Vector2( x, MeanShareAndBalanceConstants.TABLE_CUPS_CENTER_Y );
      const waterLevel = i === 0 ? 0.75 : MeanShareAndBalanceConstants.WATER_LEVEL_DEFAULT;
      this.tableCups.push( new Cup( tableCupsParentTandem.createTandem( `tableCup${i + 1}` ), {
        waterLevel: waterLevel,
        position: tableCupPosition,
        isActive: i <= 1,
        linePlacement: i
      } ) );

      const notepadCupPosition = new Vector2( x, MeanShareAndBalanceConstants.NOTEPAD_CUPS_CENTER_Y );
      this.notepadCups.push( new Cup( notepadCupsParentTandem.createTandem( `notepadCup${i + 1}` ), {
        waterLevel: waterLevel,
        position: notepadCupPosition,
        isActive: i <= 1,
        linePlacement: i,
        waterLevelPropertyOptions: {
          phetioReadOnly: true
        }
      } ) );

      if ( i < MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS - 1 ) {
        const pipe = new Pipe( this.arePipesOpenProperty, {
          position: notepadCupPosition,
          isActive: i === 0,

          // phet-io
          tandem: pipesParentTandem.createTandem( `pipe${i + 1}` )
        } );
        this.pipeArray.push( pipe );
      }
    }

    const dependencies = [
      ...this.tableCups.map( waterCup => waterCup.waterLevelProperty ),
      ...this.tableCups.map( waterCup => waterCup.isActiveProperty )
    ];

    // The implementation of DerivedProperty requires that any dependencies array passed has 15 or fewer elements.
    // .map() does not preserve a property of .length, requiring the usage of deriveAny.
    this.meanProperty = DerivedProperty.deriveAny( dependencies,
      () => {
        const mean = calculateMean( this.getActiveTableCups().map( tableCup => tableCup.waterLevelProperty.value ) );
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
      const removedTableCupWaterLevel = this.tableCups[ oldNumberOfCups - 1 ].waterLevelProperty.value;
      const removedNotepadCupWaterLevel = this.notepadCups[ oldNumberOfCups - 1 ].waterLevelProperty.value;

      this.notepadCups.forEach( ( waterCup, i ) => waterCup.isActiveProperty.set( i < numberOfCups ) );
      this.tableCups.forEach( ( waterCup, i ) => waterCup.isActiveProperty.set( i < numberOfCups ) );
      this.pipeArray.forEach( ( pipe, i ) => pipe.isActiveProperty.set( i < numberOfCups - 1 ) );

      if ( numberOfCups < oldNumberOfCups && removedTableCupWaterLevel !== removedNotepadCupWaterLevel ) {
        this.matchCupWaterLevels();
      }
      if ( !MeanShareAndBalanceQueryParameters.showAnimation ) {
        this.stepWaterLevels( 1 );
      }

      this.assertConsistentState();
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
    this.iterateCups( ( notepadCup, tableCup ) => {
      const currentWaterLevel = notepadCup.waterLevelProperty.value;
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
        const delta = tableCup.waterLevelProperty.value - currentWaterLevel;
        newWaterLevel = Utils.clamp( currentWaterLevel + delta * dt * 4, 0, 1 );
      }
      notepadCup.waterLevelProperty.set( newWaterLevel );
    } );
  }

  /**
   * Reset notepadCup waterLevelProperty to tableCup waterLevelProperty.
   */
  private matchCupWaterLevels(): void {
    this.iterateCups( ( notepadCup, tableCup ) => {
      notepadCup.waterLevelProperty.set( tableCup.waterLevelProperty.value );
    } );
  }

  /**
   * Visit pairs of table/notepad cups
   */
  private iterateCups( callback: ( notepadCup: Cup, tableCup: Cup ) => void ): void {
    this.assertConsistentState();

    for ( let i = 0; i < this.numberOfCupsProperty.value; i++ ) {
      callback( this.getActiveNotepadCups()[ i ], this.getActiveTableCups()[ i ] );
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
    assert && assert( this.tableCups.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.tableCups.length} cups` );
    assert && assert( this.notepadCups.length === MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS, `There should be ${MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS}, but there were actually ${this.notepadCups.length} cups` );
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
    this.tableCups.forEach( tableCup => tableCup.reset() );
    this.notepadCups.forEach( notepadCup => notepadCup.reset() );

    this.assertConsistentState();
  }


  /**
   * @param tableCup - The model for the affected table cup
   * @param waterLevel - the new water level from the table cup's listener
   * @param oldWaterLevel - the old water level from the table cup's listener
   */
  public changeWaterLevel( tableCup: Cup, waterLevel: number, oldWaterLevel: number ): void {
    const delta = waterLevel - oldWaterLevel;
    const notepadCup = this.notepadCups[ tableCup.linePlacement ];
    const notepadCupWaterLevel = Utils.clamp( notepadCup.waterLevelProperty.value + delta, 0, 1 );
    notepadCup.waterLevelProperty.set( notepadCupWaterLevel );

    this.arePipesOpenProperty.value && this.distributeWaterRipple( this.getActiveNotepadCups(), notepadCup, delta );
  }
}

function calculateMean( values: number[] ): number {
  assert && assert( values.length > 0, 'calculateMean requires at least one value' );
  return _.mean( values );
}

meanShareAndBalance.register( 'IntroModel', IntroModel );