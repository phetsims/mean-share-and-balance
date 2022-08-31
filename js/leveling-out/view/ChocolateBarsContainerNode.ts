// Copyright 2022, University of Colorado Boulder

/**
 * Contains all the chocolate bars on a plate. Each plate has one ChocolateBarsContainerNode,
 * and each container has a maximum of 10 chocolates bars.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Image, Node, NodeOptions, NodeTranslationOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Plate from '../model/Plate.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<NodeOptions, keyof NodeTranslationOptions>;

export default class ChocolateBarsContainerNode extends Node {
  public constructor( plate: Plate, providedOptions?: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: plate.position.x,
      y: plate.position.y,
      scale: 0.1,
      visibleProperty: plate.isActiveProperty
    }, providedOptions );

    const chocolateBars = [];
    for ( let i = 0; i < plate.chocolateBarsNumberProperty.value; i++ ) {
      const chocolateBar = new Image( chocolateBar_png );
      chocolateBar.y = ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 5 ) * i;
      chocolateBars.push( chocolateBar );
    }

    options.children = chocolateBars;
    super( options );
  }
}

meanShareAndBalance.register( 'ChocolateBarsContainerNode', ChocolateBarsContainerNode );