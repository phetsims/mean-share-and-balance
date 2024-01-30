// Copyright 2022-2024, University of Colorado Boulder

/**
 * Model for the Leveling Out Screen which includes people, candy bars, visual mean representation, and a numerical
 * mean representation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Plate from './Plate.js';
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

  public readonly numberOfPlatesRangeProperty: Property<Range>;
  public readonly numberOfPlatesProperty: Property<number>;

  public readonly plates: Array<Plate>;
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

    this.numberOfPlatesRangeProperty = new Property<Range>(
      new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS ),
      {

        // phet-io
        tandem: options.tandem.createTandem( 'numberOfPlatesRangeProperty' ),
        phetioValueType: Range.RangeIO
      }
    );

    this.numberOfPlatesProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPlatesRangeProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPlatesProperty' )
    } );

    this.isMeanAccordionExpandedProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'isMeanAccordionExpandedProperty' )
    } );

    this.plates = [];
    this.candyBars = [];

    const totalCandyBarsPropertyDependencies: Array<TReadOnlyProperty<unknown>> = [];

    const candyBarsParentTandem = options.tandem.createTandem( 'notepadCandyBars' );

    // In Mean Share and Balance, we decided arrays start counting at 1
    let totalCandyBarCount = 1;

    // Statically allocate plates, people, and candyBars. Whether they participate in the model is controlled by the
    // isActiveProperty on each one.
    for ( let plateIndex = 0; plateIndex < MAX_PEOPLE; plateIndex++ ) {
      const x = plateIndex * MeanShareAndBalanceConstants.TABLE_PLATE_WIDTH;

      const plate = new Plate( {
        xPosition: x,
        isActive: plateIndex < this.numberOfPlatesProperty.value,
        linePlacement: plateIndex,

        // phet-io
        tandem: options.tandem.createTandem( `plate${plateIndex + 1}` )
      } );
      this.plates.push( plate );

      // Create and initialize all the candy bars.
      for ( let candyBarIndex = 0;
            candyBarIndex < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
            candyBarIndex++ ) {

        const x = plate.xPosition;
        const y = getCandyBarYPosition( candyBarIndex );
        const isActive = plate.isActiveProperty.value && candyBarIndex < plate.snackNumberProperty.value;

        const candyBar = new CandyBar( {
          isActive: isActive,
          plate: plate,
          position: new Vector2( x, y ),

          // phet-io
          tandem: candyBarsParentTandem.createTandem( `notepadCandyBar${totalCandyBarCount++}` )
        } );

        this.candyBars.push( candyBar );
      }

      // Connect draggable candy bar visibility to plate isActive and the number of items on the plate.
      plate.isActiveProperty.lazyLink( isActive => {
        const candyBars = this.getCandyBarsOnPlate( plate );

        // If a plate became inactive, we need to account for the extra or missing candy bars.
        if ( !isActive ) {
          this.reconcileSnacks( plate );
          assert && assert( plate.snackNumberProperty.value === this.getActiveCandyBarsOnPlate( plate ).length,
            'The number of candy bars on the table plate should match the number of candy bars on the notepad plate.' );
        }

        // After reconciling the snacks set the snackNumberProperty for the removed plate to 0.
        plate.snackNumberProperty.set( isActive ? 1 : 0 );
        candyBars.forEach( ( candyBar, i ) => {
          candyBar.isActiveProperty.value = isActive && i < plate.snackNumberProperty.value;
          this.reorganizeCandyBars( plate );
        } );
      } );

      // Add/remove candy bars to/from the notepad plates as the number of them on the table plates changes.
      plate.snackNumberProperty.lazyLink( ( candyBarNumber, oldCandyBarNumber ) => {
        if ( plate.isActiveProperty.value ) {
          if ( candyBarNumber > oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountIncrease( plate, candyBarNumber - oldCandyBarNumber );
          }
          else if ( candyBarNumber < oldCandyBarNumber ) {
            this.tablePlateCandyBarAmountDecrease( plate, oldCandyBarNumber - candyBarNumber );
          }
        }
      } );

      totalCandyBarsPropertyDependencies.push( plate.snackNumberProperty );
      totalCandyBarsPropertyDependencies.push( plate.isActiveProperty );
    }

    // Tracks the total number of candyBars based on the "ground truth" tablePlate numbers.
    // Must be deriveAny because .map() does not preserve .length()
    this.totalCandyBarsProperty = DerivedProperty.deriveAny( totalCandyBarsPropertyDependencies, () => {
      const candyBarAmounts = this.getActivePeople().map( tablePlate => tablePlate.snackNumberProperty.value );
      return _.sum( candyBarAmounts );
    }, {
      tandem: options.tandem.createTandem( 'totalCandyBarsProperty' ),
      phetioValueType: NumberIO
    } );

    // Calculates the mean based on the "ground-truth" candyBars on the table.
    this.meanProperty = new DerivedProperty( [ this.totalCandyBarsProperty, this.numberOfPlatesProperty ],
      ( totalCandyBars, numberOfPlates ) => totalCandyBars / numberOfPlates, {
        tandem: options.tandem.createTandem( 'meanProperty' ),
        phetioValueType: NumberIO
      } );

    this.numberOfPlatesProperty.link( numberOfPlates => {
      this.plates.forEach( ( tablePlate, i ) => {
        tablePlate.isActiveProperty.value = i < numberOfPlates;
      } );
    } );
  }

  public getActivePeople(): Array<Plate> {
    return this.plates.filter( tablePlate => tablePlate.isActiveProperty.value );
  }

  public getActivePlates(): Array<Plate> {
    return this.plates.filter( plate => plate.isActiveProperty.value );
  }

  public getActiveCandyBars(): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.isActiveProperty.value );
  }

  public getCandyBarsOnPlate( plate: Plate ): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.parentPlateProperty.value === plate );
  }

  public getInactiveCandyBarsOnPlate( plate: Plate ): Array<CandyBar> {
    return this.getCandyBarsOnPlate( plate ).filter( candyBar => !candyBar.isActiveProperty.value );
  }

  public getActiveCandyBarsOnPlate( plate: Plate ): Array<CandyBar> {
    return this.candyBars.filter( candyBar => candyBar.parentPlateProperty.value === plate && candyBar.isActiveProperty.value );
  }

  public getTopActiveCandyBarOnPlate( plate: Plate ): CandyBar {
    const activeCandyBarsOnPlate = this.getActiveCandyBarsOnPlate( plate );
    assert && assert( activeCandyBarsOnPlate.length > 0, `There is no top candy bar on plate since active candyBars is: ${activeCandyBarsOnPlate.length}` );
    const topCandyBar = _.minBy( activeCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return topCandyBar!;
  }

  public getBottomInactiveCandyBarOnPlate( plate: Plate ): CandyBar {
    const inactiveCandyBarsOnPlate = this.getInactiveCandyBarsOnPlate( plate );
    assert && assert(
      inactiveCandyBarsOnPlate.length > 0,
      `There is no inactive bottom candy bar on plate since inactive candyBars is: ${inactiveCandyBarsOnPlate.length}`
    );
    const bottomCandyBar = _.maxBy( inactiveCandyBarsOnPlate, candyBar => candyBar.positionProperty.value.y );
    return bottomCandyBar!;
  }

  public getActivePlateStateCandyBars( plate: Plate ): Array<CandyBar> {
    const candyBars = this.getActiveCandyBarsOnPlate( plate );
    return candyBars.filter( candyBar =>
      candyBar.stateProperty.value === 'plate' || candyBar.stateProperty.value === 'animating'
    );
  }

  public getPlatesWithSpace( plates: Array<Plate> ): Array<Plate> {
    return plates.filter( plate => {
      const numberOfCandyBars = this.getActivePlateStateCandyBars( plate ).length;
      return numberOfCandyBars < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CANDY_BARS_PER_PERSON;
    } );
  }

  /**
   * When candyBars are added to a plate in the notepad they may appear in random positions or be overlapping. Re-stack
   * them.
   */
  public reorganizeCandyBars( plate: Plate ): void {
    const plateStateCandyBars = this.getActivePlateStateCandyBars( plate );

    // Divide the active candy bars up into those that are animating and those that aren't, since we want to put the
    // non-animating ones on the bottom of the stack.  This is needed primarily for handling multitouch and race
    // conditions.
    const nonAnimatingActiveCandyBars: CandyBar[] = [];
    const animatingCandyBars: CandyBar[] = [];
    plateStateCandyBars.forEach( candyBar => {
      if ( candyBar.stateProperty.value === 'animating' ) {
        animatingCandyBars.push( candyBar );
      }
      else {
        nonAnimatingActiveCandyBars.push( candyBar );
      }
    } );

    // Position the active non-animating candy bars to be in a stack on top of the node plates.
    nonAnimatingActiveCandyBars.forEach( ( candyBar, i ) => {
      candyBar.positionProperty.set( new Vector2( plate.xPosition, getCandyBarYPosition( i ) ) );
    } );

    // Set a potentially new destination any animating candy bars.
    animatingCandyBars.forEach( ( candyBar, i ) => {
      candyBar.travelTo( new Vector2(
        plate.xPosition,
        getCandyBarYPosition( i + nonAnimatingActiveCandyBars.length )
      ) );
    } );
  }

  /**
   * When a plate becomes inactive, we need to account for the extra or missing candy bars.
   */
  private reconcileSnacks( plate: Plate ): void {
    const numberOfTablePlateSnacks = plate.snackNumberProperty.value;
    const numberOfNotepadPlateSnacks = this.getActiveCandyBarsOnPlate( plate ).length;

    if ( numberOfTablePlateSnacks > numberOfNotepadPlateSnacks ) {
      const delta = numberOfTablePlateSnacks - numberOfNotepadPlateSnacks;
      for ( let i = 0; i < delta; i++ ) {
        const maxPlate = this.getPlateWithMostActiveCandyBars();
        this.getTopActiveCandyBarOnPlate( maxPlate ).isActiveProperty.set( false );
        this.reorganizeCandyBars( maxPlate );
      }
    }
    else if ( numberOfTablePlateSnacks < numberOfNotepadPlateSnacks ) {
      const delta = numberOfNotepadPlateSnacks - numberOfTablePlateSnacks;
      for ( let i = 0; i < delta; i++ ) {
        const minPlate = this.getPlateWithLeastCandyBars();
        this.getBottomInactiveCandyBarOnPlate( minPlate ).isActiveProperty.set( true );
        this.reorganizeCandyBars( minPlate );
      }
    }

    const snacksOnNotepadPlate = this.getCandyBarsOnPlate( plate );
    snacksOnNotepadPlate.forEach( ( snack, i ) => {
      snack.isActiveProperty.value = i < plate.snackNumberProperty.value;
    } );
  }

  /**
   * Handle the situation where a candy bar was added to a plate on the table.  This may simply add one to the
   * corresponding plate in the notepad, but if that plate is already full, some redistribution is necessary.
   */
  private tablePlateCandyBarAmountIncrease( plate: Plate, numberOfCandyBarsAdded: number ): void {
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
   * When an active tablePlate removes a candyBar and there is no corresponding candyBar available on the notepad
   * representation, a candyBar will be removed off of the plate on the notepad with the most candyBars.
   */
  private tablePlateCandyBarAmountDecrease( plate: Plate, numberOfCandyBarsRemoved: number ): void {
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

  public getPlateWithMostActiveCandyBars(): Plate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsOnPlate( plate ).length ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return maxPlate!;
  }

  public getPlateWithLeastCandyBars(): Plate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => this.getActiveCandyBarsOnPlate( plate ).length ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN.
    // candyBarsNumberProperty will always be a number.
    return minPlate!;
  }

  public override reset(): void {

    // Force any in-progress animations of the candy bars to finish.
    this.candyBars.forEach( candyBar => { candyBar.forceAnimationToFinish(); } );

    // Reset other aspects of the model.
    this.isMeanAccordionExpandedProperty.reset();
    this.numberOfPlatesProperty.reset();
    this.meanCalculationDialogVisibleProperty.reset();
    this.plates.forEach( plate => plate.reset() );
  }

  /**
   * Propagate the ground truth values (at the bottom of the screen, on the table) to the candy bars that are being
   * shown on the plates in the notepad.
   */
  public syncData(): void {

    this.plates.forEach( ( tablePlate, index ) => {
      this.getCandyBarsOnPlate( this.plates[ index ] ).forEach( ( candyBar, i ) => {
        candyBar.isActiveProperty.value = i < tablePlate.snackNumberProperty.value;
      } );
      if ( tablePlate.isActiveProperty.value ) {
        this.reorganizeCandyBars( tablePlate );
      }
    } );
  }

  public step( dt: number ): void {
    // future implementation
  }
}

/**
 * Helper function to get the Y position of a candy bar stacked on a plate in the notepad based on its position in the
 * stack.  Zero is the bottom-most position in the stack.  The Y position is for the top of the candy bar.
 */
const getCandyBarYPosition = ( stackPosition: number ) => {
  return MeanShareAndBalanceConstants.NOTEPAD_PLATE_CENTER_Y -
         ( ( MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT +
             MeanShareAndBalanceConstants.NOTEPAD_CANDY_BAR_VERTICAL_SPACING ) * ( stackPosition + 1 ) );
};

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );