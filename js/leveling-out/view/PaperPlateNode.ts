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
import { Line, Node, NodeOptions, NodeTranslationOptions, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import DraggableChocolate from './DraggableChocolate.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<VBoxOptions, keyof NodeTranslationOptions> & PickRequired<NodeOptions, 'tandem'>;

export default class PaperPlateNode extends Node {
  public constructor( plate: Plate, chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => Plate, providedOptions: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.position.x,
      y: plate.position.y,
      visibleProperty: plate.isActiveProperty
    }, providedOptions );

    const plateLine = new Line( 0, 0, 20, 0, { stroke: 'black' } );


    options.children = [ plateLine ];
    options.excludeInvisibleChildrenFromBounds = false;
    super( options );
  }
}

meanShareAndBalance.register( 'PaperPlateNode', PaperPlateNode );