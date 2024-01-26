// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { HBox, Image, Rectangle, Text, VBox, Node } from '../../../../scenery/js/imports.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import InfoBooleanStickyToggleButton from '../../common/view/InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';

type MeanAccordionBoxOptions = WithRequired<AccordionBoxOptions, 'tandem'>;

export default class MeanAccordionBox extends AccordionBox {

  public constructor(
    meanProperty: TReadOnlyProperty<number>,
    meanCalculationDialogVisibleProperty: Property<boolean>,
    isMeanAccordionExpandedProperty: Property<boolean>,
    providedOptions: MeanAccordionBoxOptions ) {

    // Scale down the large candy bar images
    const SCALE_FACTOR = 0.05;

    const meanCandyBarsVBox = new VBox( {
      align: 'left',
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

      meanCandyBarsVBox.children = children;
    } );

    const infoButton = new InfoBooleanStickyToggleButton( meanCalculationDialogVisibleProperty, providedOptions.tandem );

    const meanNode = new HBox( { children: [ meanCandyBarsVBox, infoButton ], spacing: 40, align: 'bottom' } );

    super( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: isMeanAccordionExpandedProperty,
      contentVerticalAlign: 'bottom',
      layoutOptions: {
        minContentHeight: 200
      },

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'meanAccordionBox' )
    } );
  }
}

meanShareAndBalance.register( 'MeanAccordionBox', MeanAccordionBox );