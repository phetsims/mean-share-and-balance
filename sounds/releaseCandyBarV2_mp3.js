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