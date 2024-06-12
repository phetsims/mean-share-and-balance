// Copyright 2022-2024, University of Colorado Boulder

/**
 * A custom non-modal info panel that pops up in front of the notepadNode.
 * The panel shows different mathematical representations of the mean according to the sim's current data.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, GridBox, Line, Node, Text, TextOptions, VBox } from '../../../../scenery/js/imports.js';
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
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import CloseButton from '../../../../scenery-phet/js/buttons/CloseButton.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import generalCloseSoundPlayer from '../../../../tambo/js/shared-sound-players/generalCloseSoundPlayer.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';

export type MeanDisplayType = 'decimal' | 'mixedFraction' | 'remainder';

type SelfOptions = {

  // One of the items in this dialog can be displayed as either a remainder, decimal number, and/or mixed fraction.
  // This option controls which.
  calculatedMeanDisplayMode?: MeanDisplayType;
  zeroDataMessageProperty?: LocalizedStringProperty | null;
};
export type MeanCalculationPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

// constants
const TEXT_MAX_WIDTH = 300;
const LABEL_FONT = new PhetFont( 16 );
const LABEL_TEXT_OPTIONS = { font: LABEL_FONT, maxWidth: TEXT_MAX_WIDTH };
const FRACTION_NUMBER_FONT = new PhetFont( 14 );
const NUMBER_FONT = new PhetFont( 16 );
const VINCULUM_LINE_WIDTH = 1;
const DIALOG_MAX_WIDTH_MARGIN = 50;

export default class MeanCalculationPanel extends Panel {

  // The button that closes this panel, public for focus management.
  public readonly closeButton: ButtonNode;

  /**
   * @param calculationDependencies - A set of Properties that are monitored to cause the dialog to update.
   * @param getValues - A function that returns the set of values used to calculate the mean.
   * @param getNumberOfActiveDataObjects - A function to get the number of items to divide by, i.e. the denominator for
   *                                       the calculations.
   * @param visibleProperty
   * @param notebookPaperBounds
   * @param onCloseButtonPressed - callback for when the close button is pressed
   * @param providedOptions
   */
  public constructor( calculationDependencies: Readonly<TReadOnlyProperty<unknown>[]>,
                      getValues: () => number[],
                      getNumberOfActiveDataObjects: () => number,
                      visibleProperty: Property<boolean>,
                      notebookPaperBounds: Bounds2,
                      onCloseButtonPressed: () => void,
                      providedOptions: MeanCalculationPanelOptions ) {

    const meanTitleText = new Text( MeanShareAndBalanceStrings.meanStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: notebookPaperBounds.width - DIALOG_MAX_WIDTH_MARGIN
    } );

    const closeButton = new CloseButton( {
      listener: () => {
        visibleProperty.set( false );
        onCloseButtonPressed();
      },
      baseColor: 'transparent',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      soundPlayer: generalCloseSoundPlayer,
      pathOptions: {
        stroke: 'black'
      },

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'closeButton' ),
      phetioState: false
    } );

    const options = optionize<MeanCalculationPanelOptions, SelfOptions, PanelOptions>()( {
      visibleProperty: visibleProperty,
      resize: false,
      calculatedMeanDisplayMode: 'decimal',
      zeroDataMessageProperty: null,
      isDisposable: false
    }, providedOptions );

    const calculationsVisibleProperty = DerivedProperty.deriveAny( [ ...calculationDependencies ], () => {
      return getNumberOfActiveDataObjects() > 0;
    } );


    const calculationsTextOptions = combineOptions<TextOptions>( {
      visibleProperty: calculationsVisibleProperty
    }, LABEL_TEXT_OPTIONS );


    const equalsPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.meanEqualSignPatternStringProperty, {
      equals: '='
    } );
    const meanEqualsAdditionFractionText = new Text(
      equalsPatternStringProperty,
      calculationsTextOptions
    );
    const meanEqualsUnreducedFractionText = new Text(
      equalsPatternStringProperty,
      calculationsTextOptions
    );
    const meanEqualsMixedFractionOrRemainderText = new Text(
      equalsPatternStringProperty,
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

    // These bounds effectively set the size of the dialog and were empirically determined.
    const alignBounds = notebookPaperBounds.dilatedXY( -5, -5 );
    const panelMargin = 10;
    const titleAlignBox = new AlignBox( meanTitleText, {
      alignBounds: alignBounds,
      xAlign: 'left',
      yAlign: 'top',
      margin: panelMargin
    } );
    const closeButtonAlignBox = new AlignBox( closeButton, {
      alignBounds: alignBounds,
      xAlign: 'right',
      yAlign: 'top',
      margin: panelMargin
    } );

    const calculationNode = new GridBox( {
      margin: panelMargin,
      minContentHeight: minContentHeight
    } );

    // If a zeroDataMessageProperty is provided create a ToggleNode that will display information based on how many
    // active data points there are.
    let alignBoxNode: Node = calculationNode;
    if ( options.zeroDataMessageProperty !== null ) {
      const messageOptions = combineOptions<TextOptions>( LABEL_TEXT_OPTIONS,
        { maxWidth: notebookPaperBounds.width - DIALOG_MAX_WIDTH_MARGIN } );
      const zeroDataMessageText = new Text( options.zeroDataMessageProperty, messageOptions );

      alignBoxNode = new ToggleNode<boolean, Node>( calculationsVisibleProperty, [
        {
          value: true,
          createNode: () => calculationNode
        },
        {
          value: false,
          createNode: () => zeroDataMessageText
        }
      ], { alignChildren: ToggleNode.NONE, excludeInvisibleChildrenFromBounds: true } );
    }

    const alignedCalculationNode = new AlignBox( alignBoxNode, {
      alignBounds: alignBounds
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
        font: FRACTION_NUMBER_FONT
      };
      const additionText = new Text( values.join( ' + ' ), fractionNumberOptions );
      const additionFractionLine = new Line( 0, 0, additionText.width, 0, {
        stroke: 'black',
        lineWidth: VINCULUM_LINE_WIDTH
      } );
      const additionDenominatorText = new Text( numberOfActiveDataObjects, fractionNumberOptions );
      const additionFraction = new VBox( { children: [ additionText, additionFractionLine, additionDenominatorText ] } );

      // Create the Node that shows the total value on top and the number of items to divide by on the bottom.
      const unreducedFraction = new MixedFractionNode( {
        numerator: totalValues,
        denominator: numberOfActiveDataObjects,
        fractionNumbersFont: FRACTION_NUMBER_FONT,
        vinculumLineWidth: VINCULUM_LINE_WIDTH
      } );

      // The value can be represented as either a decimal & mixed fraction, mixed fraction,
      // or a whole number with a remainder.
      let valueRepresentation: Node | null = null;
      let decimalRepresentationText: Node | null = null;
      let decimalRepresentation: Node | null = null;
      if ( options.calculatedMeanDisplayMode === 'decimal' || options.calculatedMeanDisplayMode === 'mixedFraction' ) {

        // Calculate the fractional portion, if present.
        let fraction;
        if ( meanRemainder > 0 ) {
          fraction = new Fraction( meanRemainder, numberOfActiveDataObjects );
          fraction.reduce();
        }

        // Create a node that represents the mean as a mixed fraction.
        valueRepresentation = new MixedFractionNode( {
          whole: ( meanWholePart > 0 || totalValues === 0 ) ? meanWholePart : null,
          numerator: fraction ? fraction.numerator : null,
          denominator: fraction ? fraction.denominator : null,
          wholeNumberFont: NUMBER_FONT,
          fractionNumbersFont: FRACTION_NUMBER_FONT,
          vinculumLineWidth: VINCULUM_LINE_WIDTH
        } );

        // Update the equal sign based on whether the mean is an integer or not.
        const equalSign = mean > Math.floor( mean ) ? '≈' : '=';
        const decimalTextPatternStringProperty = new PatternStringProperty(
          MeanShareAndBalanceStrings.meanEqualSignPatternStringProperty,
          {
            equals: equalSign
          }
        );
        decimalRepresentationText = new Text( decimalTextPatternStringProperty,
          calculationsTextOptions );
        const decimalOptions = {
          font: NUMBER_FONT
        };
        decimalRepresentation = new Text( Utils.toFixedNumber( mean, 1 ), decimalOptions );


      }
      else if ( options.calculatedMeanDisplayMode === 'remainder' ) {
        const wholeNumber = Math.floor( mean );
        const patternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.remainderPatternStringProperty, {
          wholeNumber: wholeNumber,
          remainder: meanRemainder
        } );
        valueRepresentation = new Text( patternStringProperty, {
          font: NUMBER_FONT,
          maxWidth: TEXT_MAX_WIDTH
        } );
      }

      calculationNode.rows = [
        [ meanEqualsAdditionFractionText, additionFraction ],
        [ meanEqualsUnreducedFractionText, unreducedFraction ],
        [ meanEqualsMixedFractionOrRemainderText, valueRepresentation ],
        options.calculatedMeanDisplayMode === 'decimal' ?
          [ decimalRepresentationText, decimalRepresentation ] : []
      ];
    } );

    const content = new Node( { children: [ titleAlignBox, closeButtonAlignBox, alignedCalculationNode ] } );

    super( content, options );

    this.closeButton = closeButton;
  }
}

meanShareAndBalance.register( 'MeanCalculationPanel', MeanCalculationPanel );