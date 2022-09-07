// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the intro screen that contains a checkbox group with visibility toggling for: predictMean, mean, and tickMarks
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { GridBox, GridBoxOptions, Text, VBox } from '../../../../scenery/js/imports.js';
import VerticalCheckboxGroup from '../../../../sun/js/VerticalCheckboxGroup.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ValveNode from './ValveNode.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

type IntroControlPanelOptions = StrictOmit<GridBoxOptions, 'children'> & PickRequired<GridBoxOptions, 'tandem'>;

export default class IntroControlPanel extends GridBox {
  public constructor( tickMarksVisibleProperty: Property<boolean>, meanVisibleProperty: Property<boolean>,
                      predictMeanVisibleProperty: Property<boolean>, cupWaterLevelVisibleProperty: Property<boolean>,
                      numberOfCupsProperty: Property<number>, arePipesOpenProperty: Property<boolean>, providedOptions: IntroControlPanelOptions ) {

    const options = providedOptions;

    // Checkbox Group
    const predictMeanText = new Text( MeanShareAndBalanceStrings.predictMeanStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );
    const meanText = new Text( MeanShareAndBalanceStrings.meanStringProperty, { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } );
    const tickMarksText = new Text( MeanShareAndBalanceStrings.tickMarksStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );
    const cupWaterLevel = new Text( MeanShareAndBalanceStrings.cupWaterLevelStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const introOptionsCheckboxGroupTandem = options.tandem.createTandem( 'introOptionsCheckboxGroup' );
    const introOptionsCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: predictMeanText,
        property: predictMeanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.predictMeanStringProperty },

        // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'predictMeanCheckbox' )
      }, {
        node: meanText,
        property: meanVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.meanStringProperty },

        // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'meanCheckbox' )
      }, {
        node: tickMarksText,
        property: tickMarksVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.tickMarksStringProperty },

        // phet-io
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'tickMarksCheckbox' )
      }, {
        node: cupWaterLevel,
        property: cupWaterLevelVisibleProperty,
        options: { accessibleName: MeanShareAndBalanceStrings.cupWaterLevelStringProperty },
        tandem: introOptionsCheckboxGroupTandem.createTandem( 'waterCupLevelCheckbox' )
      } ], {

        checkboxOptions: {
          boxWidth: 16
        },
        align: 'left',
        layoutOptions: { column: 0, row: 0, align: 'left' },
        tandem: introOptionsCheckboxGroupTandem
      }
    );

    // Pipe Switch
    const pipeSwitch = new ABSwitch( arePipesOpenProperty,
      false, new ValveNode( new Vector2( 0, 0 ), new Property( 0 ), options.tandem.createTandem( 'closedValveIcon' ) ),
      true, new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ), options.tandem.createTandem( 'openValveIcon' ) ), {
        toggleSwitchOptions: {
          size: new Dimension2( 40, 20 )
        },

        // phet-io
        tandem: options.tandem.createTandem( 'pipeSwitch' )
      } );

    const switchVBox = new VBox( {
      align: 'left',
      children: [ pipeSwitch ],
      layoutOptions: { column: 0, row: 1, minContentHeight: 140, yAlign: 'top' }
    } );

    // Number Spinner
    const numberOfCupsText = new Text( MeanShareAndBalanceStrings.numberOfCupsStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      numberOfCupsProperty,
      new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_RANGE ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: MeanShareAndBalanceStrings.numberOfCupsStringProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'numberSpinner' )
      }
    );

    const numberSpinnerVBox = new VBox( {
      children: [ numberOfCupsText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 0, row: 2 }
    } );


    const combinedOptions = combineOptions<GridBoxOptions>( { children: [ introOptionsCheckboxGroup, switchVBox, numberSpinnerVBox ] }, providedOptions );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'IntroControlPanel', IntroControlPanel );