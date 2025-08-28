// Copyright 2024-2025, University of Colorado Boulder

/**
 * FulcrumSliderSoundPlayer is used to produce sounds when the fulcrum beneath the balance beam is moved by the user.
 * It uses most of the default sound production capabilities of its parent class, but prevent sounds from being played
 * in a number of situations where sounds are generated elsewhere.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ValueChangeSoundPlayer, { ValueChangeSoundPlayerOptions } from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import MeanShareAndBalanceConstants from '../../common/MeanShareAndBalanceConstants.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

type SelfOptions = EmptySelfOptions;
type FulcrumSliderSoundPlayerOptions = SelfOptions & ValueChangeSoundPlayerOptions;

class FulcrumSliderSoundPlayer extends ValueChangeSoundPlayer {

  public constructor( private readonly beamSupportsPresentProperty: TReadOnlyProperty<boolean>,
                      private readonly meanValueProperty: TReadOnlyProperty<number | null>,
                      providedOptions?: ValueChangeSoundPlayerOptions ) {

    const options = optionize<FulcrumSliderSoundPlayerOptions, SelfOptions, ValueChangeSoundPlayerOptions>()( {
      numberOfMiddleThresholds: MeanShareAndBalanceConstants.SOCCER_BALL_RANGE.getLength() * 2 - 1
    }, providedOptions );

    super( new Property( MeanShareAndBalanceConstants.SOCCER_BALL_RANGE ), options );
  }

  /**
   * Override the playSoundIfThresholdReached method so that different sounds can be produced when pillars are gone.
   */
  public override playSoundIfThresholdReached( newValue: number, oldValue: number ): void {

    // Use the default sound production when the beams are present or if there are no balls on the beam, and produce
    // no sound otherwise.
    if ( this.beamSupportsPresentProperty.value || this.meanValueProperty.value === null ) {
      super.playSoundIfThresholdReached( newValue, oldValue );
    }
  }
}

meanShareAndBalance.register( 'FulcrumSliderSoundPlayer', FulcrumSliderSoundPlayer );

export default FulcrumSliderSoundPlayer;