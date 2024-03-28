/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAGAAAIkgAqKioqKioqKioqKioqKioqVVVVVVVVVVVVVVVVVVVVVVWAgICAgICAgICAgICAgICAqqqqqqqqqqqqqqqqqqqqqqrV1dXV1dXV1dXV1dXV1dXV1f////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABRgJAKjQgAAYAAACJI+cENgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cMQAAA3AzUZ094ACTauutx9AAgAAAp45+CEA5BDEYpznQ90b4X4KsWNTC2DgXINgFQIYSx0f5By5vi3lzUb+974YDTNM65z8FsEMPAV8AAAGBiG+PWXNzgUxSlKU/zSlNe97+9////e99///FKU8N/Hw/fx3gg4EP8Hz/9P///wQSaQISSkiAKW+btu2/2CDDlIbFMWwhgQ1TRfyBF3/zgcQgiboLg3SEBjEzLpk+UGGOD8/8QjFIE3hi0PdQyia8hDQNeKCE7DhMi8RUDSCw/U0VMgYFI7qTIsOSRL1jUdXMRActEGIETqLIJGJyOb1I8W5/0SaOlIfJePKdJfOD6v/izi0v6Zom61NcvFM+dKH1vb9KielmRNJaiHovqEBchhyv2diMCVL4L2bvAk0xGXv8m8FlQP/+3LEEQARHYlDXYiAEZsj6TT2NipzhXhWSCqJovGxwtoni9MiOHpkjiZdaswKA5RPkuXkzIvGTC8GaKxFCHF4j0SsTQuYgyyAhZaGACDImpqj/9usoizQDKKWNpFTY6OSDdECUNlt/9L//9aIrJBiZR0i8l///////6BsHG0xE41zHciDSH7kJOJYdDIdhyso/Gw0E3my8fhoEtNmE5nEfWrDaPiAP0XtM7vX6EpHby/9rMpRk4Jro8f6rjDcmhKof9dN10VMPUl0h+EwAQnnV0Q5qH/////MwNoSUeTq////VRJW2XI0ckjQIGqRKj5COi4k7LoYKMFwEiiqYdFGh6BgFRnLyOB+8GzWkckJX0zm7Vuq2B4yjZ7pkZK1DC05jthFVNqOh0DukxeP//XbscAawUz3RZEZh//7cMQrgAx9HUmnsa3yKrEm9ZZKLlNv////+sKEuPLE5BBciKCbSUKRlGyhIEAGkRhlACMRrw8WxpmMnU1Upaew/Csz4SIa8u6Xwg2LoShSbI24SaoaSR8jx6L3lRkfLSCOiO6B3vWOS2wiWpJihxlJRAgJkV1oq1dR9+jVpngTIXEfu6pHB6x1Kk12r9f//9waCMItaCZktbOuedbJPUpvZmUrq6vu+psxIZ6VDjRZSaSbZEppJOolq8RypWrPz6uXda84z8sBit5TpC2tL4zAhL41cD9VjDONP79K/ssOOkhQNlC2O1vXwNcxuT8VJWVAGcE8NZBLqKJipa0XQXSatTzgX8ofrNP/////yHzziiSTFFFzxB7myMxVjMhuekTa3ObSSytXnbknxlkaJKrdUNQySSmguUX/+3LERgAOaSU5rDGxcU8jqXTzNh4tYXAlcysJCqULCMMV5bcQet/wqyeQSEZrRV1qRYxV7ahpDy2pX9+2jWw8VM3Xb/////5Uf9X9nr1fkg5JGlJG5GxMBmIesIRgAS2RO60IzoStLnCpmprSL9MEsF9ihEDTsDOxOSEm4lm+GyHkSVGwB1NUaMomOJCNGE4nudh/hHjpUMZWP5122NTCuJID5iruM0qVCQgsNIs1G1TNDO1KJ9pmjuUXOLzxYLYX5m1IPGqKnINPsOSA2zVI4VJHin//////iFf4wkjLiVqPWhjcL2sm01HjhaxBlxUox7YrGRRhw9nkcfETNDcSPBXqbRKJJUBgA5Uy6UirQ9UC4GrQW/MYf9CS7EGuAwWpTWhCgfYMnsJiollJEqiqpStmnojoRPkOf//7cMR1ABYhly2sPRH5jKMkaYSKJixQpSl/KykNcr/VWou5VEgTgIZ7BUMhyp2o/0o6f/+BbvctFum8O/ZfyKoFOxJSOpyS3g8H1tdyqFPW3sVfDiiNE8kyZgwpcz//o/8z6l+X/R1Ry5ilmN/8vobVoUBA1ytagaBoOrLUrKuxMPczeJbQVcoBOWJbW7Ubx/pRyG6gnBR+fxpE4pPKCk1JdrrDL1QUAzgZyYxIZ1LOb38pvk5QaYr///aVSVVNlar/+iuqTEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+3LEfIBJAQEnpARO8PINW3TzDHWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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