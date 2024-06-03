// Copyright 2022-2024, University of Colorado Boulder
/**
 * VBox containing a number spinner and text label
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  minContentHeight?: number;
  numberSpinnerOptions: NumberSpinnerOptions;
};

export type NumberSpinnerVBoxOptions = SelfOptions & VBoxOptions;

export default class NumberSpinnerVBox extends VBox {

  public constructor( numberProperty: Property<number>,
                      rangeProperty: Property<Range>,
                      stringProperty: LocalizedStringProperty,
                      providedOptions: NumberSpinnerVBoxOptions ) {

    const options = optionize<NumberSpinnerVBoxOptions, SelfOptions, VBoxOptions>()( {
      minContentHeight: 100,
      isDisposable: false
    }, providedOptions );

    const numberOfCupsText = new Text( stringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinnerOptions = combineOptions<NumberSpinnerOptions>( {
      arrowsPosition: 'leftRight',
      layoutOptions: {
        align: 'left'
      },
      accessibleName: stringProperty
    }, options.numberSpinnerOptions );

    const numberSpinner = new NumberSpinner(
      numberProperty,
      rangeProperty,
      numberSpinnerOptions
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