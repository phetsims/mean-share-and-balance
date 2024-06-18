// Copyright 2022-2024, University of Colorado Boulder

/**
 * Instantiates Level Out Model and Screen View.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import LevelOutModel from './model/LevelOutModel.js';
import LevelOutScreenView from './view/LevelOutScreenView.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import { Image } from '../../../scenery/js/imports.js';
import levelOutHomeScreenIcon_svg from '../../images/levelOutHomeScreenIcon_svg.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import levelOutNavBarIcon_svg from '../../images/levelOutNavBarIcon_svg.js';
import LevelOutKeyboardHelpNode from './view/LevelOutKeyboardHelpNode.js';

type SelfOptions = EmptySelfOptions;

type LevelOutScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class LevelOutScreen extends Screen<LevelOutModel, LevelOutScreenView> {
  public constructor( providedOptions: LevelOutScreenOptions ) {
    const options = optionize<LevelOutScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.levelOutStringProperty,
      homeScreenIcon: new ScreenIcon( new Image( levelOutHomeScreenIcon_svg ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( levelOutNavBarIcon_svg ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      backgroundColorProperty: MeanShareAndBalanceColors.levelOutScreenBackgroundColorProperty,
      createKeyboardHelpNode: () => new LevelOutKeyboardHelpNode()
    }, providedOptions );
    super(
      () => new LevelOutModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new LevelOutScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'LevelOutScreen', LevelOutScreen );