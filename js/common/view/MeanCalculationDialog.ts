// Copyright 2022-2024, University of Colorado Boulder

/**
 * A dialog that shows different mathematical representations of the mean according to the sim's current data.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import Dialog, { DialogOptions } from '../../../../sun/js/Dialog.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, GridBox, Line, Text, TextOptions, VBox, Node } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MixedFractionNode from '../../../../scenery-phet/js/MixedFractionNode.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';

export type MeanDisplayType = 'decimal' | 'mixedFraction';

type SelfOptions = {

  // One of the items in this dialog can be displayed as either a decimal number or a mixed fraction, and this option
  // controls which.
  calculatedMeanDisplayMode?: MeanDisplayType;
  zeroDataMessageProperty?: LocalizedStringProperty | null;
};
export type MeanCalculationDialogOptions = SelfOptions & WithRequired<DialogOptions, 'tandem'>;

// constants
const LABEL_FONT = new PhetFont( 16 );
const LABEL_TEXT_OPTIONS = { font: LABEL_FONT };
const DECIMAL_FONT = new PhetFont( 16 );
const FRACTION_NUMBER_FONT = new PhetFont( 14 );
const WHOLE_NUMBER_FONT = new PhetFont( 18 );
const VINCULUM_LINE_WIDTH = 1;

export default class MeanCalculationDialog extends Dialog {

  /**
   * @param calculationDependencies - A set of Properties that are monitored to cause the dialog to update.
   * @param getValues - A function that returns the set of values used to calculate the mean.
   * @param getNumberOfActiveDataObjects - A function to get the number of items to divide by, i.e. the denominator for
   *                                       the calculations.
   * @param visibleProperty
   * @param notebookPaperBounds
   * @param providedOptions
   */
  public constructor( calculationDependencies: Readonly<TReadOnlyProperty<unknown>[]>,
                      getValues: () => number[],
                      getNumberOfActiveDataObjects: () => number,
                      visibleProperty: Property<boolean>,
                      notebookPaperBounds: Bounds2,
                      providedOptions: MeanCalculationDialogOptions ) {

    const meanTitleText = new Text( MeanShareAndBalanceStrings.meanStringProperty, {
      font: new PhetFont( 20 )
    } );

    const options = optionize<MeanCalculationDialogOptions, SelfOptions, DialogOptions>()( {
      title: meanTitleText,
      titleAlign: 'left',
      visibleProperty: visibleProperty,
      resize: false,
      closeButtonListener: () => this.visibleProperty.set( false ),
      layoutStrategy: _.noop,
      calculatedMeanDisplayMode: 'decimal',
      zeroDataMessageProperty: null,
      closeButtonTouchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      closeButtonTouchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION
    }, providedOptions );

    const messageVisibleProperty = DerivedProperty.deriveAny( [ ...calculationDependencies ], () => {
      return getNumberOfActiveDataObjects() === 0;
    } );

    const calculationsVisibleProperty = DerivedProperty.not( messageVisibleProperty );

    const calculationsTextOptions = combineOptions<TextOptions>( LABEL_TEXT_OPTIONS, {
      visibleProperty: calculationsVisibleProperty
    } );
    const meanEqualsAdditionFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      calculationsTextOptions
    );
    const meanEqualsUnreducedFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      calculationsTextOptions
    );
    const meanEqualsDecimalOrMixedFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      calculationsTextOptions
    );

    // Set a min content height when using mixed fractions, otherwise the grid layout can jump around when switching
    // between whole and mixed numbers;
    let minContentHeight = 0;
    if ( options.calculatedMeanDisplayMode === 'mixedFraction' ) {

      // Create a dummy mixed number from which to derive the min content height.
      const unreducedFraction = new MixedFractionNode( {
        numerator: 9,
        denominator: 10,
        fractionNumbersFont: FRACTION_NUMBER_FONT,
        vinculumLineWidth: VINCULUM_LINE_WIDTH
      } );
      minContentHeight = unreducedFraction.bounds.height;
    }

    const calculationNode = new GridBox( {
      margin: 10,
      minContentHeight: minContentHeight
    } );

    let zeroDataMessageText: Node | null;
    if ( options.zeroDataMessageProperty !== null ) {
      const messageOptions = combineOptions<TextOptions>( LABEL_TEXT_OPTIONS,
        { visibleProperty: messageVisibleProperty } );
      zeroDataMessageText = new Text( options.zeroDataMessageProperty, messageOptions );
    }

    const alignedCalculationNode = new AlignBox( calculationNode, {

      // These bounds effectively set the size of the dialog and were empirically determined.
      alignBounds: notebookPaperBounds.dilatedXY( -40, -32 )
    } );

    // Monitor the dependencies and update the equations as changes occur.
    Multilink.multilinkAny( [ ...calculationDependencies ], () => {

      // Assemble the various numbers needed to create the equations.
      const values = getValues();

      const numberOfActiveDataObjects = getNumberOfActiveDataObjects();
      const totalValues = _.sum( values );
      const mean = totalValues / numberOfActiveDataObjects;
      const meanWholePart = Math.floor( mean );
      const meanRemainder = totalValues - ( meanWholePart * numberOfActiveDataObjects );

      // Create the Node that shows a set of numbers being added together on top and the number of items to divide by
      // on the bottom.
      const fractionNumberOptions = {
        font: FRACTION_NUMBER_FONT,
        visibleProperty: calculationsVisibleProperty
      };
      const additionText = new Text( values.join( ' + ' ), fractionNumberOptions );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, {
        stroke: 'black',
        lineWidth: VINCULUM_LINE_WIDTH,
        visibleProperty: calculationsVisibleProperty
      } );
      const additionDenominatorText = new Text( numberOfActiveDataObjects, fractionNumberOptions );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      // Create the Node that shows the total value on top and the number of items to divide by on the bottom.
      const unreducedFraction = new MixedFractionNode( {
        numerator: totalValues,
        denominator: numberOfActiveDataObjects,
        fractionNumbersFont: FRACTION_NUMBER_FONT,
        vinculumLineWidth: VINCULUM_LINE_WIDTH,
        visibleProperty: calculationsVisibleProperty
      } );

      let decimalOrMixedFraction;
      if ( options.calculatedMeanDisplayMode === 'decimal' ) {
        const decimalOptions = {
          font: DECIMAL_FONT,
          visibleProperty: calculationsVisibleProperty
        };
        decimalOrMixedFraction = new Text( Utils.toFixedNumber( mean, 1 ), decimalOptions );
      }
      else {

        // Calculate the fractional portion, if present.
        let fraction;
        if ( meanRemainder > 0 ) {
          fraction = new Fraction( meanRemainder, numberOfActiveDataObjects );
          fraction.reduce();
        }

        // Create a node that represents the mean as a mixed fraction.
        decimalOrMixedFraction = new MixedFractionNode( {
          whole: ( meanWholePart > 0 || totalValues === 0 ) ? meanWholePart : null,
          numerator: fraction ? fraction.numerator : null,
          denominator: fraction ? fraction.denominator : null,
          wholeNumberFont: WHOLE_NUMBER_FONT,
          fractionNumbersFont: FRACTION_NUMBER_FONT,
          vinculumLineWidth: VINCULUM_LINE_WIDTH,
          visibleProperty: calculationsVisibleProperty
        } );
      }

      calculationNode.rows = [
        [ meanEqualsAdditionFractionText, additionFraction ],
        [ meanEqualsUnreducedFractionText, unreducedFraction ],
        [ meanEqualsDecimalOrMixedFractionText, decimalOrMixedFraction ],
        zeroDataMessageText ? [ zeroDataMessageText ] : []
      ];
    } );

    super( alignedCalculationNode, options );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );