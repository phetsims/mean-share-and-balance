// Copyright 2022-2024, University of Colorado Boulder

/**
 * Control panel for the intro screen that contains:
 *   - a checkbox group with visibility toggling for: predictMean, mean, and tickMarks
 *   - an AB switch to toggle between the pipe open/closed states
 *   - a number spinner connected to the numberOfCups per snackType on the screen
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Property from '../../../../axon/js/Property.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import IntroOptionsVerticalCheckboxGroup from './IntroOptionsVerticalCheckboxGroup.js';
import PipeSwitch from './PipeSwitch.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NumberSpinnerSoundPlayer from '../../common/view/NumberSpinnerSoundPlayer.js';
import glassNumberOfSelection_mp3 from '../../../sounds/glassNumberOfSelection_mp3.js';
import MeanShareAndBalanceControls, { MeanShareAndBalanceControlsOptions } from '../../common/view/MeanShareAndBalanceControls.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';

type SelfOptions = {
  vBoxOptions?: StrictOmit<VBoxOptions, 'children'>;
};
type IntroControlPanelOptions = SelfOptions & StrictOmit<MeanShareAndBalanceControlsOptions, 'controlsPDOMOrder'>;

export default class IntroControls extends MeanShareAndBalanceControls {

  public constructor( tickMarksVisibleProperty: Property<boolean>,
                      predictMeanVisibleProperty: Property<boolean>,
                      numberOfCupsProperty: Property<number>,
                      arePipesOpenProperty: Property<boolean>,
                      providedOptions: IntroControlPanelOptions ) {

    // Checkbox Group
    const introOptionsCheckboxGroup = new IntroOptionsVerticalCheckboxGroup( tickMarksVisibleProperty,
      predictMeanVisibleProperty, { tandem: providedOptions.tandem.createTandem( 'introOptionsCheckboxGroup' ) } );

    // Pipe Switch
    const pipeSwitch = new PipeSwitch( arePipesOpenProperty, providedOptions.tandem.createTandem( 'pipeSwitch' ) );

    // Hook up Number Spinner callbacks.
    numberOfCupsProperty.link( () => {
      pipeSwitch.interruptSubtreeInput();
      introOptionsCheckboxGroup.interruptSubtreeInput();
    } );
    const options = optionize<IntroControlPanelOptions, SelfOptions, MeanShareAndBalanceControlsOptions>()( {
      numberSpinnerOptions: {
        arrowsSoundPlayer: new NumberSpinnerSoundPlayer(
          numberOfCupsProperty,
          glassNumberOfSelection_mp3,
          { initialOutputLevel: 0.5 }
        )
      },
      controlsPDOMOrder: [ introOptionsCheckboxGroup, pipeSwitch ],
      vBoxOptions: {}
    }, providedOptions );

    const combinedOptions = combineOptions<VBoxOptions>( {
        children: [ introOptionsCheckboxGroup, pipeSwitch ],
        minContentWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH + 25,
        spacing: 20
      },
      options.vBoxOptions );
    const vBox = new VBox( combinedOptions );
    super( vBox, numberOfCupsProperty, MeanShareAndBalanceStrings.numberOfCupsStringProperty, options );
  }
}

meanShareAndBalance.register( 'IntroControls', IntroControls );