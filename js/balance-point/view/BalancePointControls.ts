// Copyright 2024, University of Colorado Boulder
/**
 * The BalancePointControls is a VBox that lays out and renders the various controls needed for the
 * BalancePointScreen.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { VBox } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import BalancePointModel from '../model/BalancePointModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import MovableFulcrumIcon from './MovableFulcrumIcon.js';
import FixedFulcrumIcon from './FixedFulcrumIcon.js';
import MeanShareAndBalanceControls, { MeanShareAndBalanceControlsOptions } from '../../common/view/MeanShareAndBalanceControls.js';
import MeanShareAndBalanceCheckboxGroup from '../../common/view/MeanShareAndBalanceCheckboxGroup.js';
import TSoundPlayer from '../../../../tambo/js/TSoundPlayer.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import release_mp3 from '../../../../tambo/sounds/release_mp3.js';
import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';

type SelfOptions = EmptySelfOptions;
type BalancePointControlsOptions = SelfOptions & StrictOmit<MeanShareAndBalanceControlsOptions,
  'controlsPDOMOrder' | 'numberSpinnerOptions'>;

export default class BalancePointControls extends MeanShareAndBalanceControls {

  public constructor( model: BalancePointModel, providedOptions: BalancePointControlsOptions ) {

    const meanFulcrumRadioButtonGroup = new RectangularRadioButtonGroup( model.meanFulcrumFixedProperty, [
      {
        createNode: () => new MovableFulcrumIcon(),
        value: false,
        tandemName: 'movableMeanFulcrumRadioButton'
      },
      {
        createNode: () => new FixedFulcrumIcon(),
        value: true,
        tandemName: 'fixedMeanFulcrumRadioButton'
      }
    ], {
      tandem: providedOptions.tandem.createTandem( 'meanFulcrumRadioButtonGroup' ),
      orientation: 'horizontal',
      radioButtonOptions: {
        baseColor: 'white'
      }
    } );

    const checkboxGroup = new MeanShareAndBalanceCheckboxGroup( {
      tickMarksVisibleProperty: model.tickMarksVisibleProperty,
      totalVisibleProperty: model.totalVisibleProperty,
      checkboxOptions: MeanShareAndBalanceConstants.CHECKBOX_OPTIONS,
      tandem: providedOptions.tandem.createTandem( 'checkboxGroup' )
    } );

    const vBox = new VBox( {
      children: [
        meanFulcrumRadioButtonGroup,
        checkboxGroup
      ],
      spacing: 20,
      align: 'left',
      preferredWidth: MeanShareAndBalanceConstants.CONTROLS_PREFERRED_WIDTH
    } );

    const numberOfDataPointsProperty = model.selectedSceneModelProperty.value.targetNumberOfBallsProperty;
    const options = optionize<BalancePointControlsOptions, SelfOptions, MeanShareAndBalanceControlsOptions>()( {
      controlsPDOMOrder: [ meanFulcrumRadioButtonGroup, checkboxGroup ],
      numberSpinnerOptions: {
        arrowsSoundPlayer: new NumberSpinnerSoundPlayer( numberOfDataPointsProperty ),
        tandem: providedOptions.tandem.createTandem( 'numberOfBallsSpinner' )
      },
      infoPanelVisibleProperty: model.meanInfoPanelVisibleProperty
    }, providedOptions );
    super( vBox, numberOfDataPointsProperty, BalancePointModel.numberOfKicksRangeProperty, MeanShareAndBalanceStrings.numberOfBallsStringProperty, options );
  }
}

class NumberSpinnerSoundPlayer implements TSoundPlayer {
  private previousValue: number;
  private currentValue: number;

  private readonly decrementSoundClip = new SoundClip( release_mp3, { initialOutputLevel: 0.2 } );

  public constructor( numberOfDataPointsProperty: TReadOnlyProperty<number> ) {
    this.previousValue = numberOfDataPointsProperty.value;
    this.currentValue = numberOfDataPointsProperty.value;

    numberOfDataPointsProperty.lazyLink( ( newValue, oldValue ) => {
      this.previousValue = oldValue;
      this.currentValue = newValue;
    } );

    soundManager.addSoundGenerator( this.decrementSoundClip );
  }

  public play(): void {

    // We only want to play a sound when the value is decreasing. When the value is increasing the ball kick sound is
    // handled elsewhere.
    if ( this.currentValue < this.previousValue ) {
      this.decrementSoundClip.play();
    }
  }

  public stop(): void {
    this.decrementSoundClip.stop();
  }

}

meanShareAndBalance.register( 'BalancePointControls', BalancePointControls );