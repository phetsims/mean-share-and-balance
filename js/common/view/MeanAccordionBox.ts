// Copyright 2024, University of Colorado Boulder
/**
 * Accordion box that shows the amount of candy bars or apples that make up the mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { Circle, HBox, Line, Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
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

type SelfOptions = {
  snackType: 'candyBars' | 'apples';
};

export type MeanAccordionBoxOptions = SelfOptions & WithRequired<AccordionBoxOptions, 'tandem'>;

const ACCORDION_BOX_MARGIN = 8;

// Just for the dimensions
const CANDY_BAR_BOUNDS = new Bounds2( 0, 0,
  MeanShareAndBalanceConstants.CANDY_BAR_WIDTH,
  MeanShareAndBalanceConstants.CANDY_BAR_HEIGHT );

const APPLE_DIAMETER = 20;

export default class MeanAccordionBox extends AccordionBox {

  public constructor(
    meanProperty: TReadOnlyProperty<number>,
    meanCalculationDialogVisibleProperty: Property<boolean>,
    isMeanAccordionExpandedProperty: Property<boolean>,
    providedOptions: MeanAccordionBoxOptions ) {

    const meanCandyBarsVBox = new VBox( {
      align: 'center',
      spacing: 1
    } );

    meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      let children: Array<Node> = [];
      if ( providedOptions.snackType === 'candyBars' ) {
        children = _.times( wholePart, () => new Rectangle( CANDY_BAR_BOUNDS, {
          fill: MeanShareAndBalanceColors.candyBarColorProperty,
          stroke: 'black'
        } ) );
      }
      else {
        children = _.times( wholePart, () => new Circle( APPLE_DIAMETER, {
          fill: MeanShareAndBalanceColors.appleColorProperty,
          stroke: 'black'
        } ) );
      }


      const plate = new Line( 0, 0, MeanShareAndBalanceConstants.CANDY_BAR_WIDTH, 0, {
        stroke: MeanShareAndBalanceConstants.NOTEPAD_LINE_PATTERN,
        lineWidth: MeanShareAndBalanceConstants.NOTEPAD_LINE_WIDTH,
        layoutOptions: {
          margin: 2
        }
      } );
      children.push( plate );

      if ( remainder > 0 ) {
        if ( providedOptions.snackType === 'candyBars' ) {
          const partialCandyBar = new Rectangle( CANDY_BAR_BOUNDS.dilated( -0.75 ), {
            cornerRadius: 1,
            stroke: MeanShareAndBalanceColors.candyBarColorProperty,
            lineDash: [ 1, 2 ]
          } );
          const clippedCandyBar = new Rectangle( 0, 0, remainder * CANDY_BAR_BOUNDS.width, CANDY_BAR_BOUNDS.height, {
            fill: MeanShareAndBalanceColors.candyBarColorProperty,
            stroke: 'black'
          } );
          partialCandyBar.addChild( clippedCandyBar );

          // Partial candy bars are shown on top
          children.unshift( partialCandyBar );
        }
        else {
          // TODO: draw circle with pie cut out, see: https://github.com/phetsims/mean-share-and-balance/issues/149
          const partialApple = new Circle( APPLE_DIAMETER, {
            stroke: 'black'
          } );
          children.unshift( partialApple );
        }

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

meanShareAndBalance.register( 'MeanAccordionBox', MeanAccordionBox );