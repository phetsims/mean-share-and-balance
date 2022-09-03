// Copyright 2022, University of Colorado Boulder


/**
 * TODO: describe file
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { DragListener, Node, NodeOptions, Rectangle } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Plate from '../model/Plate.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

type SelfOptions = {
  position: Vector2;
};

type DraggableChocolateNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class DraggableChocolate extends Node {

  public readonly positionProperty: Property<Vector2>;
  public readonly chocolateBarDragListener: DragListener;

  public constructor( chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => Plate, providedOptions: DraggableChocolateNodeOptions ) {

    const options = providedOptions;

    const chocolateBar = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT, {
      fill: 'saddleBrown',
      stroke: 'black',
      visibleProperty: new BooleanProperty( false )
    } );

    const combinedOptions = combineOptions<NodeOptions>( {
      children: [ chocolateBar ],
      cursor: 'pointer'
    }, options );
    super( combinedOptions );

    this.positionProperty = new Property( options.position );

    this.chocolateBarDragListener = new DragListener( {
      positionProperty: this.positionProperty,
      tandem: options.tandem.createTandem( 'chocolateBarDragListener' ),
      targetNode: this,
      start: () => {
        console.log( 'I started' );
        this.visibleProperty.set( true );
        this.moveToFront();
      },
      end: () => {
        const plateDroppedOn = chocolateBarDropped( this );
        plateDroppedOn.chocolateBarsNumberProperty.value += 1;
        this.visibleProperty.set( false );
        this.reset();
      }
    } );

    this.addInputListener( this.chocolateBarDragListener );

    this.positionProperty.link( position => {
      this.x = position.x;
      this.y = position.y;
    } );

    this.visibleProperty.link( visible => console.log( 'I changed' ) );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

meanShareAndBalance.register( 'DraggableChocolate', DraggableChocolate );