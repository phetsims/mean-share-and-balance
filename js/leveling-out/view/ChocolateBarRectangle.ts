// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import { Line, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  visiblePieces?: number; // The number of visible chocolate pieces in the bar. max of 4, min of 1
};
type ChocolateBarNodeOptions = SelfOptions & RectangleOptions;

export default class ChocolateBarRectangle extends Rectangle {
  public constructor( providedOptions?: ChocolateBarNodeOptions ) {

    const options = optionize<ChocolateBarNodeOptions, SelfOptions, RectangleOptions>()( {
      fill: MeanShareAndBalanceColors.chocolateColorProperty,
      visiblePieces: 4,
      stroke: MeanShareAndBalanceColors.chocolateColorProperty
    }, providedOptions );

    // When a fraction of the chocolate bar needs to be represented x2 will change to reflect
    // the new width of the partial chocolate bar.
    const x2 = ( MeanShareAndBalanceConstants.CHOCOLATE_WIDTH / 4 ) * options.visiblePieces;
    const y2 = MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT;

    super( 0, 0, x2, y2, options );

    for ( let i = 1; i < options.visiblePieces; i++ ) {
      const xPosition = ( x2 / options.visiblePieces ) * i;
      const dividerLine = new Line( xPosition, 0, xPosition, y2,
        { stroke: MeanShareAndBalanceColors.chocolateHighlightColorProperty } );
      this.addChild( dividerLine );
    }
  }
}

meanShareAndBalance.register( 'ChocolateBarRectangle', ChocolateBarRectangle );