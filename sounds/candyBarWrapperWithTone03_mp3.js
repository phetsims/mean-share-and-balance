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