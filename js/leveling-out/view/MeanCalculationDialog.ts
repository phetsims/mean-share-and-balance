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
import { Node, VBox, Text, Line, GridBox } from '../../../../scenery/js/imports.js';
import Person from '../model/Person.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class MeanCalculationDialog extends Dialog {

  public constructor( People: Array<Person> ) {

    const isActiveProperties = People.map( person => person.isActiveProperty );
    const numberOfChocolatesProperties = People.map( person => person.chocolateNumberProperty );
    const meanEqualsText = new Text( 'mean = ' );
    const parentNode = new Node();
    const calculationNode = new GridBox();


    Multilink.multilinkAny( [ ...isActiveProperties, ...numberOfChocolatesProperties ], () => {
      const numbers = People.filter( person => person.isActiveProperty.value ).map( person => person.chocolateNumberProperty.value );
      const additionText = new Text( numbers.join( ' + ' ) );
      const fractionLine = new Line( 0, 0, additionText.width, 0, { stroke: 'black' } );
      const denominatorText = new Text( People.filter( person => person.isActiveProperty.value ).length );
      const additionFraction = new VBox( { children: [ additionText, fractionLine, denominatorText ] } );

      calculationNode.rows = [ [ meanEqualsText, additionFraction ] ];

      parentNode.children = [ calculationNode ];
    } );

   super( parentNode );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );