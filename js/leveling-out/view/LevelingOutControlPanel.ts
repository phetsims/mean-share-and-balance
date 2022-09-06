// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
import { FireListener, GridBox, GridBoxOptions, Image, Text, VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import SyncButton from '../../common/view/SyncButton.js';
import LevelingOutModel from '../model/LevelingOutModel.js';
import chocolateBar_png from '../../../images/chocolateBar_png.js';
import { Shape } from '../../../../kite/js/imports.js';

type IntroControlPanelOptions = StrictOmit<GridBoxOptions, 'children' | 'xAlign'> & PickRequired<GridBoxOptions, 'tandem'>;

export default class LevelingOutControlPanel extends GridBox {
  public constructor( model: Pick<LevelingOutModel, 'isMeanAccordionExpandedProperty' | 'numberOfPeopleProperty' | 'meanProperty' | 'syncData'>, providedOptions: IntroControlPanelOptions ) {

    const options = providedOptions;

    const meanNode = new VBox( {
      scale: 0.05,
      align: 'left',
      spacing: 1.5 / 0.05
    } );

    // Just for the dimensions
    const chocolateBarImage = new Image( chocolateBar_png );

    model.meanProperty.link( mean => {
      const wholePart = Math.floor( mean );
      const remainder = mean - wholePart;

      const children = _.times( wholePart, () => new Image( chocolateBar_png ) );
      children.unshift( new Image( chocolateBar_png, {
        clipArea: Shape.rect( 0, 0, remainder * chocolateBarImage.width, chocolateBarImage.height )
      } ) );
      meanNode.children = children;
    } );

    const meanAccordionBox = new AccordionBox( meanNode, {
      titleNode: new Text( 'Mean', { fontSize: 15, maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH } ),
      expandedProperty: model.isMeanAccordionExpandedProperty,
      layoutOptions: { minContentHeight: 200, yAlign: 'top' },

      // phet-io
      tandem: options.tandem.createTandem( 'meanAccordionBox' )
    } );

    const syncListener = new FireListener( { fire: () => model.syncData() } );

    const syncButton = new SyncButton( { inputListeners: [ syncListener ], tandem: options.tandem.createTandem( 'syncButton' ) } );

    const syncVBox = new VBox( {
        align: 'left', children: [ syncButton ],
        layoutOptions: { column: 0, row: 1, minContentHeight: 140, yAlign: 'top' }
      }
    );

    // Number Spinner
    const numberOfPeopleText = new Text( meanShareAndBalanceStrings.numberOfPeopleStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      model.numberOfPeopleProperty,
      new Property( MeanShareAndBalanceConstants.NUMBER_SPINNER_RANGE ),
      {
        arrowsPosition: 'leftRight',
        layoutOptions: {
          align: 'left'
        },
        accessibleName: meanShareAndBalanceStrings.numberOfCupsStringProperty,

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