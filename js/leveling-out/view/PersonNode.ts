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

export default class PersonNode extends Node {

  public constructor( person: Person ) {
    const smiley = new Path( smileSolidShape, { fill: 'black' } );
    super( {
      children: [ smiley ],
      scale: 0.2
    } );
  }
}

meanShareAndBalance.register( 'PersonNode', PersonNode );