// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Path, Rectangle, RectangleOptions } from '../../../../scenery/js/imports.js';
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
      stroke: 'black',
      lineWidth: 2,
      cornerRadius: 4
    }, providedOptions );


    // When a fraction of the chocolate bar needs to be represented x2 will change to reflect
    // the new width of the partial chocolate bar.
    const x2 = ( MeanShareAndBalanceConstants.CHOCOLATE_WIDTH / 4 ) * options.visiblePieces;
    const y2 = MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT;

    super( 0, 0, x2, y2, options );

    const createChocolateEdge = ( xPosition: number ): Shape => {
      const innerSquare = Shape.rectangle( xPosition + 5, 10, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 20, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 20 );
      const outerSquare = Shape.rectangle( xPosition, 5, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 10, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 10 );
      return outerSquare.shapeDifference( innerSquare );
    };

    for ( let i = 0; i < options.visiblePieces; i++ ) {
      const xPosition = ( ( x2 - 5 ) / options.visiblePieces ) * i;

      const chocolateHighlight = new Path( createChocolateEdge( xPosition + 5 ), {
        fill: '#8C603D'
      } );

      const innerChocolateSquare = new Rectangle( xPosition + 10, 10, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 20, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - 20, {
        fill: MeanShareAndBalanceColors.chocolateColorProperty,
        cornerRadius: 4
      } );

      this.addChild( innerChocolateSquare );
      this.addChild( chocolateHighlight );
    }
  }
}

meanShareAndBalance.register( 'ChocolateBarRectangle', ChocolateBarRectangle );