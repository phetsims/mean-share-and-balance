/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAIkgAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABRgJAZRQgAAYAAACJJnKJ2iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cMQAAAawA0VUAQAzfrKsNzOAA0IWebSarvEAIDT4fU4mIz6C58H5wPlz/8oGPlw+XB/+UdwQdgmD8o7ykH/yhzhj5PB8P2fBCEogEFBIRmNxrx7OVyQ0mB2lVEwhzBlQNRHaiXeBBqCBdrK3XHCTJOYYEJJFrHNdzChlSAZ50F5GDSFrknlpo9O3DjvsrddHBChqzDlYZa/Pv/P5z8seSmoYU9Lcb0fLorW24lF8s+Zdu88kCzExcdp65D2HG/Vse2jXZCJuCpfAbzcpbO4djUu7uWc+kqWIcpPj8mpXtgBnKljWYf19e18zdltTsosSzn8/9YURQYeCxGvO37czPV4BdCvc3W/vcsv5///833Pv/9Fdw3+9/eoLHb+X1d3KStvtbd7dnKCqDUaKSQoyuwlfqF4Ga6v/+3LEBwANiX9bnYKAMa2wKbzzCh0tdxdU3BUNO1Koah5rUWlIsoiAIAh0pQ7VkQxjGKKsYxpS/oZxIBg8Z/9DPDwAh0q/ujmMw1ne50eivtlL+1UoiIYzqOERxaPt/RKP//tZrVQSRDaPJpeNEBhcP98FQFVZWllOyRtuU4AqQ5XEdyMFhL6S6VGoa0HeX1lRqoNKFlVHGWR5I6qz2e5MGO8vWs75rFBoGOV3b1ZlEwwCFb+2WhkYvoYcxn7KX/KY3KUrLUrLXKX+8rf5Ssyo5tWKUz/VvVilLCgJpz4tNlRDDrI2Zkm6m/oG9QnKikUgyKAwglASsCClQIC8AVCrNEuZdYalWC3HUtMuV0XJjOVSsp8BqhdBJnZ+n7BjsyOcIlFMop21csKoWGVY1GcoTkpLIQijqPcgtv/7cMQtgBMgvSIN6eEB3Rxm+PQObDqWYsZ3P/X69ry416QtZmCEsdDA07AV6Hh5J868206Nw6FGzIohJEXb6Kr2m1tpm6h+m6KqseKRbQ5sxTvoATRUdVlP6psHyWQppUijAwEZFmFqURpHErzmIMbxzKJGtz6EnmpFIK6lTXg5AUsHINQ9lZS1UVJUla4BqaatWSbeaKioersKqtf/kUhnkZ/3tNPuSPQdMFUYW0qEDpdXFTQtKNGFDoheRxOM3kE3ERYOPfaFimPVAr1+9kaaIBMwNGaUr50FsL2lDvNNj2EBvm/+MQop6ISK0SaxzXU3zkUaQJZV7tddfFEABIzEBsQy9ElvtNeZmmuedjPxmT2fN6d6M7JYz6L3ba0zzHEHg6aIsgM7DsK/p6P3ANKSttxSIhJKgxz/+3LENwAMZS0vrBhQ4sywI/T0j8ABgD2LKCoA2iJhKE4DHFgNE0lWA8AZyUE2NRdrhC0omqBdj1mucDKvQEkKgtUPIcpUBtCw4CpVzIl1enGDscYuA7AUggogYwFaXtYPNzcmxUMLUTMlRdQlCfOp43LBc2VSciQjayRG0CDQYI9tiWoMDFJSMsAJPqvvKZVsOTuwzhFA1NIfkToQ5/XIwZSzwCiwgNB0QArISHCTlk0JBnEhkE3KUcX3+MrVBGVmZoZFEnEXG5pL6QkTE8ZgKBKJMl9ocjgVMGiFGShwlKZl+xKnIkcdH12r+vtFkgFUy2/vM57NQHHJf/vPfsue8lIkQ0RFQ6Gv0C3rcg8t2t35Y8FXLAQCsntKlHuzKgSa2axxott0mp3U1Ez5NT80T/5M1pZKgJwrvv/7cMQ+AAwcty/npMVg0Q4k9BCJPoZ8JfwoP/8qtpWIv/9eSPPJICu4WfviwVcqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrAAAAAFeS1TEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3LEcIPA3AIEj4AAMAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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