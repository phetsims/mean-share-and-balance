// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the Leveling Out screen that contains an accordion box, sync button, and number spinner.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import SyncButton from './SyncButton.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import { AlignBox, FireListener, VBox, VBoxOptions, Node } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import MeanAccordionBox, { MeanAccordionBoxOptions } from './MeanAccordionBox.js';
import SharingModel from '../model/SharingModel.js';
import Snack from '../model/Snack.js';
import NumberSpinnerVBox from './NumberSpinnerVBox.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';
import NumberSpinnerSoundPlayer from './NumberSpinnerSoundPlayer.js';
import plateNumberOfSelection_mp3 from '../../../sounds/plateNumberOfSelection_mp3.js';

type SelfOptions = {
  meanAccordionBoxOptions: StrictOmit<MeanAccordionBoxOptions, 'tandem'>;
  showSyncButton?: boolean;
};
type SharingControlsOptions = SelfOptions &
  StrictOmit<VBoxOptions, 'children' | 'align'> &
  PickRequired<VBoxOptions, 'tandem'>;

export default class SharingControls extends VBox {

  public readonly controlsPDOMOrder: Node[];

  public constructor( model: Pick<SharingModel<Snack>,
                        'isMeanAccordionExpandedProperty' |
                        'numberOfPlatesProperty' |
                        'totalSnacksProperty' |
                        'syncData'>,
                      meanCalculationDialogVisibleProperty: Property<boolean>,
                      providedOptions: SharingControlsOptions ) {

    const options = optionize<SharingControlsOptions, SelfOptions, VBoxOptions>()( {
      showSyncButton: true,
      excludeInvisibleChildrenFromBounds: false
    }, providedOptions );

    const meanAccordionBoxOptions = combineOptions<MeanAccordionBoxOptions>( providedOptions.meanAccordionBoxOptions,
      { tandem: options.tandem } );
    const meanAccordionBox = new MeanAccordionBox(
      model.totalSnacksProperty,
      model.numberOfPlatesProperty,
      meanCalculationDialogVisibleProperty,
      model.isMeanAccordionExpandedProperty,
      meanAccordionBoxOptions
    );

    const syncListener = new FireListener( {
      fire: () => model.syncData(),
      tandem: options.tandem.createTandem( 'syncListener' )
    } );

    const syncButton = new SyncButton( {
      inputListeners: [ syncListener ],
      touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      tandem: options.tandem.createTandem( 'syncButton' )
    } );

    // We need to wrap the syncButton in a Node so that it does not stretch to the minContentWidth of the VBox.
    // The align box gives us some added flexibility to adjust horizontal alignment of the sync button.
    const buttonAlignBox = new AlignBox( syncButton, {
      layoutOptions: {
        align: 'left'
      },
      visible: options.showSyncButton  // Fair Share Screen does not have a SyncButton
    } );

    // Number Spinner
    const numberSpinnerSoundPlayer = new NumberSpinnerSoundPlayer( model.numberOfPlatesProperty, plateNumberOfSelection_mp3 );
    const numberSpinnerVBox = new NumberSpinnerVBox(
      model.numberOfPlatesProperty,
      MeanShareAndBalanceConstants.NUMBER_SPINNER_CONTAINERS_RANGE,
      MeanShareAndBalanceStrings.numberOfPeopleStringProperty, {
        tandem: options.tandem,
        numberSpinnerOptions: {
          arrowsSoundPlayer: nullSoundPlayer
        }
      } );

    model.numberOfPlatesProperty.link( () => {
      numberSpinnerSoundPlayer.play();
    } );


    options.children = [ meanAccordionBox, buttonAlignBox, numberSpinnerVBox ];

    super( options );

    this.controlsPDOMOrder = [
      numberSpinnerVBox,
      meanAccordionBox,
      buttonAlignBox
    ];
  }
}

meanShareAndBalance.register( 'SharingControls', SharingControls );