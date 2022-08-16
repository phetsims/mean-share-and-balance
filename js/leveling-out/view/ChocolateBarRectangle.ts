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
    const outerOffset = MeanShareAndBalanceConstants.CHOCOLATE_WIDTH / 25;
    const innerOffset = outerOffset * 2;

    super( 0, 0, x2, y2, options );

    const createChocolateEdge = ( xPosition: number ): Shape => {
      const innerSquare = Shape.roundRect( xPosition + innerOffset, innerOffset, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - innerOffset * 2, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - innerOffset * 2, 3, 3 );
      const outerSquare = Shape.roundRect( xPosition + outerOffset, outerOffset, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - innerOffset, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - innerOffset, 5, 5 );
      const chocolateEdges = outerSquare.shapeDifference( innerSquare );
      const clippingTriangle = new Shape().moveTo( xPosition + outerOffset, outerOffset )
      .lineTo( xPosition + ( MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT / 2 ), MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT / 2 )
      .lineTo( xPosition + outerOffset, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT - outerOffset )
      .close();

      return chocolateEdges.shapeIntersection( clippingTriangle );
    };

    for ( let i = 0; i < options.visiblePieces; i++ ) {
      const xPosition = ( ( x2 - outerOffset ) / options.visiblePieces ) * i;

      const chocolateHighlightLeft = new Path( createChocolateEdge( xPosition ), {
        fill: '#8C603D'
      } );
      const chocolateHighlightRight = new Path( createChocolateEdge( xPosition ), {
        fill: '#8C603D',
        rotation: Math.PI / 2
      } );
      
      this.addChild( chocolateHighlightLeft );
      this.addChild( chocolateHighlightRight );
    }
  }
}

meanShareAndBalance.register( 'ChocolateBarRectangle', ChocolateBarRectangle );