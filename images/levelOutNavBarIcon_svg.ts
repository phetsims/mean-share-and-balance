/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="147" height="100" viewBox="0 0 147 100"><defs><style>.cls-1{fill:#fff;opacity:.4}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-8{stroke-width:0}.cls-9{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:.3px}.cls-2{fill:#f2f6f7}.cls-3{fill:#9acee3}.cls-4{fill:#a3d7f0}.cls-5{fill:#b2e3f7}.cls-8{fill:#ebf0f2}</style></defs><path d="M0 0h147v100H0z" style="stroke-width:0;fill:#fff9f0"/><path d="M117.6 40.8c0 3.9-7.3 7.1-16.4 7.1s-16.4-3.2-16.4-7.1 7.3-7.1 16.4-7.1 16.4 3.2 16.4 7.1" class="cls-2"/><path d="M117.6 40.8v49.5c0 3.9-7.3 7.1-16.4 7.1s-16.4-3.2-16.4-7.1V40.8c0 3.9 7.3 7.1 16.4 7.1s16.4-3.2 16.4-7.1" class="cls-8"/><path d="M84.9 73.4v17.1c0 3.9 7.3 7.1 16.3 7.1s16.3-3.2 16.3-7.1V72.6c0-.2-.1-.4-.2-.6v-.5c0-3.9-7.3-7.1-16.3-7.1s-16.3 3.2-16.3 7.1m1.5 16.3.6-.6z" class="cls-4"/><path d="m86.2 87.8.6-.6zm31.3 2.7c-17.6-11.7-32.6 0-32.6 0 0-3.9 7.3-7.1 16.3-7.1s16.3 3.2 16.3 7.1" class="cls-3"/><path d="M101 79.6c-12.2 0-15.3-4.5-16.1-6.8 1.4 3.3 8 5.8 16 5.8s16.3-3.2 16.3-7.1c0 0 1.5 8-16.3 8Z" style="stroke-width:0;fill:#8cc4db"/><path d="M115.5 71.6c0 1.4-1.7 3-6.1 4.8-.7.3 3.2-1.9 3.4-4.8 0-1.5-.8-3.2-3.9-4.9.2 0 6.8 1.9 6.6 4.9" class="cls-5"/><path d="M117.5 40.9c0 3.9-7.3 7.1-16.4 7.1s-16.4-3.2-16.4-7.1 7.3-7.1 16.4-7.1 16.4 3.2 16.4 7.1" class="cls-9"/><path d="M117.5 40.9v49.5c0 3.9-7.3 7.1-16.4 7.1s-16.4-3.2-16.4-7.1V40.9c0 3.9 7.3 7.1 16.4 7.1s16.4-3.2 16.4-7.1" class="cls-9"/><path d="m92.7 93.6-1.9-.7c-.7-.3-1.2-1.1-1.2-2V50.5c0-1 .8-1.7 1.5-1.5l2.2.8c.7.3 1.1 1.1 1.1 2v40.1c0 1.1-.9 2-1.7 1.7" class="cls-1"/><path d="M87.5 35.2c-3.9.4-7.7-6.7-8.6-15.7-.8-9 1.6-16.6 5.5-17s7.7 6.7 8.6 15.7c.8 9-1.6 16.6-5.5 17" class="cls-2"/><path d="m87.5 35.2-49.3 4.6c-3.9.4-7.7-6.7-8.6-15.7-.8-9 1.6-16.6 5.5-17l49.3-4.6c-3.9.4-6.4 8-5.5 17 .8 9 4.7 16 8.6 15.7" class="cls-8"/><path d="M82.6 30.3c-10.4-3.4-11.4-4.9-21.7-12.6-3.4-2.6-11.1-10-15.5-11.4-.4-.1-2.1 0-4.1.2-2.2.2-4.6.5-5.7.6 3.7.3 7.2 7 8 15.6.8 8.7-1.5 16-5.2 16.8h.4c8.5-.8 16.9-1.6 25.4-2.4 4.9-.5 9.8-1 14.6-1.4 4.4-.4 6.3-.5 7.2-.5 1.4 0 0 0 1.9-.6s.6-2.4-5.5-4.4Z" class="cls-5"/><path d="M86.1 35.2c-.9 0-2.8.2-7.2.5-4.9.4-9.8.9-14.6 1.4-8.5.8-16.9 1.6-25.4 2.4h-.4c3.7-.8 6-8.1 5.2-16.8-.8-8.6-4.3-15.3-8-15.6 1.1 0 3.5-.3 5.7-.6.6 3.2 3.4 6 5.4 8.7 3.3 4.7 9.5 9.8 14.7 12.3 7 3.4 19.9 7 24.8 7.7Z" class="cls-4"/><path d="M38.5 39.5h-.4c-3.9.4-7.7-6.6-8.5-15.6S31.2 7.4 35.1 7h.5c3.7.3 7.2 7 8 15.6.8 8.7-1.5 16-5.2 16.8Z" class="cls-3"/><path d="m32.8 15.3.5-2c.2-.7 1-1.3 1.9-1.4l40.2-3.7c1 0 1.8.6 1.6 1.4l-.6 2.2c-.2.7-.9 1.2-1.8 1.3l-39.9 3.7c-1.1.1-2.1-.7-1.8-1.6Z" class="cls-1"/><ellipse cx="86" cy="18.7" class="cls-9" rx="7.1" ry="16.4" transform="rotate(-5.3 86.803 19.174)"/><path d="M38.2 39.6c-3.9.4-7.7-6.7-8.6-15.7s1.6-16.6 5.5-17m.1.1c3.9-.4 7.7 6.7 8.6 15.7s-1.6 16.6-5.5 17M84.5 2.4 35.2 7m3 32.6 49.3-4.5" class="cls-9"/><path d="M88.8 33.8c1.3 1.3 1.2 4.3 1.1 6.4s-2.8-.2-3-1.9-.1-2.4-.6-3.1-.4-.5-1.3-1.2c-1.7-1.4-2.8-3.1-.5-2.8s2.9 1.3 4.3 2.7Z" class="cls-5"/></svg>')}`;
export default image;