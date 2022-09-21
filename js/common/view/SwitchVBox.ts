// Copyright 2022, University of Colorado Boulder


/**
 * VBox that contains the AB Switch that toggles between pipe Open/Closed states
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import { VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import ValveNode from '../../intro/view/ValveNode.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';


export default class SwitchVBox extends VBox {

  public constructor( arePipesOpenProperty: Property<boolean>, providedOptions: PickRequired<VBoxOptions, 'tandem'> ) {

    const pipeSwitch = new ABSwitch( arePipesOpenProperty,
      false, new ValveNode( new Vector2( 0, 0 ), new Property( 0 ), providedOptions.tandem.createTandem( 'closedValveIcon' ) ),
      true, new ValveNode( new Vector2( 0, 0 ), new Property( Math.PI / 2 ), providedOptions.tandem.createTandem( 'openValveIcon' ) ), {
        toggleSwitchOptions: {
          size: new Dimension2( 40, 20 )
        },

        // phet-io
        tandem: providedOptions.tandem.createTandem( 'pipeSwitch' )
      } );

    super( {
      align: 'left',
      children: [ pipeSwitch ],
      layoutOptions: { column: 0, row: 1, minContentHeight: 140, yAlign: 'top' }
    } );
  }
}

meanShareAndBalance.register( 'SwitchVBox', SwitchVBox );