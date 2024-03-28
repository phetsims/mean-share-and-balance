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

import { Node, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IntroOptionsVerticalCheckboxGroup from './IntroOptionsVerticalCheckboxGroup.js';
import NumberSpinnerVBox from '../../common/view/NumberSpinnerVBox.js';
import PipeSwitch from './PipeSwitch.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import NumberSpinnerSoundPlayer from '../../common/view/NumberSpinnerSoundPlayer.js';
import glassNumberOfSelection_mp3 from '../../../sounds/glassNumberOfSelection_mp3.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';

type IntroControlPanelOptions = StrictOmit<VBoxOptions, 'children'> & PickRequired<VBoxOptions, 'tandem'>;

export default class IntroControls extends VBox {

  public readonly controlsPDOMOrder: Node[];

  public constructor( tickMarksVisibleProperty: Property<boolean>, meanVisibleProperty: Property<boolean>,
                      predictMeanVisibleProperty: Property<boolean>, cupWaterLevelVisibleProperty: Property<boolean>,
                      numberOfCupsProperty: Property<number>, arePipesOpenProperty: Property<boolean>, providedOptions: IntroControlPanelOptions ) {

    const options = providedOptions;

    // Checkbox Group
    const introOptionsCheckboxGroup = new IntroOptionsVerticalCheckboxGroup( tickMarksVisibleProperty, meanVisibleProperty,
      predictMeanVisibleProperty, cupWaterLevelVisibleProperty, { tandem: options.tandem.createTandem( 'introOptionsCheckboxGroup' ) } );

    // Pipe Switch
    const pipeSwitch = new PipeSwitch( arePipesOpenProperty, options.tandem.createTandem( 'pipeSwitch' ) );

    // Number Spinner
    const numberSpinnerSoundPlayer = new NumberSpinnerSoundPlayer( numberOfCupsProperty, glassNumberOfSelection_mp3 );
    const numberSpinnerVBox = new NumberSpinnerVBox(
      numberOfCupsProperty,
      MeanShareAndBalanceConstants.NUMBER_SPINNER_CONTAINERS_RANGE,
      MeanShareAndBalanceStrings.numberOfCupsStringProperty,
      {
        minContentHeight: 140,
        tandem: options.tandem,
        numberSpinnerOptions: {
          arrowsSoundPlayer: nullSoundPlayer
        }
      } );

    numberOfCupsProperty.link( () => {
      pipeSwitch.interruptSubtreeInput();
      introOptionsCheckboxGroup.interruptSubtreeInput();
      numberSpinnerSoundPlayer.play();
    } );

    const combinedOptions = combineOptions<VBoxOptions>( { children: [ introOptionsCheckboxGroup, pipeSwitch, numberSpinnerVBox ] }, providedOptions );
    super( combinedOptions );

    this.controlsPDOMOrder = [
      numberSpinnerVBox,
      introOptionsCheckboxGroup,
      pipeSwitch
    ];
  }
}

meanShareAndBalance.register( 'IntroControls', IntroControls );