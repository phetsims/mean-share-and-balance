// Copyright 2022, University of Colorado Boulder


/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, Image, Node } from '../../../../scenery/js/imports.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';

export default class DraggableChocolateNode extends Node {

  public constructor() {

    const chocolateBar = new Image( chocolateBar_png, { scale: 0.05 } );
    const chocolateBarDragListener = new DragListener();
   super( { children: [ chocolateBar ], inputListeners: [ chocolateBarDragListener ] } );
  }
}

meanShareAndBalance.register( 'DraggableChocolateNode', DraggableChocolateNode );