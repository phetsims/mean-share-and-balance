// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Distribute Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Image from '../../../scenery/js/nodes/Image.js';
import distributeHomeScreenIcon_svg from '../../images/distributeHomeScreenIcon_svg.js';
import distributeNavBarIcon_svg from '../../images/distributeNavBarIcon_svg.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import MeanShareAndBalanceConstants from '../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import DistributeModel from './model/DistributeModel.js';
import DistributeKeyboardHelpNode from './view/DistributeKeyboardHelpNode.js';
import DistributeScreenView from './view/DistributeScreenView.js';

type SelfOptions = EmptySelfOptions;

type DistributeScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class DistributeScreen extends Screen<DistributeModel, DistributeScreenView> {
  public constructor( providedOptions: DistributeScreenOptions ) {
    const options = optionize<DistributeScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.distributeStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( distributeHomeScreenIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      navigationBarIcon: new ScreenIcon( new Image( distributeNavBarIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      backgroundColorProperty: MeanShareAndBalanceColors.distributeScreenColorProperty,
      createKeyboardHelpNode: () => new DistributeKeyboardHelpNode()
    }, providedOptions );
    super(
      () => new DistributeModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new DistributeScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'DistributeScreen', DistributeScreen );