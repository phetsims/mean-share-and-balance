/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="3.7in" height=".9in" viewBox="0 0 264 62.3"><defs><style>.cls-1,.cls-3{fill:#ccc;stroke:#000;stroke-linecap:round;stroke-linejoin:round}.cls-3{fill:#f2f2f2}</style></defs><ellipse cx="131.9" cy="26.7" class="cls-3" rx="131.5" ry="26.2"/><ellipse cx="135.5" cy="28.8" class="cls-3" rx="87.8" ry="14.8"/><path d="M263.5 26.7v5c0 8.9-22.3 16.7-56.5 21.2-21.1 2.8-46.8 4.5-74.5 4.5s-47.3-1.4-67-3.8h0C26.7 48.8.6 40.2.6 30.6s-.1-3.5 0-3.9c0 14.5 58.9 26.2 131.5 26.2s131.5-11.7 131.5-26.2Z" class="cls-1"/><path d="M223.1 28.8c0 .5-.2 1-.5 1.5 0-8.2-38.5-13.8-87-13.8s-87.3 6.1-87.3 14.3c-.5-.7-.8-1.3-.8-2 0-8.2 39.3-14.8 87.8-14.8s87.8 6.7 87.8 14.8" class="cls-3"/><path d="M207 53.1c-6.8 5-36.1 8.7-71.2 8.7s-62.2-3.5-70.4-8.2c19.7 2.4 42.6 3.8 67 3.8s53.4-1.6 74.5-4.5h0Z" class="cls-1"/><path d="m65.2 53.4.3.2h0" style="stroke:#000;stroke-linecap:round;stroke-linejoin:round;fill:none"/></svg>')}`;
export default image;