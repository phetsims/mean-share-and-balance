/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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8nhzSXJ41L500Iv0TJ7mP/TY6dNDcmi6VyPHUtlMr0Uf/kNFwkTHIIoT5oXUhlCKC5zhXJA4ZGxkZGy5icUmTIr27za/9IiWva6qqkrbAQH/+3LEYQAWYXd1+ZkAGS8VZbeGMAA1CgLaqAiVUv2DATVW+qqqrM3/2MzfVU//2b4f1VFUBEjAaDn/UDUrxEeLHv38GpZ/g0DQa1HoieJYa/BVV///9llljkrWWWUKGCggYIOED2WWVHvyy5sFDAwQMI6SysrWWOks//7/9jK1llkssseSyyxyJrLLLZZZ5nyz////llllT//1VgoIGCDgdVVV1yVVVX/TZTtv+qqqqummmlVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7cMR0A8wpiGohgHwIAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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