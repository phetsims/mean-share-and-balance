// Copyright 2022-2025, University of Colorado Boulder

/**
 * A custom non-modal info panel that pops up in front of the notepadNode.
 * The panel shows different mathematical representations of the mean according to the sim's current data.
 *
 * @deprecated - PhET needs a non-modal dialog, see https://github.com/phetsims/sun/issues/916
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Utils from '../../../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Fraction from '../../../../phetcommon/js/model/Fraction.js';
import CloseButton from '../../../../scenery-phet/js/buttons/CloseButton.js';
import MixedFractionNode from '../../../../scenery-phet/js/MixedFractionNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import AlignBox from '../../../../scenery/js/layout/nodes/AlignBox.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import sharedSoundPlayers from '../../../../tambo/js/sharedSoundPlayers.js';
import { MeanWithRemainder } from '../../distribute/model/DistributeModel.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

export type MeanDisplayType = 'decimal' | 'mixedFraction' | 'remainder';

type SelfOptions = {

  // One of the items in this dialog can be displayed as either a remainder, decimal number, and/or mixed fraction.
  // This option controls which.
  calculatedMeanDisplayMode?: MeanDisplayType;

  // If the data set is empty, this message will be displayed instead of the calculations.
  zeroDataMessageProperty?: TReadOnlyProperty<string> | null;
  meanWithRemainderProperty?: TReadOnlyProperty<MeanWithRemainder> | null;
};
export type MeanInfoPanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

// constants
const TEXT_MAX_WIDTH = 300;
const LABEL_FONT = new PhetFont( 16 );
const LABEL_TEXT_OPTIONS = { font: LABEL_FONT, maxWidth: TEXT_MAX_WIDTH };
const FRACTION_NUMBER_FONT = new PhetFont( 14 );
const NUMBER_FONT = new PhetFont( 16 );
const VINCULUM_LINE_WIDTH = 1;
const DIALOG_MAX_WIDTH_MARGIN = 50;

export default class MeanInfoPanel extends Panel {

  // The button that closes this panel, public for focus management.
  public readonly closeButton: ButtonNode;

  /**
   * @param calculationDependencies - A set of Properties that are monitored to cause the dialog to update.
   * @param meanValueProperty - A Property that tracks the mean value of the data set.
   * @param getValues - A function that returns the set of values used to calculate the mean.
   * @param getNumberOfActiveDataObjects - A function to get the number of items to divide by, i.e. the denominator for
   *                                       the calculations.
   * @param visibleProperty
   * @param notebookPaperBounds
   * @param focusInfoButton - callback for focus management that will put focus on the info button that opens this panel
   * @param providedOptions
   */
  public constructor( calculationDependencies: Readonly<TReadOnlyProperty<unknown>[]>,
                      meanValueProperty: TReadOnlyProperty<number | null>,
                      getValues: () => number[],
                      getNumberOfActiveDataObjects: () => number,
                      visibleProperty: Property<boolean>,
                      notebookPaperBounds: Bounds2,
                      focusInfoButton: () => void,
                      providedOptions: MeanInfoPanelOptions ) {

    const meanTitleText = new Text( MeanShareAndBalanceStrings.meanStringProperty, {
      font: new PhetFont( 20 ),
      maxWidth: notebookPaperBounds.width - DIALOG_MAX_WIDTH_MARGIN
    } );

    const closeButton = new CloseButton( {
      listener: () => {
        visibleProperty.set( false );
        focusInfoButton();
      },
      baseColor: 'transparent',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      pathOptions: {
        stroke: 'black'
      },

      // phet-io
      tandem: providedOptions.tandem.createTandem( 'closeButton' ),
      phetioState: false
    } );

    const options = optionize<MeanInfoPanelOptions, SelfOptions, PanelOptions>()( {
      visibleProperty: visibleProperty,
      resize: false,
      calculatedMeanDisplayMode: 'decimal',
      zeroDataMessageProperty: null,
      isDisposable: false,
      meanWithRemainderProperty: null
    }, providedOptions );

    if ( options.calculatedMeanDisplayMode === 'remainder' ) {
      assert && assert( options.meanWithRemainderProperty !== null,
        'If calculatedMeanDisplayMode is "remainder" then we must provide a meanWithRemainderProperty.' );
    }

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

    // Create the pattern string Properties.
    let remainderPatternStringProperty: TReadOnlyProperty<string> | null = null;
    if ( options.calculatedMeanDisplayMode === 'remainder' ) {
      const wholeNumberProperty = new DerivedProperty( [ options.meanWithRemainderProperty! ], meanWithRemainder =>
        meanWithRemainder.wholeNumber );
      const remainderNumberProperty = new DerivedProperty( [ options.meanWithRemainderProperty! ], meanWithRemainder =>
        meanWithRemainder.remainder );
      remainderPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.remainderPatternStringProperty, {
        wholeNumber: wholeNumberProperty,
        remainder: remainderNumberProperty
      } );
    }

    // Update the equal sign based on whether the mean is an integer or not.
    const equalSignProperty = new DerivedProperty( [ meanValueProperty ], ( meanValue: number | null ) =>

      // If the mean value does not exist we do not care which sign is chosen since
      // the visibility of the text will be false.
      meanValue && Utils.toFixedNumber( meanValue, 4 ) === Utils.toFixedNumber( meanValue, 1 ) ? '=' : '≈' );

    const decimalTextPatternStringProperty = new PatternStringProperty(
      MeanShareAndBalanceStrings.meanEqualSignPatternStringProperty,
      {
        equals: equalSignProperty
      }
    );

    let valueRepresentation: Node | null = null;
    let decimalRepresentationText: Node | null = null;
    let decimalRepresentation: Node | null = null;

    // Monitor the dependencies and update the equations as changes occur.
    Multilink.multilinkAny( [ ...calculationDependencies ], () => {

      valueRepresentation?.dispose();
      valueRepresentation = null;
      decimalRepresentationText?.dispose();
      decimalRepresentationText = null;
      decimalRepresentation?.dispose();
      decimalRepresentation = null;

      // We do not need to calculate anything if no data points are active.
      if ( meanValueProperty.value === null ) {
        return;
      }

      // Assemble the various numbers needed to create the equations.
      const values = getValues();

      const numberOfActiveDataObjects = getNumberOfActiveDataObjects();
      const totalValues = _.sum( values );
      const mean = meanValueProperty.value;

      // Not all the screens that have a MeanInfoPanel have a meanWithRemainderProperty, so we calculate
      // the meanWholePart and meanRemainder manually here.
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

        decimalRepresentationText = new Text( decimalTextPatternStringProperty,
          calculationsTextOptions );
        const decimalOptions = {
          font: NUMBER_FONT
        };
        decimalRepresentation = new Text( Utils.toFixedNumber( mean, 1 ), decimalOptions );
      }
      else if ( options.calculatedMeanDisplayMode === 'remainder' ) {
        assert && assert( remainderPatternStringProperty,
          'If the calculatedMeanDisplayMode is "remainder" the remainderPatternStringProperty must exist.' );
        valueRepresentation = new Text( remainderPatternStringProperty!, {
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

    // A global keyboard shortcut that closes the panel with the 'escape' key.
    KeyboardListener.createGlobal( this, {
      keyStringProperties: MeanInfoPanel.ESCAPE_HOTKEY_DATA.keyStringProperties,
      fire: () => {

        // If the closeButton is focused, return focus to the info button - otherwise we don't want to move focus
        // because the user could be interacting with things outside the dialog.
        if ( closeButton.focused ) {
          focusInfoButton();
        }
        sharedSoundPlayers.get( 'generalClose' ).play();
        visibleProperty.value = false;
      }
    } );
  }

  public static readonly ESCAPE_HOTKEY_DATA = new HotkeyData( {
    keys: [ 'escape' ],
    binderName: 'Close info panel',
    repoName: meanShareAndBalance.name,
    global: true
  } );
}

meanShareAndBalance.register( 'MeanInfoPanel', MeanInfoPanel );