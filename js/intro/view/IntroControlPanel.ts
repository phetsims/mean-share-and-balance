// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the intro screen that contains a checkbox group with visibility toggling for: predictMean, mean, and tickMarks
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Property from '../../../../axon/js/Property.js';

export default class IntroControlPanel extends Node {
  public constructor( tickMarksVisibleProperty: Property<boolean>, meanVisibleProperty: Property<boolean>,
                      predictMeanVisibleProperty: Property<boolean>, cupWaterLevelVisibleProperty: Property<boolean>, tandem: Tandem ) {

    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMeanProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );
    const meanText = new Text( meanShareAndBalanceStrings.meanProperty, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarksProperty, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const cupWaterLevel = new Text( meanShareAndBalanceStrings.cupWaterLevelProperty, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );

    // Checkbox Group
    const introOptionsCheckboxGroupTandem = tandem.createTandem( 'introOptionsCheckboxGroup' );
    const introOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: predictMeanText,
        property: predictMeanVisibleProperty,
        options: { accessibleName: meanShareAndBalanceStrings.predictMeanProperty },

      // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' )
      }, {
        node: meanText,
        property: meanVisibleProperty,
        options: { accessibleName: meanShareAndBalanceStrings.meanProperty },

        // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'meanCheckbox' )
      }, {
        node: tickMarksText,
        property: tickMarksVisibleProperty,
        options: { accessibleName: meanShareAndBalanceStrings.tickMarksProperty },

        // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' )
      }, {
        node: cupWaterLevel,
        property: cupWaterLevelVisibleProperty,
        options: { accessibleName: meanShareAndBalanceStrings.cupWaterLevelProperty }
      } ], {

        checkboxOptions: {
          boxWidth: 16
        }
      }
    );

    super( { children: [ introOptionsCheckboxGroup ] } );
  }
}

meanShareAndBalance.register( 'IntroControlPanel', IntroControlPanel );