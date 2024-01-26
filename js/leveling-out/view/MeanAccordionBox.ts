// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { HBox, Image, Text, VBox } from '../../../../scenery/js/imports.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import InfoBooleanStickyToggleButton from '../../common/view/InfoBooleanStickyToggleButton.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Property from '../../../../axon/js/Property.js';

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
      scale: SCALE_FACTOR,
      align: 'left',
      spacing: 1.5 / SCALE_FACTOR
    } );

    // Just for the dimensions
    const candyBarImage = new Image( chocolateBar_png );

    meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      const children = _.times( wholePart, () => new Image( chocolateBar_png ) );
      if ( remainder > 0 ) {

        // Partial candy bars are shown on top
        children.unshift( new Image( chocolateBar_png, {
          clipArea: Shape.rect( 0, 0, remainder * candyBarImage.width, candyBarImage.height )
        } ) );
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