/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//twxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAHWAAzMzMzMzMzMzMzMzMzMzMzMzMzM2ZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZnMzMzMzMzMzMzMzMzMzMzMzMzMzP////////////////////////8AAAA8TEFNRTMuOTlyAc0AAAAAAAAAABRgJAOfQgAAYAAAB1jZ1IWPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7cMQAAA7kf0B1jAAR8ZvutzDyQgAAS5n8awuxUi7HcmVzpjlpCyBgEZkGpRsUaBF8IqpghIQCFsCyBgAYhGIQCIZRmU5rabXm9prOChuMWoN8Ti81pMowEMs2XjQfUHTAWI1yHLH15W7a7F2M4Zw5DkP5LLA4EAQOCQEHcu+XP8EHf/wf/KO///4Pp1KEsAAoBEtqWjYYDANEXa/TWJt6RpoGM19yatImgWlfmAseijOJSkJ/0IWW4KkwxCbw4onw3yTqQenrktsbd9h3lvScdPqZrLbbd85/H23KOV1c/abrr4//798rHJOOD2N40K1oX///VixFcImXmY+oTECwUPehI3//+XUAAFO1eK6VbRPhAcRBTpNWsgGAgoUDAqAr7Lsp0tcc5WJI1KFKpFVW4u8nEOgT4Uv/+3LEGAEPnI8ufZwAEZQUpR2WGerAgQwqSKl0MAVxtIlSBHgbLtRtOVhCAJcyaJel6nnWKvhg0pa1IbUtmpiLULpT1amlOPN4WhClJ2qsMhIO3ToakZ5fPL/9OJf/v/zoNBAApTbrZRWMJEbBAzSEsRjJQqibMxCWpfJxO03JdUtFYGSaKgJCHAOJ0lZ5J5dW0I59aAtYdDtNUIdjpbjeatshbOSEhKGQSdEvckra/9Orq/k3nSyysX0iYulc+KUM6Vf//swqAYACU5cW5InRh3B1UxrhA0RJWJqSgDBKLRZBGXsTiWlHIKlShNqBNcjDa9XKDSszG4NnwX2CgTbjxpW+jZRIx3fWNcsPw8SiRMz0B2FPOq+V/N80ZCralcsu1EkcZf/cpKPVwAoqOYUo2g4I3pLIGVwZcv/7cMQ5ggxchxrtPS0ReqvjHYGKYtYni7bwJ6u0u9mTL4hG4fksUr5OTZoHFcHNYAARMP9JnMLCBjbDwKMKY40ISCJqMyf7JTavTqU1XQ0edkdUSgOnrtT//23///9o4g9zFroFbv02yU5i7EWZA6zyLGhgZqAiJByLco1xG3lVPo1DuK5rZMkJCZY+8Vzm03L08yEwERSIYEUMEeJoBQpf0/9yf08//LIlv/9IrdXptuQAFwyOipyBUvVYFbLwwcBpwiPFWBqOPZHinzp763avb+IqACCjbtsaS6c4qAVK/LmmYaehdKPvSwWPNskVlmiplFNCyRGuIia2ZKkvohHdZpNmr3JdZEialWqksN9XKW8VEIeApVN2il0ltWiq4VIyX3/FJrYxj/WkKjWaFVyXqoUps/qilnz/+3LEaoAJFIMpR5hysJuF5SiRiGZiQs/q4RNX/JFtItOtEoaCrjy5Zafy3yMt9rJZHLwOK2Q0ZczAjwMvrE93g6+E00gztMxToQMAanBBgxpUyQAWPosrObV3YCguAAcgTQJllGlOzsaaKAzD4sossqwNWkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7cMTFAE+9GubtYSERFowQMc0Ydaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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