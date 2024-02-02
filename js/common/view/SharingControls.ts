// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SyncButton from './SyncButton.js';
import LevelingOutModel from '../../leveling-out/model/LevelingOutModel.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, FireListener, Text, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import MeanAccordionBox, { MeanAccordionBoxOptions } from './MeanAccordionBox.js';

type SelfOptions = {
  meanAccordionBoxOptions: StrictOmit<MeanAccordionBoxOptions, 'tandem'>;
};
type LevelingOutControlPanelOptions = SelfOptions &
  StrictOmit<VBoxOptions, 'children' | 'align'> &
  PickRequired<VBoxOptions, 'tandem'>;

export default class SharingControls extends VBox {
  public constructor( model: Pick<LevelingOutModel,
                        'isMeanAccordionExpandedProperty' |
                        'numberOfPlatesRangeProperty' |
                        'numberOfPlatesProperty' |
                        'meanProperty' |
                        'syncData'>,
                      meanCalculationDialogVisibleProperty: Property<boolean>,
                      providedOptions: LevelingOutControlPanelOptions ) {

    const options = providedOptions;

    const meanAccordionBoxOptions = combineOptions<MeanAccordionBoxOptions>( providedOptions.meanAccordionBoxOptions,
      { tandem: options.tandem } );
    const meanAccordionBox = new MeanAccordionBox( model.meanProperty, meanCalculationDialogVisibleProperty,
      model.isMeanAccordionExpandedProperty, meanAccordionBoxOptions );

    const syncListener = new FireListener( {
      fire: () => model.syncData(),
      tandem: options.tandem.createTandem( 'syncListener' )
    } );

    const syncButton = new SyncButton( {
      inputListeners: [ syncListener ],
      tandem: options.tandem.createTandem( 'syncButton' )
    } );

    // LayoutOptions on the syncButton affect the content of the button, and not the layoutCell the button is in.
    // This seems like a bug: https://github.com/phetsims/sun/issues/871
    const buttonAlignBox = new AlignBox( syncButton, {
      layoutOptions: {
        minContentHeight: 100,
        align: 'left'
      }
    } );

    // Number Spinner
    const numberOfPeopleText = new Text( MeanShareAndBalanceStrings.numberOfPeopleStringProperty, {
      fontSize: 15,
      maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH
    } );

    const numberSpinner = new NumberSpinner(
      model.numberOfPlatesProperty,
      model.numberOfPlatesRangeProperty, {
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
      spacing: 10
    } );


    const superOptions = optionize<LevelingOutControlPanelOptions, SelfOptions, VBoxOptions>()( {
      children: [ meanAccordionBox, buttonAlignBox, numberSpinnerVBox ]
    }, providedOptions );

    super( superOptions );
  }
}

meanShareAndBalance.register( 'SharingControls', SharingControls );