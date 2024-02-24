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
import { optionize } from '../../../../phet-core/js/imports.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import { SoccerBallPhase } from '../../../../soccer-common/js/model/SoccerBallPhase.js';

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

  public constructor( calculationDependencies: ( Property<boolean> | Property<number> )[] |
                        ( Property<SoccerBallPhase> | Property<number | null> )[],
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

    const calculationNode = new GridBox( {
      margin: 10
    } );

    const alignedCalculationNode = new AlignBox( calculationNode, {

      // These bounds effectively set the size of the dialog and were empirically determined.
      alignBounds: notebookPaperBounds.dilatedXY( -40, -32 )
    } );

    // Monitor the number of active plates and snacks and update the equations as changes occur.
    Multilink.multilinkAny( [ ...calculationDependencies ], () => {

      // Assemble the various numbers needed to create the equations.
      const values = getValues();

      const numberOfActiveDataObjects = getNumberOfActiveDataObjects();
      const totalValues = _.sum( values );
      const mean = totalValues / numberOfActiveDataObjects;
      const meanWholePart = Math.floor( mean );
      const meanRemainder = totalValues - ( meanWholePart * numberOfActiveDataObjects );

      // Create the Node that shows a set of numbers being added together on top that correspond to the number of
      // snacks on top and the number of plates on the bottom.
      const additionText = new Text( values.join( ' + ' ), FRACTION_NUMBER_OPTIONS );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, {
        stroke: 'black',
        lineWidth: VINCULUM_LINE_WIDTH
      } );
      const additionDenominatorText = new Text( numberOfActiveDataObjects, FRACTION_NUMBER_OPTIONS );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      // Create the Node that shows the total number of snacks on top and the number of plates on the bottom.
      // const numeratorText = new Text( totalNumberOfSnacks, FRACTION_NUMBER_OPTIONS );
      // const fractionLine = new Line( 0, 0, numeratorText.width, 0, { stroke: 'black' } );
      // const denominatorText = new Text( numberOfActivePlates, FRACTION_NUMBER_OPTIONS );
      // const unreducedFraction = new VBox( { children: [ numeratorText, fractionLine, denominatorText ] } );
      const unreducedFraction = new MixedFractionNode( {
        numerator: totalValues,
        denominator: numberOfActiveDataObjects,
        fractionNumbersFont: FRACTION_NUMBER_FONT,
        vinculumLineWidth: VINCULUM_LINE_WIDTH
      } );

      let decimalOrUnreducedFraction;
      if ( options.calculatedMeanDisplayMode === 'decimal' ) {
        decimalOrUnreducedFraction = new Text( Utils.toFixedNumber( mean, 2 ), DECIMAL_NUMBER_OPTIONS );
      }
      else {
        decimalOrUnreducedFraction = new MixedFractionNode( {
          whole: meanWholePart > 0 ? meanWholePart : null,
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
        [ meanEqualsDecimalOrMixedFractionText, decimalOrUnreducedFraction ]
      ];
    } );

    super( alignedCalculationNode, options );
  }
}

meanShareAndBalance.register( 'MeanCalculationDialog', MeanCalculationDialog );