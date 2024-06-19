// Copyright 2024, University of Colorado Boulder

/**
 * The keyboard help content for the Balance Point screen includes slider controls, grab or release, and item movement
 * keyboard help.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import MeanShareAndBalanceKeyboardHelpNode from '../../common/view/MeanShareAndBalanceKeyboardHelpNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import GrabReleaseKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GrabReleaseKeyboardHelpSection.js';
import MoveKeyboardHelpSection from '../../common/view/MoveKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';

export default class BalancePointKeyboardHelpNode extends MeanShareAndBalanceKeyboardHelpNode {

  public constructor() {
    super( [
        new SliderControlsKeyboardHelpSection( {
          headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.sliderControlHeadingStringProperty,
          verbStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.sliderVerbStringProperty,
          sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.sliderNounStringProperty
        } ),
        new GrabReleaseKeyboardHelpSection( MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.grabOrReleaseItemHeadingStringProperty,
          MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.grabOrReleaseItemStringProperty ),
        new MoveKeyboardHelpSection( {
          headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.moveHeadingStringProperty,
          moveDescriptionStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.moveDescriptionStringProperty
        } )
      ],
      new SpinnerControlsKeyboardHelpSection( {
        headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.balancePointScreen.numberSpinnerHeadingStringProperty,
        verbStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerVerbStringProperty,
        sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerNounStringProperty,
        includeSmallerStepsRow: false
      } ) );
  }
}

meanShareAndBalance.register( 'BalancePointKeyboardHelpNode', BalancePointKeyboardHelpNode );