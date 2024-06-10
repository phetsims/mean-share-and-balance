/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqqqqqqqqqqq//tyxG0DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+3DEbYPAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//tyxG0DwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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