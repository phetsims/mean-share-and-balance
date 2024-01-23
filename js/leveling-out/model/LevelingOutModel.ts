// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for the Leveling Out Screen which includes people, candy bars, visual mean representation, and a numerical
 * mean representation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NotepadPlate from './NotepadPlate.js';
import TablePlate from './TablePlate.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import CandyBar from './CandyBar.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

const MAX_PEOPLE = 7;

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRangeProperty: Property<Range>;
  public readonly numberOfPeopleProperty: Property<number>;

  public readonly notepadPlates: Array<NotepadPlate>;
  public readonly tablePlates: Array<TablePlate>;
  public readonly candyBars: Array<CandyBar>;

  public readonly meanProperty: TReadOnlyProperty<number>;
  public readonly totalCandyBarsProperty: TReadOnlyProperty<number>;

  public readonly isMeanAccordionExpandedProperty: Property<boolean>;
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.meanCalculationDialogVisibleProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'meanCalculationDialogVisibleProperty' )
    } );

    this.numberOfPeopleRangeProperty = new Property<Range>(
      new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS ),
      {

        // phet-io
        tandem: options.tandem.createTandem( 'numberOfPeopleRangeProperty' ),
        phetioValueType: Range.RangeIO
      }
    );

    this.numberOfPeopleProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPeopleRangeProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPeopleProperty' )
    } );

    this.isMeanAccordionExpandedProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'isMeanAccordionExpandedProperty' )
    } );

    this.notepadPlates = [];
    this.tablePlates = [];
    this.candyBars = [];

    const totalCandyBarsPropertyDependencies: Array<TReadOnlyProperty<unknown>> = [];

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );

    // In Mean Share and Balance, we decided arrays start counting at 1
    let totalCandyBarCount = 1;

    // Statically allocate plates, people, and candyBars. Whether they participate in the model is controlled by the
    // isActiveProperty on each one.
    for ( let tablePlateIndex = 0; tablePlateIndex < MAX_PEOPLE; tablePlateIndex++ ) {
      const x = tablePlateIndex * MeanShareAndBalanceConstants.TABLE_PLATE_WIDTH;
      const notepadPlate = new NotepadPlate( {
        isActive: tablePlateIndex < this.numberOfPeopleProperty.value,
        position: new Vector2( x, MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_CENTER_Y ),
        linePlacement: tablePlateIndex,

        // phet-io
        tandem: options.tandem.createTandem( `notepadPlate${tablePlateIndex + 1}` )
      } );
      this.notepadPlates.push( notepadPlate );

      const tablePlate = new TablePlate( {
        position: new Vector2( x, MeanShareAndBalanceConstants.PEOPLE_CENTER_Y ),
        isActive: tablePlateIndex < this.numberOfPeopleProperty.value,
        linePlacement: tablePlateIndex,

        // phet-io
        tandem: options.tandem.createTandem( `tablePlate${tablePlateIndex + 1}` )
      } );
      this.tablePlates.push( tablePlate );

      for ( let candyBarIndex = 0;
            candyBarIndex < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
            candyBarIndex++ ) {

        const x = notepadPlate.position.x;
        const y = notepadPlate.position.y - ( ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + 2 ) * ( candyBarIndex + 1 ) );
        const isActive = notepadPlate.isActiveProperty.value && candyBarIndex < tablePlate.candyBarNumberProperty.value;

        const candyBar = new CandyBar( {
          isActive: isActive,
          notepadPlate: notepadPlate,
          position: new Vector2( x, y ),

          // phet-io
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
        } );

        this.candyBars.push( candyBar );
      }

      // Connect draggable candy bar visibility to notepadPlate isActive and candyBarsNumber.
      notepadPlate.isActiveProperty.lazyLink( isActive => {
        const candyBars = this.getCandyBarsOnPlate( notepadPlate );
        const numberOfCandyBarsOnPlate = this.getActiveCandyBarsOnPlate( notepadPlate ).length;

        // If a notepadPlate became inactive, we need to account for the extra or missing candy bar.
        if ( !isActive ) {
          const numberOfTablePlateCandyBars = this.tablePlates[ notepadPlate.linePlacement ].candyBarNumberProperty.value;
          if ( numberOfTablePlateCandyBars > numberOfCandyBarsOnPlate ) {
            this.borrowMissingCandyBars( numberOfTablePlateCandyBars - numberOfCandyBarsOnPlate );
          }
          else if ( numberOfTablePlateCandyBars < numberOfCandyBarsOnPlate ) {
            this.shareExtraCandyBars( numberOfCandyBarsOnPlate - numberOfTablePlateCandyBars );
          }
        }
        candyBars.forEach( ( candyBar, i ) => {
          candyBar.isActiveProperty.value = isActive && i < tablePlate.candyBarNumberProperty.value;
          this.reorganizeCandyBars( notepadPlate );
        } );
      } );

      // Set paper notepadPlate candy bar number based on table notepadPlate delta change.
      tablePlate.candyBarNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {
        if ( tablePlate.isActiveProperty.value ) {
          if ( candyBarNumber > oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountIncrease( notepadPlate, candyBarNumber - oldCandyBarNumber );
          }
          else if ( candyBarNumber < oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountDecrease( notepadPlate, oldCandyBarNumber - candyBarNumber );
          }
        }
      } );

      totalCandyBarsPropertyDependencies.push( tablePlate.candyBarNumberProperty );
      totalCandyBarsPropertyDependencies.push( tablePlate.isActiveProperty );
    }

    // Tracks the total number of candyBars based on the "ground truth" tablePlate numbers.
    // Must be deriveAny because .map() does not preserve .length()
    this.totalCandyBarsProperty = DerivedProperty.deriveAny( totalCandyBarsPropertyDependencies, () => {
      const candyBarAmounts = this.getActivePeople().map( tablePlate => tablePlate.candyBarNumberProperty.value );
      return _.sum( candyBarAmounts );
    }, {
      tandem: options.tandem.createTandem( 'totalCandyBarsProperty' ),
      phetioValueType: NumberIO
    } );

    // Calculates the mean based on the "ground-truth" candyBars on the table.
    this.meanProperty = new DerivedProperty( [ this.totalCandyBarsProperty, this.numberOfPeopleProperty ],
      ( totalCandyBars, numberOfPlates ) => totalCandyBars / numberOfPlates, {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioValueType: NumberIO
      } );

    this.numberOfPeopleProperty.link( numberOfPeople => {
      this.notepadPlates.forEach( ( plate, i ) => {
        plate.isActiveProperty.value = i < numberOfPeople;
      } );
      this.tablePlates.forEach( ( tablePlate, i ) => {
        tablePlate.isActiveProperty.value = i < numberOfPeople;
      } );
    } );
  }

  public getActivePeople(): Array<TablePlate> {
    return this.tablePlates.filter( tablePlate => tablePlate.isActiveProperty.value );
  }

  public getActivePlates(): Array<NotepadPlate> {
    return this.notepadPlates.filter( plate => plate.isActiveProperty.value );
  }

  public getActiveCandyBars(): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.isActiveProperty.value );
  }

  public getCandyBarsOnPlate( plate: NotepadPlate ): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.parentPlateProperty.value === plate );
  }

  public getInactiveCandyBarsOnPlate( plate: NotepadPlate ): Array<CandyBar> {
    return this.getCandyBarsOnPlate( plate ).filter( candyBar => !candyBar.isActiveProperty.value );
  }

  public getActiveCandyBarsOnPlate( plate: NotepadPlate ): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.parentPlateProperty.value === plate && candyBar.isActiveProperty.value );
  }

  public getTopActiveCandyBarOnPlate( plate: NotepadPlate ): CandyBar {
    const activeCandyBarsOnPlate = this.getActiveCandyBarsOnPlate( plate );
    assert && assert( activeCandyBarsOnPlate.length > 0, `There is no top candy bar on plate since active candyBars is: ${activeCandyBarsOnPlate.length}` );
    const topCandyBar = _.minBy( activeCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return topCandyBar!;
  }

  public getBottomInactiveCandyBarOnPlate( plate: NotepadPlate ): CandyBar {
    const inactiveCandyBarsOnPlate = this.getInactiveCandyBarsOnPlate( plate );
    assert && assert( inactiveCandyBarsOnPlate.length > 0, `There is no inactive bottom candy bar on plate since inactive candyBars is: ${inactiveCandyBarsOnPlate.length}` );
    const bottomCandyBar = _.maxBy( inactiveCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return bottomCandyBar!;
  }

  public getActivePlateStateCandyBars( plate: NotepadPlate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsOnPlate( plate );
    return candyBars.filter( candyBar => candyBar.stateProperty.value === 'plate' );
  }

  public getPlatesWithSpace( plates: Array<NotepadPlate> ): Array<NotepadPlate> {
    return plates.filter( plate => {
      const numberOfCandyBars = this.getActivePlateStateCandyBars( plate ).length;
      return numberOfCandyBars < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
    } );
  }

  /**
   * When candyBars are added to a notepadPlate they may appear in random positions or be overlapping. Re-stack them.
   */
  public reorganizeCandyBars( plate: NotepadPlate ): void {
    const plateStateCandyBars = this.getActivePlateStateCandyBars( plate );
    plateStateCandyBars.forEach( ( candyBar, i ) => {

      const Y_MARGIN = 2; // Distance between adjacent candyBars, and notepadPlate.
      const newPosition = new Vector2( plate.position.x, plate.position.y - ( ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT + Y_MARGIN ) * ( i + 1 ) ) );
      candyBar.positionProperty.set( newPosition );
    } );
  }

  /**
   * Called only when a NotepadPlate is deactivated (when a tablePlate is removed) and the number at the tablePlate
   * did not match the amount on the notepadPlate.
   */
  private shareExtraCandyBars( numberOfExtraCandyBars: number ): void {
    for ( let i = 0; i < numberOfExtraCandyBars; i++ ) {
      const minPlate = this.getPlateWithLeastCandyBars();
      this.getBottomInactiveCandyBarOnPlate( minPlate ).isActiveProperty.set( true );
      this.reorganizeCandyBars( minPlate );
    }
  }

  /**
   * Called only when a NotepadPlate is deactivated (when a tablePlate is removed) and the number at the tablePlate
   * did not match the amount on the notepadPlate.
   */
  private borrowMissingCandyBars( numberOfMissingCandyBars: number ): void {
    for ( let i = 0; i < numberOfMissingCandyBars; i++ ) {
      const maxPlate = this.getPlateWithMostActiveCandyBars();
      this.getTopActiveCandyBarOnPlate( maxPlate ).isActiveProperty.set( false );
      this.reorganizeCandyBars( maxPlate );
    }
  }

  /**
   * When an active tablePlate adds candy bar to their notepadPlate and the paper notepadPlate has no more space on it,
   * a piece of candy bar will be added onto the paper notepadPlate with the least candy bar.
   */
  private tablePlateCandyBarAmountIncrease( plate: NotepadPlate, numberOfCandyBarsAdded: number ): void {
    for ( let i = 0; i < numberOfCandyBarsAdded; i++ ) {
      const numberOfCandyBarsOnPlate = this.getActivePlateStateCandyBars( plate ).length;
      if ( numberOfCandyBarsOnPlate === MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        assert && assert(
          minPlate !== plate,
          `minPlate ${minPlate.linePlacement} should not be the same as affected plate: ${plate.linePlacement}`
        );
        this.getBottomInactiveCandyBarOnPlate( minPlate ).isActiveProperty.set( true );
        this.reorganizeCandyBars( minPlate );
      }
      else {
        this.getBottomInactiveCandyBarOnPlate( plate ).isActiveProperty.set( true );
      }
      this.reorganizeCandyBars( plate );
    }
  }

  /**
   * When an active tablePlate removes candyBar from their notepadPlate and the notepadPlate has no candyBar on it,
   * a piece of candyBar will be removed off of the notepadPlate sketch with the most candyBars.
   */
  private tablePlateCandyBarAmountDecrease( plate: NotepadPlate, numberOfCandyBarsRemoved: number ): void {
    for ( let i = 0; i < numberOfCandyBarsRemoved; i++ ) {
      const numberOfCandyBarsOnPlate = this.getActivePlateStateCandyBars( plate ).length;
      if ( numberOfCandyBarsOnPlate === 0 ) {
        const maxPlate = this.getPlateWithMostActiveCandyBars();
        this.getTopActiveCandyBarOnPlate( maxPlate ).isActiveProperty.set( false );
        this.reorganizeCandyBars( maxPlate );
      }
      else {
        this.getTopActiveCandyBarOnPlate( plate ).isActiveProperty.set( false );
      }
      this.reorganizeCandyBars( plate );
    }
  }

  public getPlateWithMostActiveCandyBars(): NotepadPlate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsOnPlate( plate ).length ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return maxPlate!;
  }

  public getPlateWithLeastCandyBars(): NotepadPlate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsOnPlate( plate ).length ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return minPlate!;
  }

  public override reset(): void {
    this.isMeanAccordionExpandedProperty.reset();
    this.numberOfPeopleProperty.reset();
    this.meanCalculationDialogVisibleProperty.reset();
    this.tablePlates.forEach( tablePlate => tablePlate.reset() );
    this.notepadPlates.forEach( plate => plate.reset() );
  }

  /**
   * Propagate the ground truth values (at the bottom of the screen, with the TablePlate objects) to the notepadPlates
   * at the top of the screen.
   */
  public syncData(): void {

    this.notepadPlates.forEach( plate => {
      this.getCandyBarsOnPlate( plate ).forEach( candyBar => candyBar.reset() );
    } );

    this.tablePlates.forEach( ( tablePlate, index ) => {
      this.getCandyBarsOnPlate( this.notepadPlates[ index ] ).forEach( ( candyBar, i ) => {
        candyBar.isActiveProperty.value = i < tablePlate.candyBarNumberProperty.value;
      } );
    } );
  }

  public step( dt: number ): void {
    // future implementation
  }

}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );