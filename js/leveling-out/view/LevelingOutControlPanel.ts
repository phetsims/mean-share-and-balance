// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import SyncButton from '../../common/view/SyncButton.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import { Shape } from '../../../../kite/js/imports.js';
import InfoBooleanStickyToggleButton from '../../common/view/InfoBooleanStickyToggleButton.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { GridBox, FireListener, Image, Text, GridBoxOptions, VBox } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;
type LevelingOutControlPanelOptions = SelfOptions & StrictOmit<GridBoxOptions, 'children' | 'xAlign'> & PickRequired<GridBoxOptions, 'tandem'>;

export default class LevelingOutControlPanel extends GridBox {
  public constructor( model: Pick<LevelingOutModel, 'isMeanAccordionExpandedProperty' | 'numberOfPeopleRangeProperty' | 'numberOfPeopleProperty' | 'meanProperty' | 'syncData'>,
                      meanCalculationDialogVisibleProperty: Property<boolean>, providedOptions: LevelingOutControlPanelOptions ) {

    const options = providedOptions;

    // Scale down the large chocolate images
    const SCALE_FACTOR = 0.05;

    const meanChocolateBarsNode = new VBox( {
      scale: SCALE_FACTOR,
      align: 'left',
      spacing: 1.5 / SCALE_FACTOR,
      layoutOptions: {
        yAlign: 'top'
      }
    } );

    // Just for the dimensions
    const chocolateBarImage = new Image( chocolateBar_png );

    model.meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      const children = _.times( wholePart, () => new Image( chocolateBar_png ) );
      if ( remainder > 0 ) {

        // Partial chocolate bars are shown on top
        children.unshift( new Image( chocolateBar_png, {
          clipArea: Shape.rect( 0, 0, remainder * chocolateBarImage.width, chocolateBarImage.height )
        } ) );
      }

      meanChocolateBarsNode.children = children;
    } );

    const infoButton = new InfoBooleanStickyToggleButton( meanCalculationDialogVisibleProperty, options.tandem );

    const meanNode = new GridBox( { columns: [ [ meanChocolateBarsNode ], [ infoButton ] ], yAlign: 'top', spacing: 40 } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: model.isMeanAccordionExpandedProperty,
      layoutOptions: { minContentHeight: 200, yAlign: 'top' },

      // phet-io
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const syncListener = new FireListener( { fire: () => model.syncData(), tandem: options.tandem.createTandem( 'syncListener' ) } );

    const syncButton = new SyncButton( { inputListeners: [ syncListener ], tandem: options.tandem.createTandem( 'syncButton' ) } );

    // REVIEW: How could we do this with putting this metadata on the SyncButton itself? May need to ask @jonathanolson
    const syncVBox = new VBox( {
        align: 'left', children: [ syncButton ],
        layoutOptions: { row: 1, minContentHeight: 38, yAlign: 'top' }
      }
    );

    // Number Spinner
    const numberOfPeopleText = new Text( MeanShareAndBalanceStrings.numberOfPeopleStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      model.numberOfPeopleProperty,
      model.numberOfPeopleRangeProperty, {
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
      children: [ numberOfPeopleText, numberSpinner ],
      align: 'left',
      justify: 'bottom',
      spacing: 10,
      layoutOptions: { row: 2 }
    } );

    const superOptions = optionize<LevelingOutControlPanelOptions, SelfOptions, GridBoxOptions>()( {
      children: [ meanAccordionBox, syncVBox, numberSpinnerVBox ], xAlign: 'left'
    }, providedOptions );

    super( superOptions );
  }
}

meanShareAndBalance.register( 'LevelingOutControlPanel', LevelingOutControlPanel );