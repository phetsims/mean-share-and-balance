// Copyright 2022, University of Colorado Boulder

/**
 * Control panel for the intro screen that contains:
 *   - a checkbox group with visibility toggling for: predictMean, mean, and tickMarks
 *   - an AB switch to toggle between the pipe open/closed states
 *   - a number spinner connected to the numberOfCups per representation on the screen
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { GridBox, GridBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import Property from '../../../../axon/js/Property.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import IntroOptionsVerticalCheckboxGroup from './IntroOptionsVerticalCheckboxGroup.js';
import NumberSpinnerVBox from '../../common/view/NumberSpinnerVBox.js';
import PipeSwitch from './PipeSwitch.js';

type IntroControlPanelOptions = StrictOmit<GridBoxOptions, 'children'> & PickRequired<GridBoxOptions, 'tandem'>;

export default class IntroControlPanel extends GridBox {
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
    const numberSpinnerVBox = new NumberSpinnerVBox( numberOfCupsProperty, { tandem: options.tandem.createTandem( 'numberSpinnerVBox' ) } );

    numberOfCupsProperty.link( () => {
      pipeSwitch.interruptSubtreeInput();
      introOptionsCheckboxGroup.interruptSubtreeInput();
    } );

    const combinedOptions = combineOptions<GridBoxOptions>( { children: [ introOptionsCheckboxGroup, pipeSwitch, numberSpinnerVBox ] }, providedOptions );
    super( combinedOptions );
  }
}

meanShareAndBalance.register( 'IntroControlPanel', IntroControlPanel );