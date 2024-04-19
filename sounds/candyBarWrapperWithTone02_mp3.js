/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAIkgAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABRgJAYnQgAAYAAACJKh9S2FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cMQAAAq9oUXUEQAS87DuvzLwAsdVQzMyOltjGc4xuOQMbnfqd0Axbp6kZTnkI3QhCVACVP/6chCEqfnOc/5zv/qd5z//nO6HPI05535zuEOfQjZG//8lTnPoc9CEachJ3o0jdCEUAdwxEMyKzOiKiIiLG2ikUgUSTBaHRBKM7M7ttMSDYmhk8NRTBaickWEu1sE7FvWoCyQMvZ+HQAhJ8frjImnA00PMtUmU3soxVolhGkYn2dGMjxTXUR5yxaYxeJeOrHj+A8kZ58Xvm8ekfffv4+5pWWm9Xuzzw3/eRKWeOEfFIT5XQXWde1/q+KbpT0p6Uv/e+fbNcVq9tezyI8eaeRO8rumfrGo+/Dj7zeuPb/5lg49f7xMx5rmgfGzZc0Td/15taZh3ZDM6lUYKMGMCPCCkubz/+3LECIAM9I1t3PQAEhQzrXmHjHpei1G+SpBClB+bHpmbD8sMUNEWYIYeIs9TFw06vFEDRz+YNhYuuLiv7hVG40dWCoLHmuBXaCoShMFURrsXRVyz8sDQaceEVJEiOiJ+RPPQGTz2+NTWAUvMMqopmUoqsXkVTUNFSgU0wOx0sGgqSjQ5KLDkjS9KN5lbLYrXN/NFMhYSgHLCBnxMD5mmVNCOX9CDi0pgZgBOYSjnBnlsJK5hKYBUwMEAUcQ+Rk/vD0BjgFfOEBsXWPuX/2Jn/dL3sPlnmgKhL/0YyenKbwQHFwnBHpTRRYp+2LvX/G9CiZdmRUM+lFVHQcCoMCqMTIhIOsqfZ/I0yRxbTTV/Oe0kUiQUFmY864uVVkgGpMoa68ty2FJp+VQtJ7V5ilRzQd6AjikcTiwa9v/7cMQkgA7dLW/MJE9RqQutvPSN2SXWze6u5Q0QVBbNYys7tjJQ+fZHB4NHZ6lcqYPeLW56K37V3EWtPR48YvuqShN//ZkWyrYiQkkbCqI4pSwlgbhXRYRt4OIzkKRR+GUeQwVCwmnNMimItUNIUKR+/szU3DtQUyf5BmFUQoRNwBDuzaUzrEY113NJp3Pr1i6bkk3ut3rieaoov/061bG+v/mv/v/3Ph94vf/9Vf/u65qFeuIhRsgxL02YJfDLTAwTCOYhqvMmD2cv6mZoHMxehoSSBhRklqMY5lIiEZjwJFLzOSFlGNmNS0PY/nMz8+bHNGwnXuR8K3+6wHKCPY5UcFUG012uOE1tUmlmZPMWYHMXM527VxLKIAAEYIpI6QvSCpkrRXnY8SkZgGqyJVSJ7Rk2c9tJPVT/+3LERYAMvPtt55hugeIjK7j2DSCZjZtVjHWNVJmqsdE8ZgbNdYGPDHrozGzGS+zbQ9dgxEGbXzs+lWmzGSkwaRrV4exmFDQ4BBUAwoki5lJ0iCBYWSkcdJLa9BqRYVVEWIlG1zydXUpIqUYiEAAAAM1YFOTU3yWsy5NcsSZLDmCqZdJGJLF7sS5rxanaW8ybhpVlUE0imMTgDPMc6znjZO5xnG2bqkRrVEsfHJQqGQoKMGGNegPgNKA0MUA5rI3qtjNdS+fSjcpMzbVel9IMXr+sh9X1Cw6Gg7/BqeW5blU/Kt0VB0s8ksuSkIshgkBOYzQ/g1RYmzkDoKuAWACD7SsO1RxCmltIUIVQorpOGq51RKqSw1VC6P6JNRrqknhUBQVARIC6gbDbaiwqAisKEoFceDqQWFyICP/7cMRogBAJaUPHmHFBoY2lNPYkqBoe0CjTp1jjosRcdnn+v4dZEQd55lGdbXd3d4d3fDYCQAtyVQInoWCRizIVEMFKoh0RUCh0C6wQItuxBr7gAoC4oHxKGgqNB8Ph46URoG2N3/9nKigwQsHq2f//Fv/xZUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3LEhgPI8HDf7CRO8AAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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