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

export default class PersonNode extends Node {

  public constructor() {
    const smiley = new Path( smileSolidShape, { fill: 'black' } );
    super( { children: [ smiley ] } );
  }
}

meanShareAndBalance.register( 'PersonNode', PersonNode );