/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="42.5" height="13.4" viewBox="0 0 42.5 13.4"><defs><style>.cls-1{fill:#492305;stroke:#000;stroke-width:.5px;stroke-linecap:round;stroke-linejoin:round}</style></defs><path d="M42.1 13c-.3.4-2.9 0-4-.7q0 0 0 0h0V1.4h-.2c1-.5 3.7-1.4 4.1-1s-.9 1.7-1.1 2c.5.4 1 .8 1.3 1.4-.5.4-1.1 1.1-1.6 1.5.5.4 1.8 1.6 1.8 1.6s-.9 1-1.6 1.5l1.6 1.6c-.5.4-1 .9-1.5 1.3.7.4 1.3 1.4 1.3 1.8Z" class="cls-1"/><path d="M38 12.3H4.7q0 0 0 0h0V1.4H38zq0 0 0 0" style="stroke:#000;stroke-width:.5px;stroke-linecap:round;stroke-linejoin:round;fill:#6b3d18"/><path d="M4.6 1.4v10.9h0v.1c-1 .6-3.9.9-4.1.6.1-.4.9-1.3 1.3-1.8-.5-.4-.9-.8-1.3-1.3.4-.4 1-1.3 1.4-1.8C1.2 7.6.6 6.5.6 6.4c0 0 .7-.8 1.2-1.2C1.4 4.8.7 4 .3 3.6c.3-.5.7-1 1.2-1.4C1.2 2 0 .7.4.3s2.9.5 3.9 1h.3Z" class="cls-1"/><path d="M38 1.4v11M4.6 1.4v11" style="stroke-width:.5px;stroke-linecap:round;stroke-linejoin:round;fill:none;stroke:#fff"/><rect width="23.3" height="8.8" x="9.6" y="2.5" rx="4.2" ry="4.2" style="stroke:#fff;fill:#e5bb07;stroke-miterlimit:10;stroke-width:.4px"/><g style="opacity:.2"><path d="M37.1 12.4H5.4c-1.1.6-4.3 1-4.6.6v-.6c.2 0 .2-.5 1.2-1.3 1.5-1.2 2.9-3.9 2.7-7.3.2 0 .2 1.3.5 1.3 0 .8-.2 3.1 0 3.8s.5 1.1 1.2 1.5c.8.4 1.9.4 2.8.4 8.4 0 16.8 0 25.2.1.7 0 1.4 0 1.9-.3.6-.4.7-.9.7-1.5 0-.4.5-2.3.7-3.5.1 1.4.6 3.9 1.6 4.8.9.8 1.7 1.1 2.7 2.3-.4.5-2.4.7-5.1-.3Z" style="stroke-width:0"/></g><path d="M15.3 5.9c0 .3-.2.5-.6.5h-.8V5.3h.8c.4 0 .6.3.6.5Zm1.4 0c0-.9-.7-1.7-1.9-1.7h-2.2v5.4H14V7.7h.8c1.2 0 1.9-.8 1.9-1.7Z" style="fill-rule:evenodd;stroke-width:0;fill:#1d58a0"/><path d="M25.9 9.6h-3.8V4.2H30v1.2h-1.4v4.2h-1.4V5.4h-3.7v.9h2v1.2h-2v.9h2.4zm-5.5-3.9c-.7-.4-1.6 0-1.6 0V4.2h-1.5v5.4h1.5V7.5c0-.3.3-.6.6-.6s.6.3.6.6v2.1h1.4v-2c0-2.2 0-1.5-.9-1.9Z" style="stroke-width:0;fill:#1d58a0"/></svg>')}`;
export default image;