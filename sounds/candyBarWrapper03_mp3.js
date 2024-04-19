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