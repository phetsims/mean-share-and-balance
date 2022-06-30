// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  visiblePieces?: number; // The number of visible chocolate pieces in the bar. max of 4, min of 1
}
type ChocolateBarNodeOptions = SelfOptions & RectangleOptions;

export default class ChocolateBarRectangle extends Rectangle {
  public constructor( providedOptions?: ChocolateBarNodeOptions ) {

    const options = optionize<ChocolateBarNodeOptions, SelfOptions, RectangleOptions>()( {
      fill: MeanShareAndBalanceColors.chocolateColorProperty,
      visiblePieces: 4
    }, providedOptions );

    // TODO: Will change depending on number of visible pieces.
    const x2 = MeanShareAndBalanceConstants.CHOCOLATE_WIDTH;
    const y2 = MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT;

    super( 0, 0, x2, y2, options );
  }
}

meanShareAndBalance.register( 'ChocolateBarRectangle', ChocolateBarRectangle );