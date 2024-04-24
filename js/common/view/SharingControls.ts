// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the Distribute screen that contains an accordion box, sync button, and number spinner.
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
import { AlignBox, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import SharingModel from '../model/SharingModel.js';
import Snack from '../model/Snack.js';
import MeanShareAndBalanceControls, { MeanShareAndBalanceControlsOptions } from './MeanShareAndBalanceControls.js';
import MeanShareAndBalanceCheckboxGroup from './MeanShareAndBalanceCheckboxGroup.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import erase_mp3 from '../../../../scenery-phet/sounds/erase_mp3.js';

type SelfOptions = {
  showSyncButton?: boolean;
  predictMeanVisibleProperty?: Property<boolean> | null;
  vBoxOptions?: StrictOmit<VBoxOptions, 'children' | 'align'>;
};
type SharingControlsOptions = SelfOptions & StrictOmit<MeanShareAndBalanceControlsOptions, 'controlsPDOMOrder'>;

export default class SharingControls extends MeanShareAndBalanceControls {

  public constructor( model: Pick<SharingModel<Snack>,
                        'numberOfPlatesProperty' |
                        'totalVisibleProperty' |
                        'syncData'>,
                      meanCalculationDialogVisibleProperty: Property<boolean>,
                      providedOptions: SharingControlsOptions ) {

    const options = optionize<SharingControlsOptions, SelfOptions,
      StrictOmit<MeanShareAndBalanceControlsOptions, 'controlsPDOMOrder'>>()( {
      showSyncButton: true,
      excludeInvisibleChildrenFromBounds: false,
      vBoxOptions: {},
      predictMeanVisibleProperty: null,
      dialogVisibleProperty: meanCalculationDialogVisibleProperty
    }, providedOptions );

    const checkboxGroup = new MeanShareAndBalanceCheckboxGroup( {
      totalVisibleProperty: model.totalVisibleProperty,
      predictMeanVisibleProperty: options.predictMeanVisibleProperty,
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );

    const syncButton = new SyncButton( {
      listener: () => model.syncData(),
      touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
      soundPlayer: new SoundClipPlayer( erase_mp3, {
        soundClipOptions: { initialOutputLevel: 0.22 }
      } ),
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

    const vBoxOptions = combineOptions<VBoxOptions>( {
      children: [ checkboxGroup, buttonAlignBox ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    }, options.vBoxOptions );
    const vBox = new VBox( vBoxOptions );

    const superOptions = combineOptions<MeanShareAndBalanceControlsOptions>( {
      controlsPDOMOrder: [ checkboxGroup, buttonAlignBox ]
    }, options );

    super( vBox, model.numberOfPlatesProperty, MeanShareAndBalanceStrings.numberOfPeopleStringProperty, superOptions );
  }
}

meanShareAndBalance.register( 'SharingControls', SharingControls );