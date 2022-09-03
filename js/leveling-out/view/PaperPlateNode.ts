// Copyright 2022, University of Colorado Boulder

/**
 * Contains all the chocolate bars on a plate. Each plate has one PaperPlateNode,
 * and each container has a maximum of 10 chocolates bars.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { DragListener, Node, NodeOptions, NodeTranslationOptions, PressListenerEvent, Rectangle, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import DraggableChocolate from './DraggableChocolate.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<VBoxOptions, keyof NodeTranslationOptions> & PickRequired<NodeOptions, 'tandem'>;

export default class PaperPlateNode extends Node {
  public constructor( plate: Plate, chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => Plate, providedOptions: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.position.x,
      y: plate.position.y,
      visibleProperty: plate.isActiveProperty
    }, providedOptions );

    const chocolateBars: Array<Node> = [];
    const draggableChocolateBars: Array<Node> = [];
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES; i++ ) {
      const y = ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 2 ) * -i;
      const x = plate.position.x;

      const draggableChocolate = new DraggableChocolate( chocolateBarDropped, {
        position: new Vector2( x, y ),
        tandem: options.tandem.createTandem( `chocolateBar${i + 1}` )
      } );

      const forwardingListener = DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
        draggableChocolate.chocolateBarDragListener.press( event );
        plate.chocolateBarsNumberProperty.value -= 1;
      } );

      const chocolateBar = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT, {
        fill: 'saddleBrown',
        stroke: 'black',
        cursor: 'pointer',
        inputListeners: [ forwardingListener ]
      } );
      chocolateBars.push( chocolateBar );
      draggableChocolateBars.push( draggableChocolate );
    }

    plate.chocolateBarsNumberProperty.link( chocolateBarsNumber => {
      chocolateBars.forEach( ( chocolateBar, i ) => {
        chocolateBar.visibleProperty.set( i < chocolateBarsNumber );
      } );
    } );

    options.children = [ ...draggableChocolateBars, ...chocolateBars ];
    options.excludeInvisibleChildrenFromBounds = false;
    super( options );
  }
}

meanShareAndBalance.register( 'PaperPlateNode', PaperPlateNode );