// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { GridBox, GridBoxOptions, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import MeanShareAndBalanceColors from '../../common/MeanShareAndBalanceColors.js';
import SyncButton from '../../common/view/SyncButton.js';

type IntroControlPanelOptions = StrictOmit<GridBoxOptions, 'children'> & PickRequired<GridBoxOptions, 'tandem'>;

export default class LevelingOutControlPanel extends GridBox {
  public constructor( isMeanAccordionExpandedProperty: Property<boolean>, numberOfPeopleProperty: Property<number>, providedOptions: IntroControlPanelOptions ) {

    const options = providedOptions;

    const meanNode = new Rectangle( 0, 0, MeanShareAndBalanceConstants.CHOCOLATE_WIDTH, MeanShareAndBalanceConstants.CHOCOLATE_HEIGHT,
      { fill: MeanShareAndBalanceColors.chocolateColorProperty } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: isMeanAccordionExpandedProperty,

      // phet-io
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const syncButton = new SyncButton( { tandem: options.tandem.createTandem( 'syncButton' ) } );

    const syncVBox = new VBox( { align: 'left', children: [ syncButton ],
      layoutOptions: { column: 0, row: 1, minContentHeight: 140, yAlign: 'top' } }
    );

    // Number Spinner
    const numberOfPeopleText = new Text( meanShareAndBalanceStrings.numberOfPeopleProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      numberOfPeopleProperty,
      new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_RANGE ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: meanShareAndBalanceStrings.numberOfCupsProperty,

        // phet-io
        tandem: options.tandem.createTandem( 'numberSpinner' )
      }
    );

    const numberSpinnerVBox = new VBox( {
      children: [ numberOfPeopleText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { column: 0, row: 2 }
    } );


    const combinedOptions = combineOptions<GridBoxOptions>( { children: [ meanAccordionBox, syncVBox, numberSpinnerVBox ], xAlign: 'left' }, providedOptions );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'LevelingOutControlPanel', LevelingOutControlPanel );