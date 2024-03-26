// Copyright 2022, University of Colorado Boulder

import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DualSoundClip from './DualSoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import glassLevelSoundA_mp3 from '../../../sounds/glassLevelSoundA_mp3.js';
import glassLevelSoundB_mp3 from '../../../sounds/glassLevelSoundB_mp3.js';

/**
 * WaterLevelSoundPlayer is used to play the sounds for the slider that sets the water level for the cups on the first
 * screen of the mean-share-and-balance sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

class WaterLevelSoundPlayer extends ValueChangeSoundPlayer {

  public constructor( waterLevelProperty: TReadOnlyProperty<number>,
                      valueRangeProperty: TReadOnlyProperty<Range>,
                      crossMix: number ) {

    const soundPlayer = new DualSoundClip( glassLevelSoundA_mp3, glassLevelSoundB_mp3, crossMix );
    soundManager.addSoundGenerator( soundPlayer );

    // Adjust the playback rate as the level changes.
    waterLevelProperty.link( waterLevel => {
      const proportion = waterLevel / valueRangeProperty.value.max;
      // const playbackRate = 0.5 + 1.5 * proportion;
      const playbackRate = 1 + 2 * proportion;
      soundPlayer.setPlaybackRate( playbackRate );
    } );

    super( valueRangeProperty, {
      middleMovingUpSoundPlayer: soundPlayer,
      middleMovingDownSoundPlayer: soundPlayer,
      numberOfMiddleThresholds: 7
    } );
  }
}

meanShareAndBalance.register( 'WaterLevelSoundPlayer', WaterLevelSoundPlayer );

export default WaterLevelSoundPlayer;