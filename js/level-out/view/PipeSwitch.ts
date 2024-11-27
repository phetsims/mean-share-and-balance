// Copyright 2022-2024, University of Colorado Boulder

/**
 * VBox that contains the AB Switch that toggles between pipe Open/Closed states
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ABSwitch, { ABSwitchOptions } from '../../../../sun/js/ABSwitch.js';
import nullSoundPlayer from '../../../../tambo/js/nullSoundPlayer.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import MeanShareAndBalanceStrings from '../../MeanShareAndBalanceStrings.js';
import ValveNode from './ValveNode.js';

type PipeSwitchOptions = WithRequired<ABSwitchOptions, 'tandem'>;
export default class PipeSwitch extends ABSwitch<boolean> {

  public constructor( pipesOpenProperty: Property<boolean>, pipesEnabledProperty: Property<boolean>, providedOptions: PipeSwitchOptions ) {

    const closedValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( 0 ) );

    const openValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ) );

    const options = optionize<PipeSwitchOptions, EmptySelfOptions, ABSwitchOptions>()( {
      align: 'top',
      justify: 'left',
      enabledProperty: pipesEnabledProperty,
      toggleSwitchOptions: {
        size: new Dimension2( 40, 20 ),

        // Turn off default sound production for switch - sounds for the pipes changing are handled elsewhere.
        switchToLeftSoundPlayer: nullSoundPlayer,
        switchToRightSoundPlayer: nullSoundPlayer,
        phetioFeatured: false,
        visiblePropertyOptions: { phetioFeatured: false },
        accessibleName: MeanShareAndBalanceStrings.a11y.pipeFlowStringProperty
      },
      isDisposable: false
    }, providedOptions );

    super( pipesOpenProperty, false, closedValveIcon, true, openValveIcon, options );
  }
}

meanShareAndBalance.register( 'PipeSwitch', PipeSwitch );