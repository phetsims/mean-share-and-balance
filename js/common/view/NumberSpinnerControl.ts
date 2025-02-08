// Copyright 2022-2025, University of Colorado Boulder
/**
 * VBox containing a number spinner and text label
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import LocalizedStringProperty from '../../../../chipper/js/browser/LocalizedStringProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';

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
      font: MeanShareAndBalanceConstants.DEFAULT_FONT,
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
      numberDisplayOptions: {
        phetioFeatured: false
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