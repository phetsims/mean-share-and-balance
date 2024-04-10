// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import SyncButton from './SyncButton.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, FireListener, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import MeanAccordionBox, { MeanAccordionBoxOptions } from './MeanAccordionBox.js';
import SharingModel from '../model/SharingModel.js';
import Snack from '../model/Snack.js';
import MeanShareAndBalanceControls, { MeanShareAndBalanceControlsOptions } from './MeanShareAndBalanceControls.js';

type SelfOptions = {
  meanAccordionBoxOptions: StrictOmit<MeanAccordionBoxOptions, 'tandem'>;
  showSyncButton?: boolean;
  vBoxOptions?: StrictOmit<VBoxOptions, 'children' | 'align'>;
};
type SharingControlsOptions = SelfOptions & StrictOmit<MeanShareAndBalanceControlsOptions, 'controlsPDOMOrder'>;

export default class SharingControls extends MeanShareAndBalanceControls {

  public constructor( model: Pick<SharingModel<Snack>,
                        'isMeanAccordionExpandedProperty' |
                        'numberOfPlatesProperty' |
                        'totalSnacksProperty' |
                        'syncData'>,
                      meanCalculationDialogVisibleProperty: Property<boolean>,
                      providedOptions: SharingControlsOptions ) {

    const meanAccordionBoxOptions = combineOptions<MeanAccordionBoxOptions>( providedOptions.meanAccordionBoxOptions,
      { tandem: providedOptions.tandem } );
    const meanAccordionBox = new MeanAccordionBox(
      model.totalSnacksProperty,
      model.numberOfPlatesProperty,
      meanCalculationDialogVisibleProperty,
      model.isMeanAccordionExpandedProperty,
      meanAccordionBoxOptions
    );

    const syncListener = new FireListener( {
      fire: () => model.syncData(),
      tandem: providedOptions.tandem.createTandem( 'syncListener' )
    } );

    const syncButton = new SyncButton( {
      inputListeners: [ syncListener ],
      touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      tandem: providedOptions.tandem.createTandem( 'syncButton' )
    } );

    // We need to wrap the syncButton in a Node so that it does not stretch to the minContentWidth of the VBox.
    // The align box gives us some added flexibility to adjust horizontal alignment of the sync button.
    const buttonAlignBox = new AlignBox( syncButton, {
      layoutOptions: {
        align: 'left'
      },
      visible: providedOptions.showSyncButton  // Fair Share Screen does not have a SyncButton
    } );

    // Number Spinner
    // const numberSpinnerSoundPlayer = new NumberSpinnerSoundPlayer( model.numberOfPlatesProperty, plateNumberOfSelection_mp3 );
    // model.numberOfPlatesProperty.link( () => {
    //   numberSpinnerSoundPlayer.play();
    // } );

    const options = optionize<SharingControlsOptions, SelfOptions, MeanShareAndBalanceControlsOptions>()( {
      showSyncButton: true,
      excludeInvisibleChildrenFromBounds: false,
      vBoxOptions: {},
      controlsPDOMOrder: [ meanAccordionBox, buttonAlignBox ]
    }, providedOptions );

    const combinedOptions = combineOptions<VBoxOptions>( {
      children: [ meanAccordionBox, buttonAlignBox ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    }, options.vBoxOptions );
    const vBox = new VBox( combinedOptions );

    super( vBox, model.numberOfPlatesProperty, MeanShareAndBalanceStrings.numberOfPeopleStringProperty, options );
  }
}

meanShareAndBalance.register( 'SharingControls', SharingControls );