// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 *
 */

import Dialog from '../../../../sun/js/Dialog.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { GridBox, Line, Text, VBox } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Person from '../model/Person.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import Panel from '../../../../sun/js/Panel.js';
import NoteBookPaperNode from '../../common/view/NoteBookPaperNode.js';

const NOTEBOOK_PAPER_NODE = new NoteBookPaperNode();


export default class MeanCalculationDialog extends Dialog {

  public constructor( people: Array<Person>, visibleProperty: Property<boolean> ) {

    const isActiveProperties = people.map( person => person.isActiveProperty );
    const numberOfChocolatesProperties = people.map( person => person.chocolateNumberProperty );

    // REVIEW: i18n
    const meanTitleText = new Text( 'Mean' );
    const meanEqualsAdditionFractionText = new Text( 'mean = ' );
    const meanEqualsFractionText = new Text( 'mean = ' );
    const meanEqualsDecimalText = new Text( 'mean = ' );


    const calculationNode = new GridBox( {
      margin: 10
    } );

    const notebookPaperWidth = NOTEBOOK_PAPER_NODE.width;
    const notebookPaperHeight = NOTEBOOK_PAPER_NODE.height;

    const panel = new Panel( calculationNode, {
      stroke: null,
      minWidth: notebookPaperWidth - 76.4, // the left and right margin calculated by Dialog.ts
      minHeight: notebookPaperHeight - 40 // the top/bottom margin, and y spacing implemented by Dialog.ts
    } );

    Multilink.multilinkAny( [ ...isActiveProperties, ...numberOfChocolatesProperties ], () => {
      const numbers = people.filter( person => person.isActiveProperty.value ).map( person => person.chocolateNumberProperty.value );
      const numberOfPeople = people.filter( person => person.isActiveProperty.value ).length;
      const additionText = new Text( numbers.join( ' + ' ) );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, { stroke: 'black' } );
      const additionDenominatorText = new Text( numberOfPeople );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      const numeratorText = new Text( _.sum( numbers ) );
      const fractionLine = new Line( 0, 0, numeratorText.width, 0, { stroke: 'black' } );
      const denominatorText = new Text( numberOfPeople );
      const fraction = new VBox( { children: [ numeratorText, fractionLine, denominatorText ] } );

      const decimalText = new Text( Utils.toFixedNumber( _.sum( numbers ) / numberOfPeople, 2 ) );

      calculationNode.rows = [ [ meanEqualsAdditionFractionText, additionFraction ], [ meanEqualsFractionText, fraction ], [ meanEqualsDecimalText, decimalText ] ];
    } );


    super( panel, {
        title: meanTitleText,
        titleAlign: 'left',
        visibleProperty: visibleProperty,
        resize: false,
        centerY: MeanShareAndBalanceConstants.NOTEBOOK_PAPER_CENTER_Y,
        closeButtonListener: () => { this.visibleProperty.set( false ); },

        // We specify the position manually
        // REVIEW: Where is x specified?
        layoutStrategy: _.noop
      }
    );

  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );