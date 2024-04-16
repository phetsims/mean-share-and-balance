// Copyright 2024, University of Colorado Boulder

/**
 * WaterLevelSoundPlayer is used to play the sounds for the slider that sets the water level for the cups on the first
 * screen of the mean-share-and-balance sim.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import ValueChangeSoundPlayer from '../../../../tambo/js/sound-generators/ValueChangeSoundPlayer.js';
import Range from '../../../../dot/js/Range.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CrossFadeSoundClip from './CrossFadeSoundClip.js';
import soundManager from '../../../../tambo/js/soundManager.js';
import glassLevelSoundA_mp3 from '../../../sounds/glassLevelSoundA_mp3.js';
import glassLevelSoundB_mp3 from '../../../sounds/glassLevelSoundB_mp3.js';
import SoundUtils from '../../../../tambo/js/SoundUtils.js';
import Utils from '../../../../dot/js/Utils.js';

class WaterLevelSoundPlayer extends ValueChangeSoundPlayer {

  public constructor( waterLevelProperty: TReadOnlyProperty<number>,
                      valueRangeProperty: TReadOnlyProperty<Range>,
                      numberOfMiddleThresholds: number,
                      crossFade: number ) {

    const soundPlayer = new CrossFadeSoundClip( glassLevelSoundA_mp3, glassLevelSoundB_mp3, crossFade );
    soundManager.addSoundGenerator( soundPlayer );

    // Adjust the playback rate as the level changes.
    waterLevelProperty.link( waterLevel => {
      let playbackRate;
      const proportion = waterLevel / valueRangeProperty.value.max;
      if ( proportion === 1 ) {
        playbackRate = SoundUtils.getMajorScalePlaybackRate( numberOfMiddleThresholds + 3 );
      }
      else if ( proportion === 0 ) {
        playbackRate = 0.75;
      }
      else {
        const interThresholdDistance = valueRangeProperty.value.getLength() / ( numberOfMiddleThresholds + 1 );
        const noteIndex = Utils.clamp(
          Math.floor( ( proportion - 0.5 * interThresholdDistance ) * ( numberOfMiddleThresholds + 1 ) ),
          0,
          numberOfMiddleThresholds - 1
        );
        playbackRate = SoundUtils.getMajorScalePlaybackRate( noteIndex );
      }
      soundPlayer.setPlaybackRate( playbackRate );
    } );

    super( valueRangeProperty, {
      middleMovingUpSoundPlayer: soundPlayer,
      middleMovingDownSoundPlayer: soundPlayer,
      maxSoundPlayer: soundPlayer,
      minSoundPlayer: soundPlayer,
      numberOfMiddleThresholds: numberOfMiddleThresholds
    } );
  }
}

meanShareAndBalance.register( 'WaterLevelSoundPlayer', WaterLevelSoundPlayer );

export default WaterLevelSoundPlayer;