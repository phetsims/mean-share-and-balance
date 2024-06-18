// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Distribute Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import DistributeModel from './model/DistributeModel.js';
import DistributeScreenView from './view/DistributeScreenView.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import distributeHomeScreenIcon_svg from '../../images/distributeHomeScreenIcon_svg.js';
import distributeNavBarIcon_svg from '../../images/distributeNavBarIcon_svg.js';
import DistributeKeyboardHelpNode from './view/DistributeKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;

type DistributeScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class DistributeScreen extends Screen<DistributeModel, DistributeScreenView> {
  public constructor( providedOptions: DistributeScreenOptions ) {
    const options = optionize<DistributeScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.distributeStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( distributeHomeScreenIcon_svg ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( distributeNavBarIcon_svg ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
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