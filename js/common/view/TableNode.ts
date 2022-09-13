// Copyright 2022, University of Colorado Boulder

/**
 * Representation for the valve that opens and closes a pipe.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import labDesk_png from '../../../images/labDesk_png.js';


export default class TableNode extends Node {

  public constructor( providedOptions: StrictOmit<NodeOptions, 'children'> ) {

    const table = new Image( labDesk_png, { scale: 0.5 } );

    const options = combineOptions<NodeOptions>( { children: [ table ] }, providedOptions );
    super( options );
  }
}

meanShareAndBalance.register( 'TableNode', TableNode );