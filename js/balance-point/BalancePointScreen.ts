// Copyright 2024, University of Colorado Boulder

/**
 * Screen that uses a soccer context to explore mean.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import PickRequired from '../../../phet-core/js/types/PickRequired.js';
import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import MeanShareAndBalanceStrings from '../MeanShareAndBalanceStrings.js';
import MeanShareAndBalanceColors from '../common/MeanShareAndBalanceColors.js';
import BalancePointScreenView from './view/BalancePointScreenView.js';
import meanShareAndBalance from '../meanShareAndBalance.js';
import BalancePointModel from './model/BalancePointModel.js';
import BasicActionsKeyboardHelpSection from '../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import RegionAndCulturePortrayal from '../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import Property from '../../../axon/js/Property.js';


type SelfOptions = EmptySelfOptions;

type BalancePointScreenOptions = SelfOptions & PickRequired<ScreenOptions, 'tandem'>;

export default class BalancePointScreen extends Screen<BalancePointModel, BalancePointScreenView> {
  public constructor( regionAndCulturePortrayalProperty: Property<RegionAndCulturePortrayal>, providedOptions: BalancePointScreenOptions ) {
    const options = optionize<BalancePointScreenOptions, SelfOptions, ScreenOptions>()( {
      name: MeanShareAndBalanceStrings.screen.balancePointStringProperty,
      backgroundColorProperty: MeanShareAndBalanceColors.balancePointScreenColorProperty,
      createKeyboardHelpNode: () => new BasicActionsKeyboardHelpSection()
    }, providedOptions );
    super(
      () => new BalancePointModel( regionAndCulturePortrayalProperty, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new BalancePointScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

meanShareAndBalance.register( 'BalancePointScreen', BalancePointScreen );