/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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MRQGzTFgBqcyWwoRMeYDeTBLQoQwOAD4MFtA7jAYwBw3rIxkMzg41oI1lM2QMxKAdUgqyHBjEGRoYYMEYEIXTMisNeMAgEx7oavmwZgIYi26kAQ85VO9TKzBBVaZ7B3hgCZRCZwS8nxq30qHAW8rfcMKnf////////////1gEy2JqsVRM/hCk0Z1/jJiY/MD5bwyU2+TPsXsNOVEU0uCpjdXSRMkNPcwGGnjIbRbO7naOdxzN9iPM7yQMUhRTFQZeVO5E8IyAWFozv/7cMT/g8/IftQP90aCmJKXwf9wWMkwyJEIRslcUv8KDQQJXrgnH9faI1pa1pVVRZO5ha8kjUnkj1BF7upBl3AeWJDAKRDT54YVJLASEB39DCX5IQ//+lqvxUaAv89+kt/jgLVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3LE/wARrJSwD+hLwmwOT7Hu4UhVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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