// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { HBox, Image, Line, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import InfoBooleanStickyToggleButton from '../../common/view/InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import Utils from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

type MeanAccordionBoxOptions = WithRequired<AccordionBoxOptions, 'tandem'>;

const ACCORDION_BOX_MARGIN = 8;

export default class MeanAccordionBox extends AccordionBox {

  public constructor(
    meanProperty: TReadOnlyProperty<number>,
    meanCalculationDialogVisibleProperty: Property<boolean>,
    isMeanAccordionExpandedProperty: Property<boolean>,
    providedOptions: MeanAccordionBoxOptions ) {

    // Scale down the large candy bar images
    const SCALE_FACTOR = 0.05;

    const meanCandyBarsVBox = new VBox( {
      align: 'center',
      spacing: 1
    } );

    // Just for the dimensions
    const scaledCandyBarImageBounds = new Image( chocolateBar_png, {
      scale: SCALE_FACTOR
    } ).bounds;
    const candyBarImageBounds = new Image( chocolateBar_png ).bounds;

    meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      const children: Array<Node> = _.times( wholePart, () => new Image( chocolateBar_png, {
        scale: SCALE_FACTOR
      } ) );

      const plate = new Line( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, 0, {
        stroke: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN,
        lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_WIDTH,
        layoutOptions: {
          margin: 2
        }
      } );
      children.push( plate );

      if ( remainder > 0 ) {

        const partialCandyBar = new Rectangle( scaledCandyBarImageBounds.dilated( -0.75 ), {
          cornerRadius: 1,
          stroke: MeanShareAndBalanceColors.candyBarColorProperty,
          lineDash: [ 1, 2 ]
        } );
        const clippedCandyBarImage = new Image( chocolateBar_png, {
          clipArea: Shape.rect( 0, 0, remainder * candyBarImageBounds.width, candyBarImageBounds.height ),
          scale: SCALE_FACTOR
        } );
        partialCandyBar.addChild( clippedCandyBarImage );

        // Partial candy bars are shown on top
        children.unshift( partialCandyBar );
      }

      const meanReadout = new Text( Utils.toFixed( mean, 1 ), {
        font: new PhetFont( 14 )
      } );

      // The mean readout should be seen on top of all the candy bars.
      children.unshift( meanReadout );

      meanCandyBarsVBox.children = children;
    } );

    const infoButton = new InfoBooleanStickyToggleButton( meanCalculationDialogVisibleProperty, providedOptions.tandem );

    const meanNode = new HBox( {
      children: [ meanCandyBarsVBox, infoButton ],
      align: 'bottom',
      justify: 'spaceEvenly',
      spacing: 25
    } );

    super( meanNode, {
      titleNode: new Text( 'Mean', {
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

meanShareAndBalance.register( 'MeanAccordionBox', MeanAccordionBox );