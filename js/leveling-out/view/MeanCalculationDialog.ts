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
import Person from '../model/Person.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';

export default class MeanCalculationDialog extends Dialog {

  public constructor( People: Array<Person>, visibleProperty: Property<boolean> ) {

    const isActiveProperties = People.map( person => person.isActiveProperty );
    const numberOfChocolatesProperties = People.map( person => person.chocolateNumberProperty );
    const meanTitleText = new Text( 'Mean' );
    const meanEqualsText = new Text( 'mean = ' );
    const calculationNode = new GridBox();


    Multilink.multilinkAny( [ ...isActiveProperties, ...numberOfChocolatesProperties ], () => {
      const numbers = People.filter( person => person.isActiveProperty.value ).map( person => person.chocolateNumberProperty.value );
      const additionText = new Text( numbers.join( ' + ' ) );
      const fractionLine = new Line( 0, 0, additionText.width, 0, { stroke: 'black' } );
      const denominatorText = new Text( People.filter( person => person.isActiveProperty.value ).length );
      const additionFraction = new VBox( { children: [ additionText, fractionLine, denominatorText ] } );

      calculationNode.rows = [ [ meanEqualsText, additionFraction ] ];
    } );


    super( calculationNode, {
      title: meanTitleText,
      titleAlign: 'left',
      visibleProperty: visibleProperty,
      resize: false,
      centerY: MeanShareAndBalanceConstants.PLATE_CHOCOLATE_CENTER_Y,
      minWidth: MeanShareAndBalanceConstants.NOTEBOOK_PAPER_WIDTH,
      minimumHeight: MeanShareAndBalanceConstants.NOTEBOOK_PAPER_HEIGHT,
      closeButtonListener: ( ) => { this.visibleProperty.set( false ); }
    } );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );