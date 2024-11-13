/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="147" height="100" viewBox="0 0 147 100"><defs><linearGradient id="linear-gradient" x1="73.5" x2="73.5" y1=".01" y2="99.99" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4d79b4"/><stop offset="1" stop-color="#c4d6ee"/></linearGradient><style>.cls-1{opacity:.08}.cls-3,.cls-4,.cls-5{stroke-width:0}.cls-3{opacity:.13}.cls-7,.cls-8{stroke:#000;stroke-miterlimit:10;stroke-width:.35px}.cls-7{fill:#fff}.cls-8{fill:#1f1f1f}.cls-5{fill:#690bff}</style></defs><path d="M0 .01h147v99.97H0z" style="fill:url(#linear-gradient);stroke-width:0"/><path d="M3.73 66.74h139.54v3H3.73z" class="cls-5"/><path d="M73.5 69.67 59.39 94.11h28.22z" class="cls-5"/><path d="M92.84 40.89s-.65 1.15-.85 2.23c0 0-2.53 1.7-4.19 4.04 0 0-1.58-.02-2.83.65 1.53-3.28 4.38-5.82 7.87-6.92Z" class="cls-7"/><path d="M100.71 42.43s-1.49 1.02-3.89 2c0 0-2.69-1.22-4.83-1.31.19-1.07.85-2.23.85-2.23 1.24-.39 2.55-.6 3.92-.6.86 0 1.71.08 2.52.25.95.93 1.43 1.9 1.43 1.9Z" class="cls-8"/><path d="M107.33 45.71c-.64-.13-1.69-.22-1.69-.22-2.14-2.39-4.92-3.07-4.92-3.07s-.48-.97-1.43-1.9c3.3.65 6.16 2.55 8.05 5.18Z" class="cls-7"/><path d="M88.39 52.07s-1.61 2.49-2.73 3.46c-.94-.66-1.83-1.86-1.9-1.95v-.3c0-1.96.43-3.82 1.21-5.48 1.26-.67 2.83-.65 2.83-.65s.49 2.39.58 4.92Z" class="cls-8"/><path d="M97.52 49.65s-2.72 1.73-4.08 3.93c-.74-.45-5.06-1.5-5.06-1.5-.1-2.53-.58-4.92-.58-4.92 1.66-2.34 4.19-4.04 4.19-4.04 2.14.1 4.83 1.31 4.83 1.31.74 2.39.7 5.22.7 5.22Z" class="cls-7"/><path d="M109.62 51.42c-.42.42-.92 1.86-.92 1.86l-.05-.05-.05-.05c-.06-.07-.13-.14-.2-.21-.18-.2-.37-.41-.56-.63-.05-.06-.1-.11-.15-.17-.02-.02-.04-.05-.06-.07l-.19-.22c-.15-.18-.31-.36-.45-.53-.04-.05-.08-.1-.12-.14-.19-.23-.36-.43-.49-.59-.02-.02-.04-.05-.06-.07-.02-.03-.04-.05-.06-.08-.01-.02-.03-.04-.04-.05 0 0 0-.01-.01-.01-.01-.02-.03-.03-.04-.05s-.03-.03-.04-.05c-.01-.01-.02-.03-.03-.04 0-.01-.02-.02-.02-.03 0 0-.01-.01-.01-.02 0-2.88-.44-4.73-.44-4.73s1.05.09 1.69.22c1.19 1.66 2 3.6 2.3 5.71Z" class="cls-8"/><path d="M87.8 60.8s-.4.63-.54 1.36a12.98 12.98 0 0 1-3.5-8.58c.07.09.96 1.3 1.9 1.95 0 0 .73 3.02 2.14 5.26Zm19.39.24c.15-.88-.25-1.95-.25-1.95 1.69-2.41 1.75-5.8 1.75-5.8s.5-1.44.92-1.86c.09.61.13 1.23.13 1.86 0 2.9-.95 5.59-2.56 7.75Z" class="cls-7"/><path d="M94.77 65.13s-1.03.47-1.93.55c-2.16-.68-4.07-1.91-5.58-3.52.14-.73.54-1.36.54-1.36s1.89 1.21 4.38 1.36c0 0 1.32 1.84 2.58 2.97Zm12.42-4.09a13 13 0 0 1-4.65 3.89c-.7 0-1.49-.29-1.49-.29h-.08s.03-.03.05-.04c.08-.06.16-.13.22-.21l2.58-3.34c.08-.04 2.65-1.27 3.12-1.95 0 0 .39 1.07.25 1.95Z" class="cls-8"/><path d="M102.54 64.93c-1.74.87-3.71 1.36-5.79 1.36-1.36 0-2.68-.21-3.92-.6.9-.08 1.93-.55 1.93-.55s3.58.64 6.06-.42c.05-.02.1-.05.15-.08h.08s.79.29 1.49.3Zm-7.1-6.55s-2.78 3.81-3.26 3.78c-2.49-.15-4.38-1.36-4.38-1.36-1.41-2.24-2.14-5.26-2.14-5.26 1.12-.97 2.73-3.46 2.73-3.46s4.32 1.06 5.06 1.5c0 0 1.41 3.89 2 4.8Zm10.63-8.16v.04s0 .02-.01.03c0 0-.01.02-.02.03 0 0-.01.02-.02.03s-.03.03-.04.05-.03.03-.05.05c-.01.01-.03.02-.04.03-.03.02-.06.05-.09.07s-.07.05-.11.08c-.02.01-.04.03-.06.04-.04.03-.08.05-.12.08s-.08.05-.12.08c-.02.01-.03.02-.05.03s-.05.03-.08.04c-.07.04-.13.08-.2.12-.18.11-.38.21-.58.32-.1.05-.21.11-.31.16-.59.3-1.15.58-1.44.71-.03.01-.05.02-.07.03-.02 0-.03.01-.04.02-.01 0-.02.01-.03.01a.1.1 0 0 0-.04.02c-2.87-2.1-5-2.66-5-2.66s.04-2.83-.7-5.22c2.4-.97 3.89-2 3.89-2s2.78.68 4.92 3.07c0 0 .44 1.85.44 4.73Z" class="cls-7"/><path d="m103.87 60.98-.04.05-2.58 3.34c-.06.08-.14.15-.22.21-.01.01-.03.02-.05.03-.05.03-.1.06-.15.08-2.48 1.05-6.06.42-6.06.42-1.26-1.13-2.58-2.97-2.58-2.97.48.03 3.26-3.78 3.26-3.78 2.48.26 6.09-.49 6.09-.49s1.31 1.7 2.34 3.1Z" class="cls-7"/><path d="M101.53 57.89s-3.61.75-6.09.49c-.59-.91-2-4.8-2-4.8 1.36-2.2 4.08-3.93 4.08-3.93s2.13.56 5 2.66c0 0 .27 2.03-.99 5.58Z" class="cls-8"/><path d="M108.7 53.28s-.07 3.39-1.75 5.8c-.47.68-3.04 1.91-3.12 1.95l.04-.05c-1.03-1.4-2.34-3.1-2.34-3.1 1.26-3.54.99-5.58.99-5.58s.01 0 .04-.02c0 0 .02 0 .03-.01.01 0 .03-.01.04-.02.02-.01.05-.02.07-.03.28-.13.85-.41 1.44-.71.1-.05.21-.11.31-.16.2-.11.39-.21.58-.32.07-.04.14-.08.2-.12.03-.01.05-.03.08-.04.02 0 .03-.02.05-.03.04-.03.08-.05.12-.08s.08-.05.12-.08c.02-.01.04-.03.06-.04l.11-.08c.04-.03.06-.05.09-.07.01-.01.03-.02.04-.03.02-.02.04-.03.05-.05s.03-.03.04-.05c0 0 .02-.02.02-.03 0 0 .01-.02.02-.03 0 0 0-.02.01-.03v-.02l.01.02s.01.02.02.03c0 .01.02.02.03.04.01.01.03.03.04.05.01.01.02.03.04.05l.01.01c.01.02.03.03.04.05.02.02.04.05.06.08.02.02.04.05.06.07.13.16.3.36.49.59.04.05.08.09.12.14.14.17.29.35.45.53.06.07.12.15.19.22.02.02.04.04.06.07.05.06.1.11.15.17.19.22.38.43.56.63.07.07.13.15.2.21.02.02.03.04.05.05l.05.05Z" class="cls-7"/><g class="cls-1"><path d="M103.32 42.06c-.99-.03-1.92-.02-2.79.04-2.48.16-4.55.67-6.26 1.42-2.96 1.29-4.9 3.31-6.15 5.54-1.1 1.95-1.67 4.06-1.94 5.98-.08.57-.14 1.13-.18 1.66-.12 1.65-.04 3.06.04 3.94a12.97 12.97 0 0 0 10.73 5.66c7.18 0 13-5.82 13-13 0-4.79-2.59-8.97-6.44-11.22Z" class="cls-4"/></g><path d="M109.62 51.42c-.19-1.36-.6-2.65-1.18-3.83-.19 1.65-.47 3.14-.83 4.48-.98 3.64-2.56 6.22-4.4 8.03-2.9 2.86-6.48 3.81-9.45 4.02-1.81.12-3.4-.03-4.48-.19 1.08.76 2.28 1.36 3.57 1.77 1.24.39 2.55.6 3.92.6 2.08 0 4.04-.49 5.79-1.36 1.84-.92 3.43-2.26 4.65-3.89 1.61-2.16 2.57-4.85 2.57-7.75 0-.63-.05-1.26-.13-1.86Z" class="cls-3"/><path d="M23.07 40.89s-.65 1.15-.85 2.23c0 0-2.53 1.7-4.19 4.04 0 0-1.58-.02-2.83.65 1.53-3.28 4.38-5.82 7.87-6.92Z" class="cls-7"/><path d="M30.94 42.43s-1.49 1.02-3.89 2c0 0-2.69-1.22-4.83-1.31.19-1.07.85-2.23.85-2.23 1.24-.39 2.55-.6 3.92-.6.86 0 1.71.08 2.52.25.95.93 1.43 1.9 1.43 1.9Z" class="cls-8"/><path d="M37.56 45.71c-.64-.13-1.69-.22-1.69-.22-2.14-2.39-4.92-3.07-4.92-3.07s-.48-.97-1.43-1.9c3.3.65 6.16 2.55 8.05 5.18Z" class="cls-7"/><path d="M18.61 52.07s-1.61 2.49-2.73 3.46c-.94-.66-1.83-1.86-1.9-1.95v-.3c0-1.96.43-3.82 1.21-5.48 1.26-.67 2.83-.65 2.83-.65s.49 2.39.58 4.92Z" class="cls-8"/><path d="M27.75 49.65s-2.72 1.73-4.08 3.93c-.74-.45-5.06-1.5-5.06-1.5-.1-2.53-.58-4.92-.58-4.92 1.66-2.34 4.19-4.04 4.19-4.04 2.14.1 4.83 1.31 4.83 1.31.74 2.39.7 5.22.7 5.22Z" class="cls-7"/><path d="M39.85 51.42c-.42.42-.92 1.86-.92 1.86l-.05-.05-.05-.05c-.06-.07-.13-.14-.2-.21-.18-.2-.37-.41-.56-.63-.05-.06-.1-.11-.15-.17-.02-.02-.04-.05-.06-.07l-.19-.22c-.15-.18-.31-.36-.45-.53-.04-.05-.08-.1-.12-.14-.19-.23-.36-.43-.49-.59-.02-.02-.04-.05-.06-.07-.02-.03-.04-.05-.06-.08-.01-.02-.03-.04-.04-.05 0 0 0-.01-.01-.01-.01-.02-.03-.03-.04-.05s-.03-.03-.04-.05c-.01-.01-.02-.03-.03-.04 0-.01-.02-.02-.02-.03 0 0-.01-.01-.01-.02 0-2.88-.44-4.73-.44-4.73s1.05.09 1.69.22c1.19 1.66 2 3.6 2.3 5.71Z" class="cls-8"/><path d="M18.03 60.8s-.4.63-.54 1.36a12.98 12.98 0 0 1-3.5-8.58c.07.09.96 1.3 1.9 1.95 0 0 .73 3.02 2.14 5.26Zm19.39.24c.15-.88-.25-1.95-.25-1.95 1.69-2.41 1.75-5.8 1.75-5.8s.5-1.44.92-1.86c.09.61.13 1.23.13 1.86 0 2.9-.95 5.59-2.56 7.75Z" class="cls-7"/><path d="M25 65.13s-1.03.47-1.93.55c-2.16-.68-4.07-1.91-5.58-3.52.14-.73.54-1.36.54-1.36s1.89 1.21 4.38 1.36c0 0 1.32 1.84 2.58 2.97Zm12.42-4.09a13 13 0 0 1-4.65 3.89c-.7 0-1.49-.29-1.49-.29h-.08s.03-.03.05-.04c.08-.06.16-.13.22-.21l2.58-3.34c.08-.04 2.65-1.27 3.12-1.95 0 0 .39 1.07.25 1.95Z" class="cls-8"/><path d="M32.77 64.93c-1.74.87-3.71 1.36-5.79 1.36-1.36 0-2.68-.21-3.92-.6.9-.08 1.93-.55 1.93-.55s3.58.64 6.06-.42c.05-.02.1-.05.15-.08h.08s.79.29 1.49.3Zm-7.1-6.55s-2.78 3.81-3.26 3.78c-2.49-.15-4.38-1.36-4.38-1.36-1.41-2.24-2.14-5.26-2.14-5.26 1.12-.97 2.73-3.46 2.73-3.46s4.32 1.06 5.06 1.5c0 0 1.41 3.89 2 4.8Zm10.63-8.16v.04s0 .02-.01.03c0 0-.01.02-.02.03 0 0-.01.02-.02.03s-.03.03-.04.05-.03.03-.05.05c-.01.01-.03.02-.04.03-.03.02-.06.05-.09.07s-.07.05-.11.08c-.02.01-.04.03-.06.04-.04.03-.08.05-.12.08s-.08.05-.12.08c-.02.01-.03.02-.05.03s-.05.03-.08.04c-.07.04-.13.08-.2.12-.18.11-.38.21-.58.32-.1.05-.21.11-.31.16-.59.3-1.15.58-1.44.71-.03.01-.05.02-.07.03-.02 0-.03.01-.04.02-.01 0-.02.01-.03.01a.1.1 0 0 0-.04.02c-2.87-2.1-5-2.66-5-2.66s.04-2.83-.7-5.22c2.4-.97 3.89-2 3.89-2s2.78.68 4.92 3.07c0 0 .44 1.85.44 4.73Z" class="cls-7"/><path d="m34.1 60.98-.04.05-2.58 3.34c-.06.08-.14.15-.22.21-.01.01-.03.02-.05.03-.05.03-.1.06-.15.08-2.48 1.05-6.06.42-6.06.42-1.26-1.13-2.58-2.97-2.58-2.97.48.03 3.26-3.78 3.26-3.78 2.48.26 6.09-.49 6.09-.49s1.31 1.7 2.34 3.1Z" class="cls-7"/><path d="M31.76 57.89s-3.61.75-6.09.49c-.59-.91-2-4.8-2-4.8 1.36-2.2 4.08-3.93 4.08-3.93s2.13.56 5 2.66c0 0 .27 2.03-.99 5.58Z" class="cls-8"/><path d="M38.93 53.28s-.07 3.39-1.75 5.8c-.47.68-3.04 1.91-3.12 1.95l.04-.05c-1.03-1.4-2.34-3.1-2.34-3.1 1.26-3.54.99-5.58.99-5.58s.01 0 .04-.02c0 0 .02 0 .03-.01.01 0 .03-.01.04-.02.02-.01.05-.02.07-.03.28-.13.85-.41 1.44-.71.1-.05.21-.11.31-.16.2-.11.39-.21.58-.32.07-.04.14-.08.2-.12.03-.01.05-.03.08-.04.02 0 .03-.02.05-.03.04-.03.08-.05.12-.08s.08-.05.12-.08c.02-.01.04-.03.06-.04l.11-.08c.04-.03.06-.05.09-.07.01-.01.03-.02.04-.03.02-.02.04-.03.05-.05s.03-.03.04-.05c0 0 .02-.02.02-.03 0 0 .01-.02.02-.03 0 0 0-.02.01-.03v-.02l.01.02s.01.02.02.03c0 .01.02.02.03.04.01.01.03.03.04.05.01.01.02.03.04.05l.01.01c.01.02.03.03.04.05.02.02.04.05.06.08.02.02.04.05.06.07.13.16.3.36.49.59.04.05.08.09.12.14.14.17.29.35.45.53.06.07.12.15.19.22.02.02.04.04.06.07.05.06.1.11.15.17.19.22.38.43.56.63.07.07.13.15.2.21.02.02.03.04.05.05l.05.05Z" class="cls-7"/><g class="cls-1"><path d="M33.55 42.06c-.99-.03-1.92-.02-2.79.04-2.48.16-4.55.67-6.26 1.42-2.96 1.29-4.9 3.31-6.15 5.54-1.1 1.95-1.67 4.06-1.94 5.98-.08.57-.14 1.13-.18 1.66-.12 1.65-.04 3.06.04 3.94A12.97 12.97 0 0 0 27 66.3c7.18 0 13-5.82 13-13 0-4.79-2.59-8.97-6.44-11.22Z" class="cls-4"/></g><path d="M39.85 51.42c-.19-1.36-.6-2.65-1.18-3.83-.19 1.65-.47 3.14-.83 4.48-.98 3.64-2.56 6.22-4.4 8.03-2.9 2.86-6.48 3.81-9.45 4.02-1.81.12-3.4-.03-4.48-.19 1.08.76 2.28 1.36 3.57 1.77 1.24.39 2.55.6 3.92.6 2.08 0 4.04-.49 5.79-1.36 1.84-.92 3.43-2.26 4.65-3.89 1.61-2.16 2.57-4.85 2.57-7.75 0-.63-.05-1.26-.13-1.86Z" class="cls-3"/><path d="M92.84 13.97s-.65 1.15-.85 2.23c0 0-2.53 1.7-4.19 4.04 0 0-1.58-.02-2.83.65 1.53-3.28 4.38-5.82 7.87-6.92Z" class="cls-7"/><path d="M100.71 15.51s-1.49 1.02-3.89 2c0 0-2.69-1.22-4.83-1.31.19-1.07.85-2.23.85-2.23 1.24-.39 2.55-.6 3.92-.6.86 0 1.71.08 2.52.25.95.93 1.43 1.9 1.43 1.9Z" class="cls-8"/><path d="M107.33 18.8c-.64-.13-1.69-.22-1.69-.22-2.14-2.39-4.92-3.07-4.92-3.07s-.48-.97-1.43-1.9c3.3.65 6.16 2.55 8.05 5.18Z" class="cls-7"/><path d="M88.39 25.16s-1.61 2.49-2.73 3.46c-.94-.66-1.83-1.86-1.9-1.95v-.3c0-1.96.43-3.82 1.21-5.48 1.26-.67 2.83-.65 2.83-.65s.49 2.39.58 4.92Z" class="cls-8"/><path d="M97.52 22.73s-2.72 1.73-4.08 3.93c-.74-.45-5.06-1.5-5.06-1.5-.1-2.53-.58-4.92-.58-4.92 1.66-2.34 4.19-4.04 4.19-4.04 2.14.1 4.83 1.31 4.83 1.31.74 2.39.7 5.22.7 5.22Z" class="cls-7"/><path d="M109.62 24.5c-.42.42-.92 1.86-.92 1.86l-.05-.05-.05-.05c-.06-.07-.13-.14-.2-.21-.18-.2-.37-.41-.56-.63-.05-.06-.1-.11-.15-.17-.02-.02-.04-.05-.06-.07l-.19-.22c-.15-.18-.31-.36-.45-.53-.04-.05-.08-.1-.12-.14-.19-.23-.36-.43-.49-.59-.02-.02-.04-.05-.06-.07-.02-.03-.04-.05-.06-.08-.01-.02-.03-.04-.04-.05 0 0 0-.01-.01-.01-.01-.02-.03-.03-.04-.05s-.03-.03-.04-.05c-.01-.01-.02-.03-.03-.04 0-.01-.02-.02-.02-.03 0 0-.01-.01-.01-.02 0-2.88-.44-4.73-.44-4.73s1.05.09 1.69.22c1.19 1.66 2 3.6 2.3 5.71Z" class="cls-8"/><path d="M87.8 33.88s-.4.63-.54 1.36a12.98 12.98 0 0 1-3.5-8.58c.07.09.96 1.3 1.9 1.95 0 0 .73 3.02 2.14 5.26Zm19.39.24c.15-.88-.25-1.95-.25-1.95 1.69-2.41 1.75-5.8 1.75-5.8s.5-1.44.92-1.86c.09.61.13 1.23.13 1.86 0 2.9-.95 5.59-2.56 7.75Z" class="cls-7"/><path d="M94.77 38.21s-1.03.47-1.93.55c-2.16-.68-4.07-1.91-5.58-3.52.14-.73.54-1.36.54-1.36s1.89 1.21 4.38 1.36c0 0 1.32 1.84 2.58 2.97Zm12.42-4.09a13 13 0 0 1-4.65 3.89c-.7 0-1.49-.29-1.49-.29h-.08s.03-.03.05-.04c.08-.06.16-.13.22-.21l2.58-3.34c.08-.04 2.65-1.27 3.12-1.95 0 0 .39 1.07.25 1.95Z" class="cls-8"/><path d="M102.54 38.01c-1.74.87-3.71 1.36-5.79 1.36-1.36 0-2.68-.21-3.92-.6.9-.08 1.93-.55 1.93-.55s3.58.64 6.06-.42c.05-.02.1-.05.15-.08h.08s.79.29 1.49.3Zm-7.1-6.55s-2.78 3.81-3.26 3.78c-2.49-.15-4.38-1.36-4.38-1.36-1.41-2.24-2.14-5.26-2.14-5.26 1.12-.97 2.73-3.46 2.73-3.46s4.32 1.06 5.06 1.5c0 0 1.41 3.89 2 4.8Zm10.63-8.15v.04s0 .02-.01.03c0 0-.01.02-.02.03 0 0-.01.02-.02.03s-.03.03-.04.05-.03.03-.05.05c-.01.01-.03.02-.04.03-.03.02-.06.05-.09.07s-.07.05-.11.08c-.02.01-.04.03-.06.04-.04.03-.08.05-.12.08s-.08.05-.12.08c-.02.01-.03.02-.05.03s-.05.03-.08.04c-.07.04-.13.08-.2.12-.18.11-.38.21-.58.32-.1.05-.21.11-.31.16-.59.3-1.15.58-1.44.71-.03.01-.05.02-.07.03-.02 0-.03.01-.04.02-.01 0-.02.01-.03.01a.1.1 0 0 0-.04.02c-2.87-2.1-5-2.66-5-2.66s.04-2.83-.7-5.22c2.4-.97 3.89-2 3.89-2s2.78.68 4.92 3.07c0 0 .44 1.85.44 4.73Z" class="cls-7"/><path d="m103.87 34.07-.04.05-2.58 3.34c-.06.08-.14.15-.22.21-.01.01-.03.02-.05.03-.05.03-.1.06-.15.08-2.48 1.05-6.06.42-6.06.42-1.26-1.13-2.58-2.97-2.58-2.97.48.03 3.26-3.78 3.26-3.78 2.48.26 6.09-.49 6.09-.49s1.31 1.7 2.34 3.1Z" class="cls-7"/><path d="M101.53 30.97s-3.61.75-6.09.49c-.59-.91-2-4.8-2-4.8 1.36-2.2 4.08-3.93 4.08-3.93s2.13.56 5 2.66c0 0 .27 2.03-.99 5.58Z" class="cls-8"/><path d="M108.7 26.37s-.07 3.39-1.75 5.8c-.47.68-3.04 1.91-3.12 1.95l.04-.05c-1.03-1.4-2.34-3.1-2.34-3.1 1.26-3.54.99-5.58.99-5.58s.01 0 .04-.02c0 0 .02 0 .03-.01.01 0 .03-.01.04-.02.02-.01.05-.02.07-.03.28-.13.85-.41 1.44-.71.1-.05.21-.11.31-.16.2-.11.39-.21.58-.32.07-.04.14-.08.2-.12.03-.01.05-.03.08-.04.02 0 .03-.02.05-.03.04-.03.08-.05.12-.08s.08-.05.12-.08c.02-.01.04-.03.06-.04l.11-.08c.04-.03.06-.05.09-.07.01-.01.03-.02.04-.03.02-.02.04-.03.05-.05s.03-.03.04-.05c0 0 .02-.02.02-.03 0 0 .01-.02.02-.03 0 0 0-.02.01-.03v-.02l.01.02s.01.02.02.03c0 .01.02.02.03.04.01.01.03.03.04.05.01.01.02.03.04.05l.01.01c.01.02.03.03.04.05.02.02.04.05.06.08.02.02.04.05.06.07.13.16.3.36.49.59.04.05.08.09.12.14.14.17.29.35.45.53.06.07.12.15.19.22.02.02.04.04.06.07.05.06.1.11.15.17.19.22.38.43.56.63.07.07.13.15.2.21.02.02.03.04.05.05l.05.05Z" class="cls-7"/><g class="cls-1"><path d="M103.32 15.14c-.99-.03-1.92-.02-2.79.04-2.48.16-4.55.67-6.26 1.42-2.96 1.29-4.9 3.31-6.15 5.54-1.1 1.95-1.67 4.06-1.94 5.98-.08.57-.14 1.13-.18 1.66-.12 1.65-.04 3.06.04 3.94a12.97 12.97 0 0 0 10.73 5.66c7.18 0 13-5.82 13-13 0-4.79-2.59-8.97-6.44-11.22Z" class="cls-4"/></g><path d="M109.62 24.5c-.19-1.36-.6-2.65-1.18-3.83-.19 1.65-.47 3.14-.83 4.48-.98 3.64-2.56 6.22-4.4 8.03-2.9 2.86-6.48 3.81-9.45 4.02-1.81.12-3.4-.03-4.48-.19 1.08.76 2.28 1.36 3.57 1.77 1.24.39 2.55.6 3.92.6 2.08 0 4.04-.49 5.79-1.36 1.84-.92 3.43-2.26 4.65-3.89 1.61-2.16 2.57-4.85 2.57-7.75 0-.63-.05-1.26-.13-1.86Z" class="cls-3"/></svg>')}`;
export default image;