// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the Sharing screens that contains an accordion box, sync button, and number spinner.
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
import { AlignBox, PDOMValueType, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import Property from '../../../../axon/js/Property.js';
import SharingModel from '../model/SharingModel.js';
import Snack from '../model/Snack.js';
import MeanShareAndBalanceControls, { MeanShareAndBalanceControlsOptions } from './MeanShareAndBalanceControls.js';
import MeanShareAndBalanceCheckboxGroup from './MeanShareAndBalanceCheckboxGroup.js';
import SoundClipPlayer from '../../../../tambo/js/sound-generators/SoundClipPlayer.js';
import erase_mp3 from '../../../../scenery-phet/sounds/erase_mp3.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberSpinnerSoundPlayer from './NumberSpinnerSoundPlayer.js';
import numberOfPlatesV6_mp3 from '../../../sounds/numberOfPlatesV6_mp3.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';


type SelfOptions = {
  showSyncButton?: boolean;

  // When the predictMeanVisibleProperty is provided the predict mean tool can be toggled on and off.
  predictMeanVisibleProperty?: Property<boolean> | null;
  vBoxOptions?: StrictOmit<VBoxOptions, 'children' | 'align'>;
  snackAccessibleName: PDOMValueType;
};
type SharingControlsOptions = SelfOptions & StrictOmit<MeanShareAndBalanceControlsOptions,
  'controlsPDOMOrder' | 'numberSpinnerOptions'>;

export default class SharingControls extends MeanShareAndBalanceControls {

  public constructor( model: Pick<SharingModel<Snack>,
                        'numberOfPlatesProperty' |
                        'numberOfPlatesRangeProperty' |
                        'totalVisibleProperty' |
                        'syncData' | 'activePlatesInSyncProperty'>,
                      meanInfoPanelVisibleProperty: Property<boolean>,
                      notepadNodeBottom: number,
                      providedOptions: SharingControlsOptions ) {

    const options = optionize<SharingControlsOptions, SelfOptions,
      StrictOmit<MeanShareAndBalanceControlsOptions, 'controlsPDOMOrder'>>()( {
      showSyncButton: true,
      vBoxOptions: {},
      predictMeanVisibleProperty: null,
      infoPanelVisibleProperty: meanInfoPanelVisibleProperty,
      numberSpinnerOptions: {
        arrowsSoundPlayer: new NumberSpinnerSoundPlayer(
          model.numberOfPlatesProperty,
          numberOfPlatesV6_mp3,
          { initialOutputLevel: 0.15 }
        )
      }
    }, providedOptions );

    const totalPatternStringProperty = new PatternStringProperty( MeanShareAndBalanceStrings.a11y.totalNumberPatternStringProperty, {
      snack: options.snackAccessibleName
    } );
    const checkboxGroup = new MeanShareAndBalanceCheckboxGroup( {
      totalCheckboxItemOptions: {
        property: model.totalVisibleProperty,
        options: { accessibleName: totalPatternStringProperty }
      },
      predictMeanVisibleProperty: options.predictMeanVisibleProperty,
      tandem: options.tandem.createTandem( 'checkboxGroup' )
    } );

    let buttonAlignBox;
    if ( options.showSyncButton ) {
      const syncButton = new SyncButton( {
        listener: () => model.syncData(),
        enabledProperty: DerivedProperty.not( model.activePlatesInSyncProperty ),
        touchAreaXDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
        touchAreaYDilation: MeanShareAndBalanceConstants.TOUCH_AREA_DILATION,
        soundPlayer: new SoundClipPlayer( erase_mp3, {
          soundClipOptions: { initialOutputLevel: 0.22 }
        } ),
        tandem: options.tandem.createTandem( 'syncButton' )
      } );

      // We need to wrap the syncButton in a Node so that it does not stretch to the minContentWidth of the VBox.
      // The align box gives us some added flexibility to adjust horizontal alignment of the sync button.
      buttonAlignBox = new AlignBox( syncButton, {
        layoutOptions: {
          align: 'left'
        },
        visible: options.showSyncButton  // Fair Share Screen does not have a SyncButton
      } );
    }


    const vBoxOptions = combineOptions<VBoxOptions>( {
      children: [ checkboxGroup, ...( buttonAlignBox ? [ buttonAlignBox ] : [] ) ],
      minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
      spacing: 20
    }, options.vBoxOptions );
    const vBox = new VBox( vBoxOptions );

    const superOptions = combineOptions<MeanShareAndBalanceControlsOptions>( {
      controlsPDOMOrder: [ checkboxGroup, ...( buttonAlignBox ? [ buttonAlignBox ] : [] ) ]
    }, options );

    super( vBox, model.numberOfPlatesProperty, model.numberOfPlatesRangeProperty,
      MeanShareAndBalanceStrings.numberOfPeopleStringProperty, notepadNodeBottom, superOptions );
  }
}

meanShareAndBalance.register( 'SharingControls', SharingControls );