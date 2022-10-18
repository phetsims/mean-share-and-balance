// Copyright 2022, University of Colorado Boulder

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

export default class IntroOptionsVerticalCheckboxGroup extends VerticalCheckboxGroup {
  public constructor( tickMarksVisibleProperty: Property<boolean>, meanVisibleProperty: Property<boolean>,
                      predictMeanVisibleProperty: Property<boolean>, cupWaterLevelVisibleProperty: Property<boolean>,
                      providedOptions: PickRequired<VerticalCheckboxGroupOptions, 'tandem'> ) {

    super( [ {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.predictMeanStringProperty, {
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'predictMeanText' )
        } ),
        property: predictMeanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.predictMeanStringProperty },

        // phet-io
        tandemName: 'predictMeanCheckbox'
      }, {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.meanStringProperty, {
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'meanText' )
        } ),
        property: meanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.meanStringProperty },

        // phet-io
        tandemName: 'meanCheckbox'
      }, {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.tickMarksStringProperty, {
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'tickMarksText' )
        } ),
        property: tickMarksVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.tickMarksStringProperty },

        // phet-io
        tandemName: 'tickMarksCheckbox'
      }, {
        createNode: tandem => new Text( MeanShareAndBalanceStrings.cupWaterLevelStringProperty, {
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH,
          tandem: tandem.createTandem( 'cupWaterLevelText' )
        } ),
        property: cupWaterLevelVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.cupWaterLevelStringProperty },
        tandemName: 'waterCupLevelCheckbox'
      } ], {

        checkboxOptions: {
          boxWidth: 16
        },
        align: 'left',
        layoutOptions: { column: 0, row: 0, xAlign: 'left' },
        tandem: providedOptions.tandem.createTandem( 'introOptionsCheckboxGroup' )
      }
    );
  }
}

meanShareAndBalance.register( 'IntroOptionsVerticalCheckboxGroup', IntroOptionsVerticalCheckboxGroup );