// Copyright 2024, University of Colorado Boulder
/**
 * A keyboard help section for moving a grabbed item.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection, { KeyboardHelpSectionOptions } from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import LetterKeyNode from '../../../../scenery-phet/js/keyboard/LetterKeyNode.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = {
  headingStringProperty: LocalizedStringProperty;
  moveDescriptionStringProperty: LocalizedStringProperty;
};

type MoveKeyboardHelpSectionOptions = SelfOptions & KeyboardHelpSectionOptions;
export default class MoveKeyboardHelpSection extends KeyboardHelpSection {

  public constructor( providedOptions: MoveKeyboardHelpSectionOptions ) {
    const sectionRow = KeyboardHelpSectionRow.labelWithIconList(
      providedOptions.moveDescriptionStringProperty, [
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
          KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.a(), LetterKeyNode.d() ], { spacing: 1.3 } ) ),
        KeyboardHelpIconFactory.iconOrIcon(
          KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
          KeyboardHelpIconFactory.iconRow( [ LetterKeyNode.w(), LetterKeyNode.s() ], { spacing: 1.3 } ) ) ] );
    super( providedOptions.headingStringProperty, [ sectionRow ] );
  }
}

meanShareAndBalance.register( 'MoveKeyboardHelpSection', MoveKeyboardHelpSection );