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