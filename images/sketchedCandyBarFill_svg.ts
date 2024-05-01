/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="45.71" height="12.33" viewBox="0 0 45.71 12.33"><path d="m45.71 10.56-.44 1.34c-.05.15-.03.3.04.43h.4zm-28.52 1.77 1.77-2.76v-.02l-1.27 2.58c-.03.07-.04.13-.05.2h1.33l1.07-1.72-.17.36c-.17.35 0 .67.26.81.23.12.57.11.76-.22l1.2-2.02-1.23 2.69s-.02.07-.02.11h1.32l1.29-2.35-.86 2.11c-.03.08-.04.17-.03.25h1.22l1.2-2.46-.83 2.31c-.02.05-.02.1-.02.16h1.26l.31-.61c-.03.22.09.44.32.55.25.12.62.09.79-.21l1.36-2.43-1.11 2.62s-.01.05-.02.08h1.32l.61-1.06-.29.62a.62.62 0 0 0-.03.44h1.14l2.05-3.56-1.39 3.18a.56.56 0 0 0-.03.38h1.18l2.14-3.91-1.49 3.89v.01h1.32l1.51-2.88-1.01 2.6a.42.42 0 0 0-.02.27h1.2l1.62-3.15-1 2.65c-.07.18-.03.36.08.5h.97s.02-.02.03-.04l.5-.99-.31.79q-.045.12-.03.24h1.22l1.05-2.2-.57 1.61c-.09.24 0 .46.17.6h.81s.08-.08.1-.14l.15-.33c-.05.17-.01.33.08.47h.98l.03-.03 1.46-2.88-.88 2.42c-.07.19-.02.36.08.49h.98l.03-.03 1.59-3.22-1.02 2.88a.52.52 0 0 0 .01.37h1.12l1.2-2.41V.69l-1.38 2.72 1.04-2.9c.07-.2.01-.37-.1-.51h-.95s-.03.03-.04.05l-.15.33.14-.38H41.8l-.69 1.38.52-1.38h-1.36l-1.04 2.02.67-1.74a.45.45 0 0 0 .02-.28h-1.2l-1.83 3.48L37.93.76c.1-.27-.02-.56-.3-.69-.26-.12-.61-.08-.78.22l-.11.2.23-.49h-1.42l-.25.44.18-.39s0-.03.01-.04h-1.35l-2.32 4.01L33.36.36c.05-.12.05-.24.01-.35h-1.16l-1.76 3.14L31.73 0h-1.37l-1.9 3.72L29.8 0h-1.33l-.23.46a.6.6 0 0 0-.32-.18.54.54 0 0 0-.31 0l.13-.28h-1.38l-.51.87a.6.6 0 0 0-.3-.37.56.56 0 0 0-.77.21l-.48.77.5-1.01a.63.63 0 0 0 .04-.46H23.7l-2.08 3.24L23.06.39c.07-.13.07-.26.05-.38h-1.22l-.81 1.23.14-.26c.18-.33.03-.65-.22-.79a.58.58 0 0 0-.81.19l-1.22 1.86.99-1.94q.075-.15.06-.3h-1.28l-1.25 1.97.88-1.75c.04-.07.05-.14.06-.21H17.1l-1.24 1.94.67-1.32c.12-.24.07-.46-.05-.63h-.94l-.03.03-.56.89a.56.56 0 0 0-.27-.23.576.576 0 0 0-.73.22l-1.01 1.46L14.18.15c.03-.05.04-.1.05-.15h-1.37l-.41.6a.6.6 0 0 0-.36-.16.58.58 0 0 0-.44.12.6.6 0 0 0-.11-.2.7.7 0 0 0-.37-.21l.04-.07s.02-.06.03-.08H9.81l-.77 1.07L9.69 0H8.2L5.71 3.33 7.67 0h-1.5L4.46 2.28 5.86 0H4.38L2.25 2.79 3.89 0H2.41L.65 2.38 1.83.17c.03-.06.04-.12.05-.17H.46L0 .58v9.64l1.27-1.7L0 10.67v1.66h.45l2.44-3.27-1.78 2.98c-.06.1-.08.2-.08.29h1.33l.39-.55-.09.14c-.09.14-.1.28-.07.4h1.23l.31-.45c.08.1.19.17.32.21.1.03.2.03.29.01-.04.08-.05.15-.06.23H6l.62-.92-.35.64a.6.6 0 0 0-.07.28h1.31l1.44-2.09-.43.81c-.18.33-.02.65.22.79.25.14.6.12.8-.19l.19-.29-.5.98h1.45l1.35-2.13-.85 1.68c-.08.16-.08.31-.04.45h1.16l.97-1.53-.42.83c-.14.28-.05.53.11.7h2.2l2.34-3.54-1.78 3.54h1.46Z" style="fill:#6b3e18;stroke-width:0"/></svg>')}`;
export default image;