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

type SelfOptions = EmptyObjectType;
type LevelingOutModelOptions = SelfOptions & PickRequired<MeanShareAndBalanceModelOptions, 'tandem'>

export default class LevelingOutModel extends MeanShareAndBalanceModel {

  public readonly numberOfPeopleRange = new Range( 1, 7 );
  public readonly numberOfPeopleProperty: NumberProperty;
  public readonly isMeanAccordionExpandedProperty: BooleanProperty;

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
  }

}

meanShareAndBalance.register( 'LevelingOutModel', LevelingOutModel );