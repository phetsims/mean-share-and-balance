// Copyright 2022, University of Colorado Boulder

/**
 * Model for the Leveling Out Screen which includes people, chocolate bars, visual mean representation,
 * and a numerical mean representation.
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
import Plate from './Plate.js';
import Person from './Person.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ChocolateBar from './ChocolateBar.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

const MAX_PEOPLE = 7;

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRangeProperty: Property<Range>;
  public readonly numberOfPeopleProperty: Property<number>;

  public readonly platesArray: Array<Plate>;
  public readonly peopleArray: Array<Person>;
  public readonly chocolatesArray: Array<ChocolateBar>;

  public readonly meanProperty: TReadOnlyProperty<number>;

  public readonly isMeanAccordionExpandedProperty: Property<boolean>;
  public readonly meanCalculationDialogVisibleProperty: Property<boolean>;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.meanCalculationDialogVisibleProperty = new BooleanProperty( false, {

      // phet-io
      tandem: options.tandem.createTandem( 'meanCalculationDialogVisibleProperty' )
    } );
    this.numberOfPeopleRangeProperty = new Property<Range>( new Range( 1, MeanShareAndBalanceConstants.MAXIMUM_NUMBER_OF_DATA_SETS ), {

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPeopleRangeProperty' ),
      phetioValueType: Range.RangeIO
    } );

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

    this.platesArray = [];
    this.peopleArray = [];
    this.chocolatesArray = [];

    const meanPropertyDependencies: Array<TReadOnlyProperty<unknown>> = [];

    const chocolateBarsParentTandem = options.tandem.createTandem( 'chocolateBars' );

    // In Mean Share and Balance, we decided arrays start counting at 1
    let totalChocolateCount = 1;

    // Statically allocate plates, people, and chocolates. Whether they particpate in the model is controlled by
    // the isActiveProperty on each one
    for ( let personIndex = 0; personIndex < MAX_PEOPLE; personIndex++ ) {
      const x = personIndex * MeanShareAndBalanceConstants.PERSON_WIDTH;
      const plate = new Plate( {
        isActive: personIndex < this.numberOfPeopleProperty.value,
        position: new Vector2( x, MeanShareAndBalanceConstants.PLATE_CHOCOLATE_CENTER_Y ),
        linePlacement: personIndex,

        // phet-io
        tandem: options.tandem.createTandem( `plateChocolate${personIndex + 1}` )
      } );
      this.platesArray.push( plate );

      const person = new Person( {
        position: new Vector2( x, MeanShareAndBalanceConstants.PEOPLE_CENTER_Y ),
        isActive: personIndex < this.numberOfPeopleProperty.value,
        linePlacement: personIndex,

        // phet-io
        tandem: options.tandem.createTandem( `person${personIndex + 1}` )
      } );
      this.peopleArray.push( person );

      for ( let chocolateIndex = 0; chocolateIndex < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES_PER_PERSON; chocolateIndex++ ) {
        const x = plate.position.x;
        const y = plate.position.y - ( ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 2 ) * ( chocolateIndex + 1 ) );
        const isActive = plate.isActiveProperty.value && chocolateIndex < person.chocolateNumberProperty.value;

        const chocolateBar = new ChocolateBar( {
          isActive: isActive,
          plate: plate,
          position: new Vector2( x, y ),

          // phet-io
          tandem: chocolateBarsParentTandem.createTandem( `chocolateBar${totalChocolateCount++}` )
        } );

        this.chocolatesArray.push( chocolateBar );
      }

      // Connect draggable chocolate visibility to plate isActive and chocolateBarsNumber
      plate.isActiveProperty.lazyLink( isActive => {
        const chocolates = this.getChocolatesOnPlate( plate );
        const plateNumberOfChocolates = this.getActiveChocolatesOnPlate( plate ).length;

        // If a plate became inactive, we need to account for the extra or missing chocolate
        if ( !isActive ) {
          const personNumberOfChocolates = this.peopleArray[ plate.linePlacement ].chocolateNumberProperty.value;
          if ( personNumberOfChocolates > plateNumberOfChocolates ) {
            this.borrowMisingChocolates( personNumberOfChocolates - plateNumberOfChocolates );
          }
          else if ( personNumberOfChocolates < plateNumberOfChocolates ) {
            this.shareExtraChocolates( plateNumberOfChocolates - personNumberOfChocolates );
          }
        }
        chocolates.forEach( ( chocolate, i ) => {
          chocolate.isActiveProperty.value = isActive && i < person.chocolateNumberProperty.value;
          this.reorganizeChocolates( plate );
        } );
      } );

      // set paper plate chocolate number based on table plate delta change.
      person.chocolateNumberProperty.lazyLink( ( chocolateNumber, oldChocolateNumber ) => {
        if ( person.isActiveProperty.value ) {
          if ( chocolateNumber > oldChocolateNumber ) {
            this.personChocolateAmountIncrease( plate, chocolateNumber - oldChocolateNumber );
          }
          else if ( chocolateNumber < oldChocolateNumber ) {
            this.personChocolateAmountDecrease( plate, oldChocolateNumber - chocolateNumber );
          }
        }
      } );

      meanPropertyDependencies.push( person.chocolateNumberProperty );
      meanPropertyDependencies.push( person.isActiveProperty );
    }

    // Calculates the mean based on the "ground-truth" chocolates on the table
    // Must be deriveAny because .map() does not preserve .length()
    this.meanProperty = DerivedProperty.deriveAny( meanPropertyDependencies, () => {
      const chocolateAmounts = this.getActivePeople().map( person => person.chocolateNumberProperty.value );
      const totalChocolate = _.sum( chocolateAmounts );
      return totalChocolate / chocolateAmounts.length;
    }, {
      tandem: options.tandem.createTandem( 'meanProperty' ),
      phetioValueType: NumberIO
    } );

    this.numberOfPeopleProperty.link( numberOfPeople => {
      this.platesArray.forEach( ( plate, i ) => {
        plate.isActiveProperty.value = i < numberOfPeople;
      } );
      this.peopleArray.forEach( ( person, i ) => {
        person.isActiveProperty.value = i < numberOfPeople;
      } );
    } );
  }

  public getActivePeople(): Array<Person> {
    return this.peopleArray.filter( person => person.isActiveProperty.value );
  }

  public getActivePlates(): Array<Plate> {
    return this.platesArray.filter( plate => plate.isActiveProperty.value );
  }

  public getActiveChocolates(): Array<ChocolateBar> {
    return this.chocolatesArray.filter( chocolate => chocolate.isActiveProperty.value );
  }

  public getChocolatesOnPlate( plate: Plate ): Array<ChocolateBar> {
    return this.chocolatesArray.filter( chocolate => chocolate.parentPlateProperty.value === plate );
  }

  public getInactiveChocolatesOnPlate( plate: Plate ): Array<ChocolateBar> {
    return this.getChocolatesOnPlate( plate ).filter( chocolate => !chocolate.isActiveProperty.value );
  }

  public getActiveChocolatesOnPlate( plate: Plate ): Array<ChocolateBar> {
    return this.chocolatesArray.filter( chocolate => chocolate.parentPlateProperty.value === plate && chocolate.isActiveProperty.value );
  }

  public getTopActiveChocolateOnPlate( plate: Plate ): ChocolateBar {
    const activeChocolatesOnPlate = this.getActiveChocolatesOnPlate( plate );
    assert && assert( activeChocolatesOnPlate.length > 0, `There is no top chocolate on plate since active chocolates is: ${activeChocolatesOnPlate.length}` );
    const topChocolate = _.minBy( activeChocolatesOnPlate, chocolate => chocolate.positionProperty.value.y );
    return topChocolate!;
  }

  public getBottomInactiveChocolateOnPlate( plate: Plate ): ChocolateBar {
    const inactiveChocolatesOnPlate = this.getInactiveChocolatesOnPlate( plate );
    assert && assert( inactiveChocolatesOnPlate.length > 0, `There is no inactive bottom chocolate on plate since inactive chocolates is: ${inactiveChocolatesOnPlate.length}` );
    const bottomChocolate = _.maxBy( inactiveChocolatesOnPlate, chocolate => chocolate.positionProperty.value.y );
    return bottomChocolate!;
  }

  public getActivePlateStateChocolates( plate: Plate ): Array<ChocolateBar> {
    const chocolates = this.getActiveChocolatesOnPlate( plate );
    return chocolates.filter( chocolate => chocolate.stateProperty.value === 'plate' );
  }

  public getPlatesWithSpace( plates: Array<Plate> ): Array<Plate> {
    return plates.filter( plate => {
      const numberOfChocolates = this.getActivePlateStateChocolates( plate ).length;
      return numberOfChocolates < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES_PER_PERSON;
    } );
  }

  /**
   * When chocolates are added to a plate, they may appear in random positions or be overlapping. Re-stack them.
   */
  public reorganizeChocolates( plate: Plate ): void {
    const plateStateChocolates = this.getActivePlateStateChocolates( plate );
    plateStateChocolates.forEach( ( chocolate, i ) => {

      const Y_MARGIN = 2; // Distance between adjacent chocolates.  Also distance between plate and lowest chocolate
      const newPosition = new Vector2( plate.position.x, plate.position.y - ( ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + Y_MARGIN ) * ( i + 1 ) ) );
      chocolate.positionProperty.set( newPosition );
    } );
  }

  /**
   * Called only when a Plate is deactivated (when a person is removed) and the number at the person did not match the
   * amount on the plate.
   */
  private shareExtraChocolates( numberOfExtraChocolates: number ): void {
    for ( let i = 0; i < numberOfExtraChocolates; i++ ) {
      const minPlate = this.getPlateWithLeastChocolate();
      this.getBottomInactiveChocolateOnPlate( minPlate ).isActiveProperty.set( true );
      this.reorganizeChocolates( minPlate );
    }
  }

  /**
   * Called only when a Plate is deactivated (when a person is removed) and the number at the person did not match the
   * amount on the plate.
   */
  private borrowMisingChocolates( numberOfMissingChocolates: number ): void {
    for ( let i = 0; i < numberOfMissingChocolates; i++ ) {
      const maxPlate = this.getPlateWithMostActiveChocolate();
      this.getTopActiveChocolateOnPlate( maxPlate ).isActiveProperty.set( false );
      this.reorganizeChocolates( maxPlate );
    }
  }

  // When an active person adds chocolate to their plate and the paper plate has no more space on it,
  // a piece of chocolate will be added onto the paper plate with the least chocolate.
  private personChocolateAmountIncrease( plate: Plate, numberOfChocolatesAdded: number ): void {
    for ( let i = 0; i < numberOfChocolatesAdded; i++ ) {
      const numberOfChocolatesOnPlate = this.getActivePlateStateChocolates( plate ).length;
      if ( numberOfChocolatesOnPlate === MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES_PER_PERSON ) {
        const minPlate = this.getPlateWithLeastChocolate();
        assert && assert( minPlate !== plate, `minPlate ${minPlate.linePlacement} should not be the same as affected plate: ${plate.linePlacement}` );
        this.getBottomInactiveChocolateOnPlate( minPlate ).isActiveProperty.set( true );
        this.reorganizeChocolates( minPlate );
      }
      else {
        this.getBottomInactiveChocolateOnPlate( plate ).isActiveProperty.set( true );
      }
      this.reorganizeChocolates( plate );
    }
  }

  // When an active person removes chocolate from their plate and the paper plate has no chocolate on it,
  // a piece of chocolate will be removed off of the paper plate with the most chocolate.
  private personChocolateAmountDecrease( plate: Plate, numberOfChocolatesRemoved: number ): void {
    for ( let i = 0; i < numberOfChocolatesRemoved; i++ ) {
      const numberOfChocolatesOnPlate = this.getActivePlateStateChocolates( plate ).length;
      if ( numberOfChocolatesOnPlate === 0 ) {
        const maxPlate = this.getPlateWithMostActiveChocolate();
        this.getTopActiveChocolateOnPlate( maxPlate ).isActiveProperty.set( false );
        this.reorganizeChocolates( maxPlate );
      }
      else {
        this.getTopActiveChocolateOnPlate( plate ).isActiveProperty.set( false );
      }
      this.reorganizeChocolates( plate );
    }
  }

  public getPlateWithMostActiveChocolate(): Plate {
    const maxPlate = _.maxBy( this.getActivePlates(), ( plate => this.getActiveChocolatesOnPlate( plate ).length ) );

    // _.maxBy can return undefined if all the elements in the array are null, undefined, or NAN. chocolateBarsNumberProperty will always be a number.
    return maxPlate!;
  }

  public getPlateWithLeastChocolate(): Plate {
    const minPlate = _.minBy( this.getActivePlates(), ( plate => this.getActiveChocolatesOnPlate( plate ).length ) );

    // _.minBy can return undefined if all the elements in the array are null, undefined, or NAN. chocolateBarsNumberProperty will always be a number.
    return minPlate!;
  }

  public override reset(): void {
    this.isMeanAccordionExpandedProperty.reset();
    this.numberOfPeopleProperty.reset();
    this.meanCalculationDialogVisibleProperty.reset();
    this.peopleArray.forEach( person => person.reset() );
    this.platesArray.forEach( plate => plate.reset() );
  }

  /**
   * Propagate the ground truth values (at the bottom of the screen, with the Person objects) to the sketch
   * plates at the top of the screen.
   */
  public syncData(): void {

    this.platesArray.forEach( plate => {
      this.getChocolatesOnPlate( plate ).forEach( chocolate => chocolate.reset() );
    } );

    this.peopleArray.forEach( ( person, index ) => {
      this.getChocolatesOnPlate( this.platesArray[ index ] ).forEach( ( chocolate, i ) => {
        chocolate.isActiveProperty.value = i < person.chocolateNumberProperty.value;
      } );
    } );
  }

  public step( dt: number ): void {
    // future implementation
  }

}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );