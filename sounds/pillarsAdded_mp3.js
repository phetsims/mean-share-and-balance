/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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9ZEk97CmCIzMiVd4CeSEjQEx92tDhZRAsW3R45vxex2qYJV0ATd3JW0SEZ9QdWZwrSGnN1S5Vukc81l9C5TI0fYKi7knZZEIzJpWNiSYE0OiMII8AaFJEBsUh2HE8EYgj6ORmB47PBGE8KSsfiKXVJ0+tTKlrB6mjP/7cMToAAsMwUOnsMmycC+ltYSa3+WFzLi7PW0eZiahFWNSDOA0mdZRIJYa+ubGudjU1jUmq3akzcKZQ1Ln9WNTUu7UrtlO+1JmpT+Mf9X1LCiVB3UehpnETTp7iUZUBQFDqzsOtkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqgESUlYCQWGsqHZcL5AHsvpG2H6RxPHGs7ScWUUXFoJ4tEic7PRpRZZVxubm0aztJxYEUeZaG5v/+3LE/4AQxL8hrTDLYpaxoqmWDfgmnOz0aUWDjkZGrNZZYDBSoZGTKsssoIHY6GTKGDAwVlDAwQIOjkasoUFZYDBB3RyNWChgwME8oIGCBOhkasqyp9l/9WsDA4HrU0xBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMSuA9Adks7GGG/gAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;