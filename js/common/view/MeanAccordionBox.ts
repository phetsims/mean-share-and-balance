// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars or apples that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, HBox, Image, Node, Path, Rectangle, Text } from '../../../../scenery/js/imports.js';
import InfoBooleanStickyToggleButton from './InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceColors from '../MeanShareAndBalanceColors.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MixedFractionNode from '../../../../scenery-phet/js/MixedFractionNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import { SnackType } from './SharingScreenView.js';
import { Shape } from '../../../../kite/js/imports.js';
import SnackStacker from '../SnackStacker.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import LevelingOutModel from '../../leveling-out/model/LevelingOutModel.js';
import Plate from '../model/Plate.js';
import Multilink from '../../../../axon/js/Multilink.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';

type SelfOptions = {
  snackType: SnackType;
};

export type MeanAccordionBoxOptions = SelfOptions & WithRequired<AccordionBoxOptions, 'tandem'>;

const ACCORDION_BOX_MARGIN = 8;

// just for the dimensions
const CANDY_BAR_BOUNDS = new Bounds2( 0, 0, LevelingOutModel.CANDY_BAR_WIDTH, LevelingOutModel.CANDY_BAR_HEIGHT );

export default class MeanAccordionBox extends AccordionBox {

  public constructor( totalProperty: TReadOnlyProperty<number>,
                      divisorProperty: TReadOnlyProperty<number>,
                      meanCalculationDialogVisibleProperty: Property<boolean>,
                      isMeanAccordionExpandedProperty: Property<boolean>,
                      providedOptions: MeanAccordionBoxOptions ) {

    // Parent node for the graphical representation of the mean, which includes a plate, a graphical representation of
    // the whole and partial snacks, and a label.
    const meanSnacksGraphicNode = new Node();

    // Update the graphic when changes occur to the numeric values.
    Multilink.multilink(
      [ totalProperty, divisorProperty ],
      ( total, divisor ) => {
        meanSnacksGraphicNode.removeAllChildren();
        const mean = total / divisor;
        const wholePart = Math.floor( total / divisor );
        const remainder = mean - wholePart;

        // Add the plate first, which is just a line.
        const plateNode = new Image( notepadPlateSketch_svg, {
          maxWidth: Plate.WIDTH
        } );
        meanSnacksGraphicNode.addChild( plateNode );

        // Create the Nodes representing the number of whole snacks.  The fractional part is handled later.
        _.times( wholePart, index => {
          let wholeSnackNode;
          if ( providedOptions.snackType === 'candyBars' ) {

            // Create the graphical representation of a candy bar.
            wholeSnackNode = new Rectangle( CANDY_BAR_BOUNDS, {
                fill: MeanShareAndBalanceColors.candyBarColorProperty,
                stroke: 'black'
              }
            );
          }
          else {

            // Create the graphical representation for an apple.
            wholeSnackNode = new Circle( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, {
              fill: MeanShareAndBalanceColors.appleColorProperty,
              stroke: 'black'
            } );
          }

          // Position the Node so that it appears to be stacked on a plate.
          SnackStacker.setSnackGraphicPosition( wholeSnackNode, providedOptions.snackType, index );

          meanSnacksGraphicNode.addChild( wholeSnackNode );
        } );

        // If there is a fractional portion, add a graphical representation for it.
        if ( remainder > 0 ) {

          let partialSnackNode;
          if ( providedOptions.snackType === 'candyBars' ) {

            // Add a dotted outline that is the size of a full candy bar graphic.
            partialSnackNode = new Rectangle( CANDY_BAR_BOUNDS.dilated( -0.75 ), {
              cornerRadius: 1,
              stroke: MeanShareAndBalanceColors.candyBarColorProperty,
              lineDash: [ 1, 2 ]
            } );

            // Add a partial candy bar that represents a fractional amount.
            const partialCandyBar = new Rectangle( 0, 0, remainder * CANDY_BAR_BOUNDS.width, CANDY_BAR_BOUNDS.height, {
              fill: MeanShareAndBalanceColors.candyBarColorProperty,
              stroke: 'black'
            } );
            partialSnackNode.addChild( partialCandyBar );
          }
          else {

            // Create a Node that represents a fraction of an apple.
            partialSnackNode = new Circle( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, {
              stroke: 'black',
              lineDash: [ 1, 2 ]
            } );
            const partialAppleFractionalPiece =
              new Path( createFractionalCircleShape( MeanShareAndBalanceConstants.APPLE_GRAPHIC_RADIUS, remainder ), {
                stroke: 'black',
                fill: MeanShareAndBalanceColors.appleColorProperty
              } );
            partialSnackNode.addChild( partialAppleFractionalPiece );
          }

          // Position the resulting node.
          SnackStacker.setSnackGraphicPosition( partialSnackNode, providedOptions.snackType, wholePart );
          meanSnacksGraphicNode.addChild( partialSnackNode );
        }

        let meanReadout;
        if ( providedOptions.snackType === 'candyBars' ) {

          // Use a decimal number for the candy bars.
          meanReadout = new Text( Utils.toFixed( mean, 1 ), {
            font: new PhetFont( 18 ),
            centerX: plateNode.centerX,
            bottom: -meanSnacksGraphicNode.height
          } );
        }
        else {

          // Use a fraction for the apples.
          const remainderAsFraction = new Fraction( total - ( wholePart * divisor ), divisor );
          remainderAsFraction.reduce();
          meanReadout = new MixedFractionNode( {
            whole: wholePart > 0 || total === 0 ? wholePart : null,
            numerator: remainder > 0 ? remainderAsFraction.numerator : null,
            denominator: remainder > 0 ? remainderAsFraction.denominator : null,
            wholeNumberFont: new PhetFont( 24 ),
            fractionNumbersFont: new PhetFont( 14 ),
            vinculumLineWidth: 1,
            centerX: plateNode.centerX,
            bottom: -meanSnacksGraphicNode.height
          } );
        }
        meanSnacksGraphicNode.addChild( meanReadout );
      }
    );

    const infoButton = new InfoBooleanStickyToggleButton( meanCalculationDialogVisibleProperty, providedOptions.tandem );

    const meanContentNode = new HBox( {
      children: [ meanSnacksGraphicNode, infoButton ],
      align: 'bottom',
      justify: 'spaceEvenly',
      spacing: 25
    } );

    super( meanContentNode, {
      titleNode: new Text( MeanShareAndBalanceStrings.meanStringProperty, {
        font: new PhetFont( { weight: 'bold', size: 16 } ),
        maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
      } ),
      titleAlignX: 'left',
      expandedProperty: isMeanAccordionExpandedProperty,
      contentVerticalAlign: 'bottom',
      layoutOptions: {
        minContentHeight: 225 // empirically determined
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