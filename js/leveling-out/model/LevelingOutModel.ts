// Copyright 2022, University of Colorado Boulder

/**
 * TODO
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

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

const MAX_PEOPLE = 7;

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRange = new Range( 1, MAX_PEOPLE );
  public readonly numberOfPeopleProperty: NumberProperty;
  public readonly isMeanAccordionExpandedProperty: BooleanProperty;

  public readonly platesArray: Array<Plate>;
  public readonly peopleArray: Array<Person>;
  public readonly meanProperty: TReadOnlyProperty<number>;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.numberOfPeopleProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      numberType: 'Integer',
      range: this.numberOfPeopleRange,

      // phet-io
      tandem: options.tandem.createTandem( 'numberOfPeopleProperty' )
    } );

    this.isMeanAccordionExpandedProperty = new BooleanProperty( false, {
      // phet-io
      tandem: options.tandem.createTandem( 'isMeanAccordionExpandedProperty' )
    } );

    this.platesArray = [];
    this.peopleArray = [];

    const meanPropertyDependencies: Array<TReadOnlyProperty<unknown>> = [];

    for ( let i = 0; i < MAX_PEOPLE; i++ ) {
      const x = i * MeanShareAndBalanceConstants.PERSON_WIDTH;
      const chocolate = new Plate( {
        isActive: i < this.numberOfPeopleProperty.value,
        position: new Vector2( x, MeanShareAndBalanceConstants.PLATE_CHOCOLATE_CENTER_Y ),
        linePlacement: i,
        tandem: options.tandem.createTandem( `plateChocolate${i + 1}` )
      } );
      this.platesArray.push( chocolate );

      const person = new Person( {
        position: new Vector2( x, MeanShareAndBalanceConstants.PEOPLE_CENTER_Y ),
        isActive: i < this.numberOfPeopleProperty.value,
        linePlacement: i,
        tandem: options.tandem.createTandem( `person${i + 1}` )
      } );
      this.peopleArray.push( person );

      person.chocolateNumberProperty.lazyLink( chocolateNumber => chocolate.chocolateBarsNumberProperty.set( chocolateNumber ) );

      meanPropertyDependencies.push( person.chocolateNumberProperty );
      meanPropertyDependencies.push( person.isActiveProperty );
    }

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

  public override reset(): void {
    this.isMeanAccordionExpandedProperty.reset();
    this.numberOfPeopleProperty.reset();
    this.peopleArray.forEach( person => person.reset() );
    this.platesArray.forEach( plate => plate.reset() );
  }

  public syncData(): void {
    // future implementation
  }

  public step( dt: number ): void {
    // future implementation
  }

}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );