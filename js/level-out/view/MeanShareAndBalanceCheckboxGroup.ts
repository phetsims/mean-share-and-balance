// Copyright 2022-2024, University of Colorado Boulder

/**
 * A vertical checkbox group that controls visibility for predictMean, Mean, tickMarks, and cupWaterLevel
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import VerticalCheckboxGroup, { VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import { Text } from '../../../../scenery/js/imports.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

export default class MeanShareAndBalanceCheckboxGroup extends VerticalCheckboxGroup {
  public constructor( tickMarksVisibleProperty: Property<boolean>, predictMeanVisibleProperty: Property<boolean>,
                      providedOptions: PickRequired<VerticalCheckboxGroupOptions, 'tandem'> ) {

    super( [ {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.predictMeanStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'predictMeanText' )
        } ),
        property: predictMeanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.predictMeanStringProperty },

        // phet-io
        tandemName: 'predictMeanCheckbox'
      }, {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.tickMarksStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'tickMarksText' )
        } ),
        property: tickMarksVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.tickMarksStringProperty },

        // phet-io
        tandemName: 'tickMarksCheckbox'
      } ], {

        checkboxOptions: MeanShareAndBalanceConstants.CHECKBOX_OPTIONS,
        align: 'left',
        layoutOptions: { align: 'left' },
        tandem: providedOptions.tandem.createTandem( 'CheckboxGroup' )
      }
    );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceCheckboxGroup', MeanShareAndBalanceCheckboxGroup );