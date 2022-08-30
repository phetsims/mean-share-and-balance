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
import Chocolate from './Chocolate.js';
import Person from './Person.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>;

const MAX_PEOPLE = 7;

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRange = new Range( 1, MAX_PEOPLE );
  public readonly numberOfPeopleProperty: NumberProperty;
  public readonly isMeanAccordionExpandedProperty: BooleanProperty;

  public readonly plateChocolateArray: Array<Chocolate>;
  public readonly peopleArray: Array<Person>;

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

    this.plateChocolateArray = [];
    this.peopleArray = [];

    for ( let i = 0; i < MAX_PEOPLE; i++ ) {
      const x = i * MeanShareAndBalanceConstants.PERSON_WIDTH;
      const chocolate = new Chocolate( {
        isActive: i < this.numberOfPeopleProperty.value,
        position: new Vector2( x, MeanShareAndBalanceConstants.PLATE_CHOCOLATE_CENTER_Y ),
        tandem: options.tandem.createTandem( `plateChocolate${i}` )
      } );
      this.plateChocolateArray.push( chocolate );

      const person = new Person( {
        position: new Vector2( x, MeanShareAndBalanceConstants.PEOPLE_CENTER_Y ),
        isActive: i < this.numberOfPeopleProperty.value,
        tandem: options.tandem.createTandem( `person${i}` )
      } );
      this.peopleArray.push( person );
    }

    this.numberOfPeopleProperty.link( numberOfPeople => {
      this.plateChocolateArray.forEach( ( plateChocolate, i ) => {
        plateChocolate.isActiveProperty.value = i < numberOfPeople;
      } );
      this.peopleArray.forEach( ( person, i ) => {
        person.isActiveProperty.value = i < numberOfPeople;
      } );
    } );
  }

  public override reset(): void {
    this.isMeanAccordionExpandedProperty.reset();
    this.numberOfPeopleProperty.reset();
  }

  public syncData(): void {
    // future implementation
  }

  public step( dt: number ): void {
    // future implementation
  }

}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );