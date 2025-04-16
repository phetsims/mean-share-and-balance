// Copyright 2024, University of Colorado Boulder

/**
 * The keyboard help content for the Level Out screen includes slider controls and spinner controls.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import MeanShareAndBalanceKeyboardHelpNode from '../../common/view/MeanShareAndBalanceKeyboardHelpNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';

export default class LevelOutKeyboardHelpNode extends MeanShareAndBalanceKeyboardHelpNode {

  public constructor() {
    super( [
      new SliderControlsKeyboardHelpSection( {
        headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.levelOutScreen.sliderControlHeadingStringProperty,
        sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.levelOutScreen.sliderControlNounStringProperty
      } ),
      new SpinnerControlsKeyboardHelpSection( {
        headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.levelOutScreen.numberSpinnerHeadingStringProperty,
        verbStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerVerbStringProperty,
        sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerNounStringProperty,
        includeSmallerStepsRow: false
      } )
    ] );
  }
}

meanShareAndBalance.register( 'LevelOutKeyboardHelpNode', LevelOutKeyboardHelpNode );