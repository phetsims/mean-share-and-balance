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
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;
type SyncButtonOptions = SelfOptions & RectangularPushButtonOptions;

export default class SyncButton extends RectangularPushButton {
  public constructor( layoutBounds: Bounds2, providedOptions: SyncButtonOptions ) {
    const syncIcon = new SyncIcon();
    const syncContent = new Node( {
      children: [
        syncIcon,
        new Text( meanShareAndBalanceStrings.syncProperty, {
          left: syncIcon.right + 5,
          centerY: syncIcon.centerY,
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - syncIcon.width
        } )
      ]
    } );

    const options = optionize<SyncButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      content: syncContent,
      right: layoutBounds.maxX - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      baseColor: 'white',
      layoutOptions: { column: 1, row: 1, xAlign: 'left', minContentHeight: 140, yAlign: 'top' },
      accessibleName: meanShareAndBalanceStrings.syncProperty
    }, providedOptions );

    super( options );
  }
}

meanShareAndBalance.register( 'SyncButton', SyncButton );