/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+3LEgIALDGsXLLBjYJQAZPwAiASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqoD8AW////////mXzL+ZEf3Kiqh2///6oi/VEX/9yhgYMEdtUB1TUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMSAg8S9ewRggFy4AAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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