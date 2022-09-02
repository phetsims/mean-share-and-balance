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
import { Node, NodeOptions, NodeTranslationOptions, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import DraggableChocolate from './DraggableChocolate.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<VBoxOptions, keyof NodeTranslationOptions> & PickRequired<NodeOptions, 'tandem'>;

export default class PaperPlateNode extends Node {
  public constructor( plate: Plate, chocolateBarDropped: ( chocolateBar: DraggableChocolate ) => void, providedOptions: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.position.x,
      y: plate.position.y,
      visibleProperty: plate.isActiveProperty
    }, providedOptions );

    const chocolateBars: Array<Node> = [];
    for ( let i = 0; i < MeanShareAndBalanceConstants.MAX_NUMBER_OF_CHOCOLATES; i++ ) {
      const chocolateBar = new DraggableChocolate( chocolateBarDropped, { tandem: options.tandem.createTandem( `chocolateBar${i + 1}` ) } );

      const y = ( chocolateBar.height + 1.5 ) * -i;
      const x = chocolateBar.positionProperty.value.x;
      chocolateBar.positionProperty.set( new Vector2( x, y ) );

      chocolateBars.push( chocolateBar );
    }

    plate.chocolateBarsNumberProperty.link( chocolateBarsNumber => {
      chocolateBars.forEach( ( chocolateBar, i ) => {
        chocolateBar.visibleProperty.set( i < chocolateBarsNumber );
      } );
    } );

    options.children = chocolateBars;
    options.excludeInvisibleChildrenFromBounds = false;
    super( options );
  }
}

meanShareAndBalance.register( 'PaperPlateNode', PaperPlateNode );