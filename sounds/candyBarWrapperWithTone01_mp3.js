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