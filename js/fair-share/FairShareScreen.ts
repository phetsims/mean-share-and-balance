// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Fair SHare Model and Screen View.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import FairShareScreenView from './view/FairShareScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import FairShareModel from './model/FairShareModel.js';
import { Image } from '../../../scenery/js/imports.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import fairShareHomeScreenIcon_svg from '../../images/fairShareHomeScreenIcon_svg.js';
import fairShareNavBarIcon_svg from '../../images/fairShareNavBarIcon_svg.js';
import FairShareKeyboardHelpNode from './view/FairShareKeyboardHelpNode.js';
import MeanShareAndBalanceConstants from '../common/MeanShareAndBalanceConstants.js';

type SelfOptions = EmptySelfOptions;

type FairShareScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class FairShareScreen extends Screen<FairShareModel, FairShareScreenView> {
  public constructor( providedOptions: FairShareScreenOptions ) {
    const options = optionize<FairShareScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.fairShareStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( fairShareHomeScreenIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      navigationBarIcon: new ScreenIcon( new Image( fairShareNavBarIcon_svg ), MeanShareAndBalanceConstants.SCREEN_ICON_OPTIONS ),
      backgroundColorProperty: MeanShareAndBalanceColors.fairShareScreenColorProperty,
      createKeyboardHelpNode: () => new FairShareKeyboardHelpNode()
    }, providedOptions );
    super(
      () => new FairShareModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new FairShareScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'FairShareScreen', FairShareScreen );