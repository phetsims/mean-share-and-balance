// Copyright 2022-2024, University of Colorado Boulder

/**
 * VBox that contains the AB Switch that toggles between pipe Open/Closed states
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import meanShareAndBalance from '../../meanShareAndBalance.js';
import ValveNode from './ValveNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ABSwitch, { ABSwitchOptions } from '../../../../sun/js/ABSwitch.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import nullSoundPlayer from '../../../../tambo/js/shared-sound-players/nullSoundPlayer.js';

export default class PipeSwitch extends ABSwitch<boolean> {

  public constructor( arePipesOpenProperty: Property<boolean>, arePipesEnabledProperty: Property<boolean>, tandem: Tandem ) {

    const closedValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( 0 ) );

    const openValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ) );

    const options: ABSwitchOptions = {
      align: 'top',
      justify: 'left',
      enabledProperty: arePipesEnabledProperty,
      tandem: tandem,

      toggleSwitchOptions: {
        size: new Dimension2( 40, 20 ),

        // Turn off default sound production for switch - sounds for the pipes changing are handled elsewhere.
        switchToLeftSoundPlayer: nullSoundPlayer,
        switchToRightSoundPlayer: nullSoundPlayer
      }
    };

    super( arePipesOpenProperty, false, closedValveIcon, true, openValveIcon, options );
  }
}

meanShareAndBalance.register( 'PipeSwitch', PipeSwitch );