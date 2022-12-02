// Copyright 2022, University of Colorado Boulder

/**
 * In the upper (paper) representation, contains all the chocolate bars on a plate. Each plate has one PaperPlateNode,
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
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<VBoxOptions, keyof NodeTranslationOptions | 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class PaperPlateNode extends Node {
  public constructor( plate: Plate, chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => void, providedOptions: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.position.x,
      y: plate.position.y,
      visibleProperty: plate.isActiveProperty,
      excludeInvisibleChildrenFromBounds: false,
      children: [ new Line( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, 0, { stroke: 'black' } ) ]
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'PaperPlateNode', PaperPlateNode );