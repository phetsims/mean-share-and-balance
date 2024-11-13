/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" width="46.36" height="2.88" viewBox="0 0 46.36 2.88"><defs><style>.cls-1{fill:#690cff;stroke-width:0}</style></defs><path d="M45.31.22c.05-.03.02-.02 0 0M26.79.4c.21.22-.34.29-.03.54-.03-.1.29-.39.03-.54m-.02.54.03.03zM40.66.37s.03.08.05.11c0-.03-.01-.06-.05-.11m3.47.36L44.04.7s.06.03.09.03M38.87.72s-.06-.05-.13-.02c0 .01.01.02.02.03.02-.03.05-.05.11-.01m-1.88.01s.02.03.03.05c.02 0 .04 0 .06-.01zM.76 2.49a1 1 0 0 1-.09-.22c.03.18-.25.24.09.22m38.03.21-.3-.04c.08.02.19.04.3.04m-24.6-.24-.07.03s.05 0 .07-.03m23.42.24a.4.4 0 0 0-.17-.17c-.01.02-.03.04-.03.06zM4.55.7s-.02.02-.04.02c.02.02.04.04.05.06.01-.03.02-.05.03-.08h-.05Zm9.02 1.88v-.06l-.05.05zM44.2 2.4s-.03 0-.04.01c-.09.05-.03.03.04-.01m-5.38.3h-.03zM37.33.5l.04.28c.1-.05.12-.37-.04-.28m-5.57.29c-.06-.14-.22-.23-.31-.09.13.02.25.13.31.09M15.05.33l.11-.09-.21.08zM4.71.37s-.03.08-.03.13c0-.01 0-.02.01-.03q.09-.03.15-.03C4.83.39 4.8.34 4.71.38Zm1 1.55c-.06 0-.08.08-.06.17h.24c-.08-.07-.21-.12-.18-.18Zm-.38.19c-.07 0-.11.01-.14.01.03 0 .08 0 .14-.01M7.97.77h.06Q8 .74 7.97.77" class="cls-1"/><path d="m45.93.2.16-.09c-.1.05-.17.05-.25.05l.09.21c-.09-.04-.17-.04-.17-.13-.1.14.07.35-.12.54-.12-.11-.38.12-.42-.17.39.1-.04-.28.29-.33q-.09.045-.24 0c-.01-.03.01-.06.04-.07-.38-.25-.17.32-.56.31.05-.16-.09-.3-.15-.27.16 0 .07.26-.07.38-.25-.12-.27.09-.4.08l.15.06c-.05.16-.18.14-.35.19-.01-.12.16-.08.1-.14-.19.28-.44-.29-.71-.1-.12-.11-.01-.3-.12-.37-.3.2-.33-.22-.64-.05.09.21.11.16-.12.37l.52-.15-.33.31c.16 0 .33-.13.43-.1-.16.17-.14.12-.07.3-.22-.32-.43.19-.68-.03V.49c-.37-.23-.66.27-1.14.14l.16.09c-.07.21-.3.03-.46.11.01-.18-.08-.24-.15-.35 0 .13-.36-.01-.4.34L40.1.59c-.39-.09-.45.5-.82.44.11-.19-.06-.32.19-.45-.13 0-.24-.03-.24.09-.07-.11-.35.24-.46.07-.05.08-.07.26-.21.25-.02-.04 0-.09 0-.09 0 .09-.22.12-.1.31-.39-.55-1.08.04-1.42-.43-.27.06-.61.12-.86.13.02-.05 0-.09.05-.07-.34-.16-.21.5-.6.32-.2-.28.21-.15.08-.26-.05-.58-.47.08-.74-.26l.06-.03c-.2-.2-.49.22-.82.18 0 0 .02-.05 0-.09-.22.29-.65.39-.97.47.1-.23.14-.12.08-.35-.14.03.04.37-.24.43-.09-.12-.3-.23-.32-.48h.27c-.14-.33-.35 0-.49-.06l.02-.14c-.41.05-.42.39-.86.37l.05.11c-.24.35-.2-.19-.44.06l-.07-.35c-.16.08-.56.34-.84.41.16-.26.49-.39.7-.55-.16 0-.53.03-.62.2.06-.03.14-.12.21-.07-.19.28-.45.41-.76.41.06-.68-.82-.17-1.04-.7-.55.25-1.1-.11-1.75-.07.23.53-.19.02-.15.56-.15.03-.21.03-.22 0l-.46-.33c-.11-.16.14-.12.13-.24-.33-.04-.14-.23-.36-.38.04.19-.11.28-.3.2l.26.25c-.46.29-.4-.46-.86-.17l.15-.17c-.24.1-.88 0-1.11.43-.04-.06-.1-.21 0-.25-.57-.07-1.27.47-1.71.2l.04-.13c-.11.04-.18.25-.32.12 0-.05.04-.13 0-.14-.06.05-.28.23-.42.16l.12-.15c-.56-.17-.85.36-1.32.46 0-.39-.44-.52-.65-.58V.17c-.64-.05-1.09.32-1.69.48-.37-.43-1.26-.18-1.86-.42.09.07-.01.31-.12.34-.14-.08-.39.27-.37-.09h.05c-.11-.35-.39-.25-.62-.26l-.04.47c-.59-.68-1.54.25-1.86-.36-.14.12-.32.12-.46.23V.31c-.39-.06-.58-.1-1.07-.04l.1-.18c-.27-.02-.35.73-.6.74l-.08-.38c-.48 0-.96-.32-1.44.02 0-.06.02-.16.1-.18-.23 0-.87-.25-.79.26 0-.34-.49-.03-.75.12L8.5.42c-.22.32-.22.4-.53.49-.05-.02-.06-.12-.02-.14-.17-.03-.16.23-.42.11l.11-.16c-.25-.02-.23.07-.36.25-.16.1-.47-.06-.51-.29-.03.14-.17.32-.31.26-.02-.08.03-.14.06-.16-.41-.17-.61.29-.9.04 0-.08-.02-.12-.05-.15.33 0 .59.02.57.04 0-.23-.27-.27-.05-.58-.21.17-.58.55-.84.44a.3.3 0 0 1-.03-.08l.03-.03c-.06-.02-.11 0-.16.04-.08-.04-.13-.07-.21-.07-.03-.19-.3-.1-.44-.11.01.25-.16.21 0 .42-.02-.02.03-.03.11-.04q.03 0 .06-.03v.02c.09 0 .2-.01.33-.02-.1.13-.21.23-.36.1-.07.16-.14.33-.18.4-.18-.35-.53-.54-.58-.75-.4.14-.95.09-1.21.56-.11.06-.13-.13-.18-.21.07-.05.15-.04.18-.11-.23.12-.68.05-.74.38-.29-.15.16-.3-.24-.25l.05-.1C1.05.27 0 .39 0 .39v1.79c.22-.03.47.22.64 0 .02.03.03.06.03.08-.04-.16-.05-.33-.04-.45.13 0 .24-.21.28 0-.08 0-.08.08-.12.15l.13-.09c.12.31-.18.11-.18.34.26-.1.56-.36.76-.27.04.3-.46.1-.2.37l-.31-.12c.24.48-.19-.03.03.48.4.09.45-.15.86-.07.09-.17-.03-.25.06-.42.57-.3.45.76.87.36.11-.2.15-.58.45-.38l-.1.34c.39.03.22-.49.63-.26-.07.13-.31.11-.25.15.27.27.19-.19.39-.19l.04.3c.42-.05.88-.27 1.34-.32-.03.09-.1.18 0 .28.58-.15 1.24.04 1.81.22l.21-.26s.09.12.04.17c.22.1.01-.17.12-.27.12-.02.16.15.09.23.39-.22 1.1-.48 1.51-.2l-.08.08c.32.11.36-.54.65-.29l-.06.05c.69.11 1.45-.13 1.98.27.1-.38.68.17.73-.36.39.26.28.35.83.53.15.02.22-.33.4-.38v.27l.25-.29.13.33.17-.07c-.07-.02-.15-.12-.13-.2.27-.12.65.19.66.33l.63-.23c-.01.11-.12.15-.2.22.34-.28.06.29.37.03-.04-.06.02-.16.03-.22.15.17.51.17.77.1l-.05.19c.47.05.99-.09 1.52-.09-.19-.09-.15-.42 0-.45l.06.29c.1-.18-.16-.11.04-.33.2.03.13.33.02.42l.24-.1c.01.09-.04.13-.06.24.1-.18.41.29.56-.02v.09c.54 0 .78-.1 1.21-.11 0-.25.18-.19.3-.4.32.08.67.28 1.05.26.27-.12.08-.21.2-.36.02.23.4.21.2.37.46-.04.58-.05 1.16-.23-.06-.09-.13-.13-.1-.21.1-.04.24.1.22.21l-.03.02c.65-.34 1.5.66 2.01.19l-.03.02.54-.25c.25.04-.15.17.03.31.58-.38.91.05 1.39-.2.37.67 1.31-.05 1.8.38l-.03-.16c.13-.16.16.09.25.13-.01-.12-.14-.14-.06-.23 1.09-.19 2.25.23 3.36.37.41.04.23-.82.75-.44l-.15.29c.82-.35 1.68.01 2.49-.29-.05.07-.05.16-.13.15.17.21.63.01.63-.16.13.02.03.16.11.25.17.13.43-.27.52-.06.02.03-.05.07-.08.09.11-.1.52.03.41-.22.3.12.58-.11.82.04.16-.28.52.13.57-.26-.02.4.53.32.72.14-.06.12.17.13.09.29.22 0 .42-.08.38-.29.4.48.81-.39 1.03.23.65-.22 1.25-.36 1.83-.46-.02.4-.64.04-.62.46.55-.17.87-.51 1.42-.41.14.05-.08.17-.13.24.55-.17 1.07.04 1.56-.18 0 .04-.05.08-.1.11.1-.01.23.06.21-.12l-.09.05c-.15-.26.38-.55.4-.69-.16.52.49.13.22.79.06-.03.14-.12.13-.24.09.04.12.11.03.25.35-.1.22-.29.54-.29 0 .09-.06.12-.1.23.16-.17.32-.34.59-.27-.02.05.3.09.22.09V.39c-.3.2-.24-.15-.41-.19ZM4.69.46s0 .02-.01.03c0-.05.02-.09.03-.13.09-.04.12.01.13.06q-.06 0-.15.03Zm.64 1.65c-.06 0-.11.01-.14.01.03 0 .07 0 .14-.02Zm.32-.02c-.02-.09 0-.18.06-.17-.03.06.1.11.18.18-.07 0-.15-.01-.24 0Z" class="cls-1"/></svg>')}`;
export default image;