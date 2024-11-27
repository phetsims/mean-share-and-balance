// Copyright 2024, University of Colorado Boulder
/**
 * The keyboard help content for the Fair Share screen includes spinner controls.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import SpinnerControlsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/SpinnerControlsKeyboardHelpSection.js';
import MeanShareAndBalanceKeyboardHelpNode from '../../common/view/MeanShareAndBalanceKeyboardHelpNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';


export default class FairShareKeyboardHelpNode extends MeanShareAndBalanceKeyboardHelpNode {

  public constructor() {
   super( [
     new SpinnerControlsKeyboardHelpSection( {
       headingStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.fairShareScreen.numberSpinnerHeadingStringProperty,
       verbStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerVerbStringProperty,
       sliderStringProperty: MeanShareAndBalanceStrings.keyboardHelpDialog.numberSpinnerNounStringProperty,
       includeSmallerStepsRow: false
     } )
   ] );
  }
}

meanShareAndBalance.register( 'FairShareKeyboardHelpNode', FairShareKeyboardHelpNode );