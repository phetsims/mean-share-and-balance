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
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';

type SelfOptions = {
  numberSpinnerOptions: NumberSpinnerOptions;
};

export type NumberSpinnerVBoxOptions = SelfOptions & WithRequired<VBoxOptions, 'tandem'>;

export default class NumberSpinnerControl extends VBox {

  public constructor( numberProperty: Property<number>,
                      rangeProperty: Property<Range>,
                      stringProperty: LocalizedStringProperty,
                      providedOptions: NumberSpinnerVBoxOptions ) {

    const options = optionize<NumberSpinnerVBoxOptions, SelfOptions, VBoxOptions>()( {
      layoutOptions: {
        minContentHeight: 100
      },
      isDisposable: false
    }, providedOptions );

    const labelText = new Text( stringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinnerOptions = combineOptions<NumberSpinnerOptions>( {
      arrowsPosition: 'leftRight',
      layoutOptions: {
        align: 'left'
      },
      accessibleName: stringProperty,

      // phet-io
      phetioFeatured: true,
      phetioVisiblePropertyInstrumented: true,
      numberDisplayOptions: {
        phetioFeatured: false
      },
      visiblePropertyOptions: {
        phetioFeatured: true
      },
      tandem: options.tandem.createTandem( 'numberSpinner' )
    }, options.numberSpinnerOptions );

    const numberSpinner = new NumberSpinner(
      numberProperty,
      rangeProperty,
      numberSpinnerOptions
    );

    const superOptions = combineOptions<VBoxOptions>( {
      children: [ labelText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: { phetioFeatured: true }
    }, options );
    super( superOptions );
  }
}

meanShareAndBalance.register( 'NumberSpinnerControl', NumberSpinnerControl );