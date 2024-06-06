// Copyright 2022-2024, University of Colorado Boulder

/**
 * A vertical checkbox group that controls visibility for various sim features.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import VerticalCheckboxGroup, { VerticalCheckboxGroupItem, VerticalCheckboxGroupOptions } from '../../../../sun/js/VerticalCheckboxGroup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import { Text } from '../../../../scenery/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  totalVisibleProperty?: Property<boolean> | null;
  predictMeanVisibleProperty?: Property<boolean> | null;
  tickMarksVisibleProperty?: Property<boolean> | null;
};
type MeanShareAndBalanceCheckboxGroupOptions = SelfOptions & WithRequired<VerticalCheckboxGroupOptions, 'tandem'>;

export default class MeanShareAndBalanceCheckboxGroup extends VerticalCheckboxGroup {
  public constructor( providedOptions: MeanShareAndBalanceCheckboxGroupOptions ) {

    const options = optionize<MeanShareAndBalanceCheckboxGroupOptions, SelfOptions, VerticalCheckboxGroupOptions>()( {
      totalVisibleProperty: null,
      predictMeanVisibleProperty: null,
      tickMarksVisibleProperty: null,
      checkboxOptions: MeanShareAndBalanceConstants.CHECKBOX_OPTIONS,
      align: 'left',
      layoutOptions: { align: 'left' },
      isDisposable: false
    }, providedOptions );

    const checkboxItems: VerticalCheckboxGroupItem[] = [];

    if ( options.predictMeanVisibleProperty ) {
      checkboxItems.push( {
        createNode: () => new Text( MeanShareAndBalanceStrings.predictMeanStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
        } ),
        property: options.predictMeanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.predictMeanStringProperty },
        tandemName: 'predictMeanCheckbox'
      } );
    }
    if ( options.tickMarksVisibleProperty ) {
      checkboxItems.push( {
        createNode: () => new Text( MeanShareAndBalanceStrings.tickMarksStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
        } ),
        property: options.tickMarksVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.tickMarksStringProperty },
        tandemName: 'tickMarksCheckbox'
      } );
    }
    if ( options.totalVisibleProperty ) {
      checkboxItems.push( {
        createNode: () => new Text( MeanShareAndBalanceStrings.totalStringProperty, {
          fontSize: MeanShareAndBalanceConstants.CHECKBOX_FONT_SIZE,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
        } ),
        property: options.totalVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.totalStringProperty },
        tandemName: 'totalCheckbox'
      } );
    }

    super( checkboxItems, options );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceCheckboxGroup', MeanShareAndBalanceCheckboxGroup );