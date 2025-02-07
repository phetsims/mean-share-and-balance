// Copyright 2024, University of Colorado Boulder

/**
 * Screen that uses a soccer context to explore mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Image from '../../../scenery/js/nodes/Image.js';
import balancePointHomeScreenIcon_svg from '../../images/balancePointHomeScreenIcon_svg.js';
import balancePointNavBarIcon_svg from '../../images/balancePointNavBarIcon_svg.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import BalancePointModel from './model/BalancePointModel.js';
import BalancePointKeyboardHelpNode from './view/BalancePointKeyboardHelpNode.js';
import BalancePointScreenView from './view/BalancePointScreenView.js';

type SelfOptions = EmptySelfOptions;

type BalancePointScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class BalancePointScreen extends Screen<BalancePointModel, BalancePointScreenView> {
  public constructor( providedOptions: BalancePointScreenOptions ) {
    const options = optionize<BalancePointScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.balancePointStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( balancePointHomeScreenIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      navigationBarIcon: new ScreenIcon( new Image( balancePointNavBarIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      backgroundColorProperty: MeanShareAndBalanceColors.balancePointScreenColorProperty,
      createKeyboardHelpNode: () => new BalancePointKeyboardHelpNode()
    }, providedOptions );
    super(
      () => new BalancePointModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BalancePointScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'BalancePointScreen', BalancePointScreen );