// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */


import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Chocolate from '../model/Chocolate.js';
import ChocolateBarRectangle from './ChocolateBarRectangle.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type ChocolateBarsContainerNodeOptions = StrictOmit<NodeOptions, 'x' | 'y' | 'left' | 'right' | 'top' | 'bottom'>;

export default class ChocolateBarsContainerNode extends Node {
  public constructor( chocolateModel: Chocolate, providedOptions?: ChocolateBarsContainerNodeOptions ) {
    const options = optionize<ChocolateBarsContainerNodeOptions, EmptySelfOptions, NodeOptions>()( {
      x: chocolateModel.x,
      y: chocolateModel.y
    }, providedOptions );

    const chocolateBars = [];
    for ( let i = 0; i < chocolateModel.chocolateBarsNumberProperty.value; i++ ) {
      const chocolateBar = new ChocolateBarRectangle();
      chocolateBar.y = ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT + 5 ) * i;
      chocolateBars.push( chocolateBar );
    }

    options.children = chocolateBars;
    super( options );
  }
}

meanShareAndBalance.register( 'ChocolateBarsContainerNode', ChocolateBarsContainerNode );