// Copyright 2024, University of Colorado Boulder
/**
 * Creates the keyboard help content for all the screens. All screens will contain a BasicActionsKeyboardHelpSection.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';


export default class MeanShareAndBalanceKeyboardHelpNode extends TwoColumnKeyboardHelpContent {

  public constructor( leftContent: KeyboardHelpSection[], topRightContent?: KeyboardHelpSection ) {
   super( leftContent, [ ...( topRightContent ? [ topRightContent ] : [] ), new BasicActionsKeyboardHelpSection( {
     withCheckboxContent: true
   } ) ] );
  }
}

meanShareAndBalance.register( 'MeanShareAndBalanceKeyboardHelpNode', MeanShareAndBalanceKeyboardHelpNode );