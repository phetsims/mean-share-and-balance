/* eslint-disable */
/* @formatter:off */

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