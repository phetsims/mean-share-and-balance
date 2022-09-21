// Copyright 2022, University of Colorado Boulder
/**
 * VBox containing a number spinner and text label
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';


export default class NumberSpinnerVBox extends VBox {

  public constructor( numberOfCupsProperty: Property<number>, providedOptions: PickRequired<VBoxOptions, 'tandem'> ) {

    const numberOfCupsText = new Text( MeanShareAndBalanceStrings.numberOfCupsStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      numberOfCupsProperty,
      new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_RANGE ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: MeanShareAndBalanceStrings.numberOfCupsStringProperty,

        // phet-io
        tandem: providedOptions.tandem.createTandem( 'numberSpinner' )
      }
    );

    super( {
      children: [ numberOfCupsText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 0, row: 2 }
    } );
  }
}

meanShareAndBalance.register( 'NumberSpinnerVBox', NumberSpinnerVBox );