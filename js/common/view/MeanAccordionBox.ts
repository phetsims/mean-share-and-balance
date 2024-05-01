// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars or apples that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { HBox, Image, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
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
import SnackStacker from '../SnackStacker.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import Multilink from '../../../../axon/js/Multilink.js';
import notepadPlateSketch_svg from '../../../images/notepadPlateSketch_svg.js';
import NotepadAppleNode from '../../fair-share/view/NotepadAppleNode.js';
import NotepadCandyBarNode from '../../distribute/view/NotepadCandyBarNode.js';

type SelfOptions = {
  snackType: SnackType;
};

export type MeanAccordionBoxOptions = SelfOptions & WithRequired<AccordionBoxOptions, 'tandem'>;

const ACCORDION_BOX_MARGIN = 8;

// just for the dimensions
const CANDY_BAR_BOUNDS = new Bounds2( 0, 0,
  MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT );

export default class MeanAccordionBox extends AccordionBox {

  public constructor( totalProperty: TReadOnlyProperty<number>,
                      divisorProperty: TReadOnlyProperty<number>,
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
        const remainderAsFraction = new Fraction( total - ( wholePart * divisor ), divisor );

        // Add the plate first, which is just a line.
        const plateNode = new Image( notepadPlateSketch_svg, {
          maxWidth: MeanShareAndBalanceConstants.PLATE_WIDTH
        } );
        meanSnacksGraphicNode.addChild( plateNode );

        // Create the Nodes representing the number of whole snacks.  The fractional part is handled later.
        _.times( wholePart, index => {
          let wholeSnackNode;
          if ( providedOptions.snackType === 'candyBars' ) {

            // Create the graphical representation of a candy bar.
            wholeSnackNode = new Rectangle( CANDY_BAR_BOUNDS, {
                fill: MeanShareAndBalanceColors.candyBarColorProperty,
                children: NotepadCandyBarNode.getSketchOutline()
              }
            );
          }
          else {

            // Create the graphical representation for a whole apple.
            wholeSnackNode = NotepadAppleNode.createIconNode();
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
              children: NotepadCandyBarNode.getSketchOutline(
                remainder * CANDY_BAR_BOUNDS.width,
                Utils.roundToInterval( 0.975 * remainder, 0.001 ) )
            } );
            partialSnackNode.addChild( partialCandyBar );
          }
          else {

            // Create a Node that represents a fraction of an apple.
            partialSnackNode = NotepadAppleNode.createIconNode( remainderAsFraction );
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

    const meanContentNode = new HBox( {
      children: [ meanSnacksGraphicNode ],
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

meanShareAndBalance.register( 'MeanAccordionBox', MeanAccordionBox );