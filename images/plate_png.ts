/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;