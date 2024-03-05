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
import { AlignBox, GridBox, Line, Text, VBox } from '../../../../scenery/js/imports.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import MixedFractionNode from '../../../../scenery-phet/js/MixedFractionNode.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';

export type MeanDisplayType = 'decimal' | 'mixedFraction';

type SelfOptions = {

  // One of the items in this dialog can be displayed as either a decimal number or a mixed fraction, and this option
  // controls which.
  calculatedMeanDisplayMode?: MeanDisplayType;
};
export type MeanCalculationDialogOptions = SelfOptions & WithRequired<DialogOptions, 'tandem'>;

// constants
const LABEL_FONT = new PhetFont( 16 );
const LABEL_TEXT_OPTIONS = { font: LABEL_FONT };
const DECIMAL_NUMBER_OPTIONS = { font: new PhetFont( 16 ) };
const FRACTION_NUMBER_FONT = new PhetFont( 14 );
const FRACTION_NUMBER_OPTIONS = { font: FRACTION_NUMBER_FONT };
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
      calculatedMeanDisplayMode: 'decimal'
    }, providedOptions );

    const meanEqualsAdditionFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      LABEL_TEXT_OPTIONS
    );
    const meanEqualsUnreducedFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      LABEL_TEXT_OPTIONS
    );
    const meanEqualsDecimalOrMixedFractionText = new Text(
      MeanShareAndBalanceStrings.meanEqualsStringProperty,
      LABEL_TEXT_OPTIONS
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
      const additionText = new Text( values.join( ' + ' ), FRACTION_NUMBER_OPTIONS );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, {
        stroke: 'black',
        lineWidth: VINCULUM_LINE_WIDTH
      } );
      const additionDenominatorText = new Text( numberOfActiveDataObjects, FRACTION_NUMBER_OPTIONS );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      // Create the Node that shows the total value on top and the number of items to divide by on the bottom.
      const unreducedFraction = new MixedFractionNode( {
        numerator: totalValues,
        denominator: numberOfActiveDataObjects,
        fractionNumbersFont: FRACTION_NUMBER_FONT,
        vinculumLineWidth: VINCULUM_LINE_WIDTH
      } );

      let decimalOrMixedFraction;
      if ( options.calculatedMeanDisplayMode === 'decimal' ) {
        decimalOrMixedFraction = new Text( Utils.toFixedNumber( mean, 2 ), DECIMAL_NUMBER_OPTIONS );
      }
      else {
        decimalOrMixedFraction = new MixedFractionNode( {
          whole: ( meanWholePart > 0 || totalValues === 0 ) ? meanWholePart : null,
          numerator: meanRemainder > 0 ? meanRemainder : null,
          denominator: meanRemainder > 0 ? numberOfActiveDataObjects : null,
          wholeNumberFont: WHOLE_NUMBER_FONT,
          fractionNumbersFont: FRACTION_NUMBER_FONT,
          vinculumLineWidth: VINCULUM_LINE_WIDTH
        } );
      }

      calculationNode.rows = [
        [ meanEqualsAdditionFractionText, additionFraction ],
        [ meanEqualsUnreducedFractionText, unreducedFraction ],
        [ meanEqualsDecimalOrMixedFractionText, decimalOrMixedFraction ]
      ];
    } );

    super( alignedCalculationNode, options );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );