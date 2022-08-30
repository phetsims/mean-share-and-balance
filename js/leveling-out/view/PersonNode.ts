// Copyright 2022, University of Colorado Boulder

/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { Node, Path } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import smileSolidShape from '../../../../sherpa/js/fontawesome-5/smileSolidShape.js';
import Person from '../model/Person.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';

export default class PersonNode extends Node {

  public constructor( person: Person ) {
    const smiley = new Path( smileSolidShape, { fill: 'black', scale: 0.1 } );

    const numberSpinnerRange = new Range( MeanShareAndBalanceConstants.MIN_NUMBER_OF_CHOCOLATES, MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES );
    const numberSpinner = new NumberPicker( person.chocolateNumberProperty, new Property( numberSpinnerRange ) );

    super( {
      children: [ smiley, numberSpinner ],
      x: person.position.x,
      y: person.position.y
    } );
  }
}

meanShareAndBalance.register( 'PersonNode', PersonNode );