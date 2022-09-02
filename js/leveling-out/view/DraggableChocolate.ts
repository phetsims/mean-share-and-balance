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

export default class DraggableChocolate extends Node {

  public readonly positionProperty: Property<Vector2>;

  public constructor( chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => void, providedOptions: DraggableChocolateNodeOptions ) {

    const options = providedOptions;

    const chocolateBar = new Image( chocolateBar_png, { scale: 0.05 } );

    const combinedOptions = combineOptions<NodeOptions>( {
      children: [ chocolateBar ],
      cursor: 'pointer'
    }, options );
    super( combinedOptions );

    this.positionProperty = new Property( new Vector2( 0, 0 ) );

    // TODO: snap into nearest chocolate spot on plate.
    // Will decrease it's plate's chocolate count by 1
    // Will increase the chocolate count of the plate it's dropped onto.
    const chocolateBarDragListener = new DragListener( {
      positionProperty: this.positionProperty,
      tandem: options.tandem.createTandem( 'chocolateBarDragListener' ),
      end: () => {
        chocolateBarDropped( this );
      }
    } );

    this.addInputListener( chocolateBarDragListener );

    this.positionProperty.link( position => {
      this.x = position.x;
      this.y = position.y;
    } );
  }
}

meanShareAndBalance.register( 'DraggableChocolate', DraggableChocolate );