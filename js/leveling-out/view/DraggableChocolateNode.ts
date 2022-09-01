// Copyright 2022, University of Colorado Boulder


/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, Image, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';

type DraggableChocolateNodeOptions = NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DraggableChocolateNode extends Node {

  public constructor( providedOptions: DraggableChocolateNodeOptions ) {

    const options = providedOptions;

    const positionProperty = new Property( new Vector2( 0, 0 ) );
    const chocolateBar = new Image( chocolateBar_png, { scale: 0.05 } );
    const chocolateBarDragListener = new DragListener( {
      positionProperty: positionProperty,
      tandem: options.tandem.createTandem( 'chocolateBarDragListener' )
    } );

    const combinedOptions = combineOptions<NodeOptions>( {
        children: [ chocolateBar ],
        inputListeners: [ chocolateBarDragListener ]
    }, options );
    super( combinedOptions );

    positionProperty.link( position => {
      this.x = position.x;
      this.y = position.y;
    } );
  }
}

meanShareAndBalance.register( 'DraggableChocolateNode', DraggableChocolateNode );