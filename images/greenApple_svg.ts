/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="86.5" height="96.6" viewBox="0 0 86.5 96.6"><defs><style>.cls-5{fill:none;stroke:#231f20;stroke-miterlimit:10;stroke-width:1.6px}</style></defs><path d="M85.1 33.2C79 10.9 60.6 12.6 41.8 17.3c.4 1.6.7 3.2.9 5-.8.5-2.5 1.2-3.7.7-.8-2.5-1.6-4.5-2.5-6.4-1.2 0-1.4-.2-2.4-.4-24.4-3-38.2 2.5-31.7 36 3.4 17.4 22.7 49.4 35.9 42.7 5.6-2.8 13.3-1.5 16.9-.4C70.1 98.9 89.4 49.4 85 33.2Z" style="stroke-width:0;fill:#00a048"/><path d="M10.1 26c-1.7 2-3.2 7.8-2.5 10 1.5 4.9 2.8-1.9 6.5-5 3.7-3.2 7.8-2.4 8.4-3.8 1.5-3.3-2.2-5.1-4.9-5-2.1.1-5.1 1.2-7.4 3.8Z" style="fill:#fff;opacity:.7;stroke-width:0"/><path d="M34.4.8c-2.7.7-3 2.5-7.1 2.4 4.4 5 6.8 8.5 9 13.5.8 1.9 1.6 4 2.5 6.4 1.2.5 2.9-.2 3.7-.7-.2-1.8-.5-3.5-.9-5-1.5-5.8-4-10-7.2-16.5Z" style="stroke-width:0;fill:#7a5622"/><path d="M72.2 70.6c-3.4 8.6-9.5 16.8-12.1 20.3 6.8-1.7 11.9-13 14.2-18.8 3.5-8.6 6.8-16.6 8.2-25.8-.3-.4.4-1.2-.3-.9-3.3 7.2-7.1 18-9.9 25.2Z" style="stroke-width:0;opacity:.1"/><path d="M41.7 17.3C60.5 12.6 79 10.9 85 33.2c4.4 16.2-14.9 65.7-29.8 61.3-3.7-1.1-11.3-2.4-16.9.4-13.2 6.6-32.5-25.3-35.9-42.7-6.5-33.5 7.3-39 31.5-35.9 1 .1 1.2.3 2.4.4" class="cls-5"/><path d="M34.4.8c3.2 6.5 5.8 10.7 7.2 16.5.4 1.5.7 3.2.9 5-.8.5-2.5 1.2-3.7.7-.8-2.5-1.6-4.5-2.5-6.4-2.2-4.9-4.6-8.5-9-13.5 4 0 4.3-1.7 7.1-2.4" class="cls-5"/><path d="M52 19.3c-4.2.6-7.7 3.7-11.8 4-2.1.2-3.5-.5-5.4-1.3-1.1-.5-4.9-1.5-4.8-1.3" class="cls-5"/></svg>')}`;
export default image;