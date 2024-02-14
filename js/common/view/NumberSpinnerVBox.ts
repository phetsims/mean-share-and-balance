// Copyright 2022, University of Colorado Boulder
/**
 * VBox containing a number spinner and text label
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import { Range } from '../../../../dot/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { combineOptions, optionize } from '../../../../phet-core/js/imports.js';

type SelfOptions = {
  minContentHeight?: number;
};

type NumberSpinnerVBoxOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class NumberSpinnerVBox extends VBox {

  public constructor( numberProperty: Property<number>, range: Range, stringProperty: LocalizedStringProperty, providedOptions: NumberSpinnerVBoxOptions ) {

    const options = optionize<NumberSpinnerVBoxOptions, SelfOptions, VBoxOptions>()( {
      minContentHeight: 100
    }, providedOptions );

    const numberOfCupsText = new Text( stringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      numberProperty,
      new Property( range ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: stringProperty,

        // phet-io
        tandem: providedOptions.tandem.createTandem( 'numberSpinner' )
      }
    );

    const superOptions = combineOptions<VBoxOptions>( {
      children: [ numberOfCupsText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: {
        minContentHeight: options.minContentHeight
      }
    } );
    super( superOptions );
  }
}

meanShareAndBalance.register( 'NumberSpinnerVBox', NumberSpinnerVBox );