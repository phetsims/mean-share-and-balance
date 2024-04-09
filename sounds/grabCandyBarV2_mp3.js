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