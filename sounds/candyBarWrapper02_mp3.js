/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
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