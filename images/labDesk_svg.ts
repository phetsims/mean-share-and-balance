/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_4" width="16in" height="240" viewBox="0 0 1150.2 183.1"><defs><style>.cls-1{fill:#b59373;stroke-linecap:round;stroke-linejoin:round;stroke:#241f20;stroke-width:3px}</style></defs><path d="m1148.5 70.6-.1 21-37.9-.1-435.4-1.1v-.1h-2.6v.1L493 89.9h-1.4L41.9 88.7v.1l-40.1-.1.1-21.5L1148 70.1z" style="stroke:#241f20;stroke-width:3px;fill:#282827;stroke-miterlimit:10"/><path d="M1148 70.1 1.9 67.2l-.6-.6L74.2 1.4h1004z" style="stroke:#241f20;stroke-width:3px;stroke-miterlimit:10;fill:#4a4543"/><path d="m1110.5 91.7-.2 89.1-435.5-1.2-183.5.2-449.7-1.2.3-89.6 449.7 1.1 1.4.1 179.5.4h2.6z" class="cls-1"/><path d="M252.5 167.3c0 .8-1.4 1.4-3.1 1.4H50.2c-1.7 0-3.1-.6-3.1-1.4V97.4c0-.8 1.4-1.4 3.1-1.4h199.2c1.7 0 3.1.6 3.1 1.4zM483 99.5v66.7c0 1.9-1.4 3.4-3.1 3.4H261c-1.7 0-3.1-1.5-3.1-3.4V99.5c0-1.9 1.4-3.4 3.2-3.4H480c1.7 0 3.2 1.5 3.2 3.4Zm403.9.1v69.7c0 1-1.4 1.9-3.1 1.9H687.1c-1.7 0-3.1-.8-3.1-1.9V99.6c0-1 1.4-1.9 3.1-1.9h196.7c1.7 0 3.1.8 3.1 1.9m214.1-1.2v72.1c0 .4-1.4.7-3.1.7H898.1c-1.7 0-3.1-.3-3.1-.7V98.4c0-.4 1.4-.7 3.1-.7h199.8c1.7 0 3.1.3 3.1.7" style="stroke-linecap:round;stroke-linejoin:round;stroke:#241f20;stroke-width:3px;fill:#c9ae85"/><path d="m491.539 181.177.16-91.8 183.5.32-.16 91.8z" class="cls-1"/></svg>')}`;
export default image;