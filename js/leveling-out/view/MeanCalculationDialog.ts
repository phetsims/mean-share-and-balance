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
import { Node } from '../../../../scenery/js/imports.js';
import Person from '../model/Person.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class MeanCalculationDialog extends Dialog {

  public constructor( People: Array<Person> ) {

    const isActiveProperties = People.map( person => person.isActiveProperty );
    const numberOfChocolatesProperties = People.map( person => person.chocolateNumberProperty );
    const parentNode = new Node();

    Multilink.multilinkAny( [ ...isActiveProperties, ...numberOfChocolatesProperties ], () => {
      const calculationNode = new Node();

      parentNode.children = [ calculationNode ];
    } );

   super( parentNode );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );