// Copyright 2022, University of Colorado Boulder

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
import { Node, Text } from '../../../../scenery/js/imports.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = EmptySelfOptions;
type SyncButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content' | 'baseColor' | 'accessibleName'>;

export default class SyncButton extends RectangularPushButton {
  public constructor( providedOptions: SyncButtonOptions ) {
    const syncIcon = new SyncIcon();
    const syncContent = new Node( {
      children: [
        syncIcon,
        new Text( MeanShareAndBalanceStrings.syncStringProperty, {
          left: syncIcon.right + 5,
          centerY: syncIcon.centerY,
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - syncIcon.width
        } )
      ]
    } );

    const options = optionize<SyncButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      content: syncContent,
      baseColor: 'white',
      accessibleName: MeanShareAndBalanceStrings.syncStringProperty
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'SyncButton', SyncButton );