// Copyright 2022-2024, University of Colorado Boulder

/**
 * Creates the syncButton that will sync representations in sim when fired
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import SyncIcon from './SyncIcon.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import { HBox, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type SyncButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content' | 'baseColor' | 'accessibleName'>;

export default class SyncButton extends RectangularPushButton {
  public constructor( providedOptions: SyncButtonOptions ) {
    const syncIcon = new SyncIcon();
    const syncContent = new HBox( {
      children: [
        syncIcon,
        new Text( MeanShareAndBalanceStrings.syncStringProperty, {
          font: MeanShareAndBalanceConstants.DEFAULT_FONT,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - syncIcon.width
        } )
      ],
      stretch: false,
      spacing: 4
    } );

    const options = optionize<SyncButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      content: syncContent,
      baseColor: 'white',
      accessibleName: 'Sync with Plates',
      isDisposable: false
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'SyncButton', SyncButton );