// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SyncIcon from './SyncIcon.js';
import meanShareAndBalanceStrings from '../../meanShareAndBalanceStrings.js';
import MeanShareAndBalanceConstants from '../MeanShareAndBalanceConstants.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import MeanShareAndBalanceModel from '../model/MeanShareAndBalanceModel.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class SyncButton extends RectangularPushButton {
  public constructor( model: MeanShareAndBalanceModel, layoutBounds: Bounds2, tandem: Tandem ) {
    const syncIcon = new SyncIcon();
    const syncContent = new Node( {
      children: [
        syncIcon,
        new Text( meanShareAndBalanceStrings.sync, {
          left: syncIcon.right + 5,
          centerY: syncIcon.centerY,
          fontSize: 15,
          maxWidth: MeanShareAndBalanceConstants.MAX_CONTROLS_TEXT_WIDTH - syncIcon.width
        } )
      ]
    } );

    super( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.syncData();
      },
      content: syncContent,
      accessibleName: meanShareAndBalanceStrings.sync,
      right: layoutBounds.maxX - MeanShareAndBalanceConstants.CONTROLS_HORIZONTAL_MARGIN,
      baseColor: 'white',
      tandem: tandem.createTandem( 'syncRepresentationsButton' ),
      layoutOptions: { column: 1, row: 1, xAlign: 'left', minContentHeight: 140, yAlign: 'top' }
    } );
  }
}

meanShareAndBalance.register( 'SyncButton', SyncButton );