// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the intro screen that contains a checkbox group with visibility toggling for: predictMean, mean, and tickMarks
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { Node, Text } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import IntroModel from '../model/IntroModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class IntroControlPanel extends Node {
  public constructor( model: IntroModel, tandem: Tandem ) {

    const predictMeanText = new Text( meanShareAndBalanceStrings.predictMean, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );
    const meanText = new Text( meanShareAndBalanceStrings.mean, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const tickMarksText = new Text( meanShareAndBalanceStrings.tickMarks, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );

    // Checkbox Group
    const introOptionsCheckboxGroupTandem = tandem.createTandem( 'introOptionsCheckboxGroup' );
    const introOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: predictMeanText,
        property: model.predictMeanVisibleProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.predictMean }
      }, {
        node: meanText,
        property: model.meanVisibleProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'showMeanCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.mean }
      }, {
        node: tickMarksText,
        property: model.tickMarksVisibleProperty,
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' ),
        options: { accessibleName: meanShareAndBalanceStrings.tickMarks }
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