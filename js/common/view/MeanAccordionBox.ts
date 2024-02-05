// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars or apples that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, HBox, Line, Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import InfoBooleanStickyToggleButton from './InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import { SnackType } from './SharingScreenView.js';
import { Shape } from '../../../../kite/js/imports.js';

type SelfOptions = {
  snackType: SnackType;
};

export type MeanAccordionBoxOptions = SelfOptions & WithRequired<AccordionBoxOptions, 'tandem'>;

const ACCORDION_BOX_MARGIN = 8;
const SPACE_BETWEEN_CANDY_BARS = 3; // in screen coords
const VERTICAL_SPACE_BETWEEN_APPLES = 4;
const APPLE_X_MARGIN = 3;

// Just for the dimensions
const CANDY_BAR_BOUNDS = new Bounds2( 0, 0,
  MeanShareAndBalanceConstants.CANDY_BAR_WIDTH,
  MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT );

const APPLE_RADIUS = 8; // TODO: This may want to move into constants to match notepad apples, https://github.com/phetsims/mean-share-and-balance/issues/149

export default class MeanAccordionBox extends AccordionBox {

  public constructor(
    meanProperty: TReadOnlyProperty<number>,
    meanCalculationDialogVisibleProperty: Property<boolean>,
    isMeanAccordionExpandedProperty: Property<boolean>,
    providedOptions: MeanAccordionBoxOptions ) {

    // parent node for the graphical representation of the mean
    const meanSnacksNode = new Node();

    meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      const children: Array<Node> = [];

      // Add the plate first, which is just a line.
      const plateNode = new Line( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, 0, {
        stroke: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_PATTERN,
        lineWidth: MeanShareAndBalanceConstants.NOTEPAD_PLATE_LINE_WIDTH
      } );
      children.push( plateNode );

      if ( providedOptions.snackType === 'candyBars' ) {

        // Create a stack of rectangles representing the whole parts of the candy bars.
        _.times( wholePart, index => {
          children.push( new Rectangle( CANDY_BAR_BOUNDS, {
            fill: MeanShareAndBalanceColors.candyBarColorProperty,
            stroke: 'black',
            x: 0,
            bottom: -( SPACE_BETWEEN_CANDY_BARS + index * ( CANDY_BAR_BOUNDS.height + SPACE_BETWEEN_CANDY_BARS ) )
          } ) );
        } );
      }
      else {
        _.times( wholePart, index => {
          children.push( new Circle( APPLE_RADIUS, {
            fill: MeanShareAndBalanceColors.appleColorProperty,
            stroke: 'black',
            x: index % 2 === 0 ?
               plateNode.x + APPLE_RADIUS + APPLE_X_MARGIN :
               plateNode.right - APPLE_RADIUS - APPLE_X_MARGIN,
            bottom: -Math.floor( index / 2 ) * ( APPLE_RADIUS * 2 + VERTICAL_SPACE_BETWEEN_APPLES ) -
                    VERTICAL_SPACE_BETWEEN_APPLES
          } ) );
        } );
      }

      if ( remainder > 0 ) {
        if ( providedOptions.snackType === 'candyBars' ) {
          const xPosition = 0;
          const partialCandyBar = new Rectangle( CANDY_BAR_BOUNDS.dilated( -0.75 ), {
            cornerRadius: 1,
            stroke: MeanShareAndBalanceColors.candyBarColorProperty,
            lineDash: [ 1, 2 ],
            x: xPosition
          } );
          const clippedCandyBar = new Rectangle( 0, 0, remainder * CANDY_BAR_BOUNDS.width, CANDY_BAR_BOUNDS.height, {
            fill: MeanShareAndBalanceColors.candyBarColorProperty,
            stroke: 'black'
          } );
          partialCandyBar.addChild( clippedCandyBar );
          partialCandyBar.bottom = -wholePart * ( CANDY_BAR_BOUNDS.height + SPACE_BETWEEN_CANDY_BARS ) -
                                   SPACE_BETWEEN_CANDY_BARS;
          children.push( partialCandyBar );
        }
        else {

          // Create a node that represents a fraction of an apple.
          const partialApple = new Circle( APPLE_RADIUS, {
            stroke: 'black',
            lineDash: [ 1, 2 ],
            x: wholePart % 2 === 0 ?
               plateNode.x + APPLE_RADIUS + APPLE_X_MARGIN :
               plateNode.right - APPLE_RADIUS - APPLE_X_MARGIN,
            bottom: -Math.floor( wholePart / 2 ) * ( APPLE_RADIUS * 2 + VERTICAL_SPACE_BETWEEN_APPLES ) -
                    VERTICAL_SPACE_BETWEEN_APPLES
          } );
          const partialAppleFractionalPiece = new Path( createFractionalCircleShape( APPLE_RADIUS, remainder ), {
            stroke: 'black',
            fill: MeanShareAndBalanceColors.appleColorProperty
          } );
          partialApple.addChild( partialAppleFractionalPiece );
          children.push( partialApple );
        }
      }

      const meanReadout = new Text( Utils.toFixed( mean, 1 ), {
        font: new PhetFont( 14 ),
        centerX: plateNode.centerX,
        bottom: children[ children.length - 1 ].top
      } );
      children.push( meanReadout );

      meanSnacksNode.children = children;
    } );

    const infoButton = new InfoBooleanStickyToggleButton( meanCalculationDialogVisibleProperty, providedOptions.tandem );

    const meanNode = new HBox( {
      children: [ meanSnacksNode, infoButton ],
      align: 'bottom',
      justify: 'spaceEvenly',
      spacing: 25
    } );

    super( meanNode, {
      titleNode: new Text( MeanShareAndBalanceStrings.meanStringProperty, {
        font: new PhetFont( { weight: 'bold', size: 16 } ),
        maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
      } ),
      titleAlignX: 'left',
      expandedProperty: isMeanAccordionExpandedProperty,
      contentVerticalAlign: 'bottom',
      layoutOptions: {
        minContentHeight: 215
      },
      buttonXMargin: ACCORDION_BOX_MARGIN,
      buttonYMargin: ACCORDION_BOX_MARGIN,
      contentYMargin: ACCORDION_BOX_MARGIN,

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'meanAccordionBox' )
    } );
  }
}

/**
 * Helper function to produce a pie-chart-ish shape representing a fractional amount.
 */
const createFractionalCircleShape = ( radius: number, fractionalAmount: number ): Shape => {
  assert && assert( radius > 0, 'radius must be greater than zero' );
  assert && assert( fractionalAmount > 0 && fractionalAmount < 1, 'fractionalAmount must be between 0 and 1' );
  return new Shape()
    .moveTo( 0, 0 )
    .lineTo( radius, 0 )
    .arc( 0, 0, radius, 0, fractionalAmount * 2 * Math.PI )
    .lineTo( 0, 0 );
};

meanShareAndBalance.register( 'MeanAccordionBox', MeanAccordionBox );