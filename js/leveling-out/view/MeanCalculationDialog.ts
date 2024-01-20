// Copyright 2022-2024, University of Colorado Boulder

/**
 * A dialog that shows different mathematical representations of the mean according to the sim's current data.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Dialog from '../../../../sun/js/Dialog.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { GridBox, Line, Text, VBox } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import TablePlate from '../model/TablePlate.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import Panel from '../../../../sun/js/Panel.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class MeanCalculationDialog extends Dialog {

  public constructor( people: Array<TablePlate>, visibleProperty: Property<boolean>, notebookPaperBounds: Bounds2, tandem: Tandem ) {

    const meanTitleText = new Text( MeanShareAndBalanceStrings.meanStringProperty );
    const meanEqualsAdditionFractionText = new Text( MeanShareAndBalanceStrings.meanEqualsStringProperty );
    const meanEqualsFractionText = new Text( MeanShareAndBalanceStrings.meanEqualsStringProperty );
    const meanEqualsDecimalText = new Text( MeanShareAndBalanceStrings.meanEqualsStringProperty );

    const calculationNode = new GridBox( {
      margin: 10
    } );

    const panel = new Panel( calculationNode, {
      stroke: null,
      minWidth: notebookPaperBounds.width - 76.4, // the left and right margin calculated by Dialog.ts
      minHeight: notebookPaperBounds.height - 40 // the top/bottom margin, and y spacing implemented by Dialog.ts
    } );

    const isActiveProperties = people.map( person => person.isActiveProperty );
    const numberOfCandyBarsProperties = people.map( person => person.candyBarNumberProperty );
    Multilink.multilinkAny( [ ...isActiveProperties, ...numberOfCandyBarsProperties ], () => {
      const numbers = people.filter( person => person.isActiveProperty.value ).map( person => person.candyBarNumberProperty.value );
      const numberOfPeople = people.filter( person => person.isActiveProperty.value ).length;

      // REVIEW: Can we align the numbers with the table spinners?  So correspondence is clear?
      const additionText = new Text( numbers.join( ' + ' ) );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, { stroke: 'black' } );
      const additionDenominatorText = new Text( numberOfPeople );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      const numeratorText = new Text( _.sum( numbers ) );
      const fractionLine = new Line( 0, 0, numeratorText.width, 0, { stroke: 'black' } );
      const denominatorText = new Text( numberOfPeople );
      const fraction = new VBox( { children: [ numeratorText, fractionLine, denominatorText ] } );

      const decimalText = new Text( Utils.toFixedNumber( _.sum( numbers ) / numberOfPeople, 2 ) );

      calculationNode.rows = [
        [ meanEqualsAdditionFractionText, additionFraction ],
        [ meanEqualsFractionText, fraction ],
        [ meanEqualsDecimalText, decimalText ]
      ];
    } );

    super( panel, {
      title: meanTitleText,
      titleAlign: 'left',
      visibleProperty: visibleProperty,
      resize: false,
      centerY: MeanShareAndBalanceConstants.NOTEPAD_PAPER_CENTER_Y,
      closeButtonListener: () => this.visibleProperty.set( false ),

      // We specify the position manually
      // REVIEW: Where is x specified?
      layoutStrategy: _.noop,
      tandem: tandem
    } );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );