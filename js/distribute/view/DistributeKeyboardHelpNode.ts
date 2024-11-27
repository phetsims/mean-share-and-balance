// Copyright 2024, University of Colorado Boulder
/**
 * The keyboard help content for the Distribute screen includes slider controls, grab or release,
 * item movement, and spinner controls.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import GrabReleaseKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GrabReleaseKeyboardHelpSection.js';
import SliderControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SliderControlsKeyboardHelpSection.js';
import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import MeanShareAndBalanceKeyboardHelpNode from '../../common/view/MeanShareAndBalanceKeyboardHelpNode.js';
import MoveKeyboardHelpSection from '../../common/view/MoveKeyboardHelpSection.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';


export default class DistributeKeyboardHelpNode extends MeanShareAndBalanceKeyboardHelpNode {

  public constructor() {
    super( [
        new GrabReleaseKeyboardHelpSection( MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.grabOrReleaseItemHeadingStringProperty,
          MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.grabOrReleaseItemStringProperty ),
        new MoveKeyboardHelpSection( {
          headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.moveHeadingStringProperty,
          moveDescriptionStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.moveDescriptionStringProperty
        } ),
        new SliderControlsKeyboardHelpSection( {
          headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.sliderControlHeadingStringProperty,
          sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.sliderControlNounStringProperty
        } )
      ],
      new SpinnerControlsKeyboardHelpSection( {
        headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.distributeScreen.numberSpinnerHeadingStringProperty,
        verbStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerVerbStringProperty,
        sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerNounStringProperty,
        includeSmallerStepsRow: false
      } ) );
  }
}

meanShareAndBalance.register( 'DistributeKeyboardHelpNode', DistributeKeyboardHelpNode );