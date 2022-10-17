// Copyright 2022, University of Colorado Boulder

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
import { combineOptions } from '../../../../phet-core/js/optionize.js';

export default class PipeSwitch extends ABSwitch<boolean> {

  public constructor( arePipesOpenProperty: Property<boolean>, tandem: Tandem ) {

    const options = {
      toggleSwitchOptions: {
        size: new Dimension2( 40, 20 )
      },
      tandem: tandem
    };

    const closedValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( 0 ), tandem.createTandem( 'closedValveIcon' ) );

    const openValveIcon = new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ), tandem.createTandem( 'openValveIcon' ) );

    const combinedOptions = combineOptions<ABSwitchOptions>( { layoutOptions: { column: 0, row: 1, minContentHeight: 140 }, align: 'top', justify: 'left' }, options );

    super( arePipesOpenProperty, false, closedValveIcon, true, openValveIcon, combinedOptions );
  }
}

meanShareAndBalance.register( 'PipeSwitch', PipeSwitch );