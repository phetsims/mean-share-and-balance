// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import EmptyObjectType from '../../../../phet-core/js/types/EmptyObjectType.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import MeanShareAndBalanceModel, { MeanShareAndBalanceModelOptions } from '../../common/model/MeanShareAndBalanceModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import Chocolate from './Chocolate.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptyObjectType;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRange = new Range( 1, 7 );
  public readonly numberOfPeopleProperty: NumberProperty;
  public readonly isMeanAccordionExpandedProperty: BooleanProperty;

  public readonly plateChocolateGroup: PhetioGroup<Chocolate, [ number ]>;

  public constructor( providedOptions?: LevelingOutModelOptions ) {

    const options = optionize<LevelingOutModelOptions, SelfOptions, MeanShareAndBalanceModelOptions>()( {}, providedOptions );
    super( options );

    this.numberOfPeopleProperty = new NumberProperty( MeanShareAndBalanceConstants.INITIAL_NUMBER_OF_PEOPLE, {
      tandem: options.tandem.createTandem( 'numberOfPeopleProperty' ),
      numberType: 'Integer',
      range: this.numberOfPeopleRange
    } );

    this.isMeanAccordionExpandedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isMeanAccordionExpandedProperty' )
    } );

    this.plateChocolateGroup = new PhetioGroup( ( tandem: Tandem, x: number ) => {
      return new Chocolate( {
        tandem: tandem,
        x: x,
        y: 200
      } );
    }, [ 0 ], {
      phetioType: PhetioGroup.PhetioGroupIO( Chocolate.ChocolateIO ),
      phetioDocumentation: 'Holds the models for chocolate on plates.',
      tandem: options.tandem.createTandem( 'plateChocolateGroup' )
    } );

    for ( let i = 0; i < 7; i++ ) {
      if ( i === 0 ) {
        this.plateChocolateGroup.createNextElement( 0 );
      }
      else {
        const lastPlate = this.plateChocolateGroup.getLastElement();
        this.plateChocolateGroup.createNextElement( lastPlate.x + 50 );
      }
    }
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