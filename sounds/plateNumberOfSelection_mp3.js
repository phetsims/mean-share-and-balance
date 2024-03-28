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