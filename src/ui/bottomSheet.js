/**
 * Detect whether pure-web-bottom-sheet is usable (Chrome/Edge 121+, FF 123+, Safari/iOS 18.2+).
 * @returns {boolean}
 */
export function supportsNativeBottomSheet() {
  try {
    const css = globalThis.CSS;
    if (!css?.supports?.('animation-timeline', 'scroll()')) {
      return false;
    }
  } catch {
    return false;
  }

  const ua = navigator.userAgent || '';
  const safari = ua.match(/Version\/(\d+)\.(\d+).*Safari/i);
  if (safari && !/Chrome|CriOS|Edg|Chromium/i.test(ua)) {
    const major = Number(safari[1]);
    const minor = Number(safari[2]);
    if (major < 18 || (major === 18 && minor < 2)) return false;
  }
  const ios = ua.match(/OS (\d+)_(\d+)/i);
  if (ios && /iPhone|iPad|iPod/i.test(ua)) {
    const major = Number(ios[1]);
    const minor = Number(ios[2]);
    if (major < 18 || (major === 18 && minor < 2)) return false;
  }
  return true;
}

function isDesktop() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(min-width: 768px)').matches;
}

/**
 * @param {HTMLElement} content
 */
function mountDesktopRail(mountParent, content) {
  document.documentElement.classList.remove('sheet-fallback');
  const host = document.createElement('aside');
  host.className = 'config-rail';
  host.setAttribute('role', 'region');
  host.setAttribute('aria-label', 'Configuration');
  host.append(content);
  mountParent.append(host);
  return { host, content, mode: /** @type {const} */ ('desktop') };
}

/**
 * Mount config host: desktop rail, native bottom-sheet, or CSS scroll-snap fallback.
 * @param {HTMLElement} mountParent
 * @param {{ useNative?: boolean, forceDesktop?: boolean }} [opts]
 */
export async function mountBottomSheet(mountParent, opts = {}) {
  const content = document.createElement('div');
  content.className = 'config-panel__body';

  if (opts.forceDesktop ?? isDesktop()) {
    return mountDesktopRail(mountParent, content);
  }

  const useNative = opts.useNative ?? supportsNativeBottomSheet();

  if (useNative) {
    document.documentElement.classList.remove('sheet-fallback');
    const { registerSheetElements } = await import('pure-web-bottom-sheet');
    registerSheetElements();

    const sheet = document.createElement('bottom-sheet');
    sheet.className = 'config-sheet';
    sheet.tabIndex = 0;
    sheet.setAttribute('aria-label', 'Configuration');

    const snap90 = document.createElement('div');
    snap90.slot = 'snap';
    snap90.style.setProperty('--snap', '90%');

    const snap55 = document.createElement('div');
    snap55.slot = 'snap';
    snap55.style.setProperty('--snap', '55%');

    const snap25 = document.createElement('div');
    snap25.slot = 'snap';
    snap25.style.setProperty('--snap', '25%');
    snap25.className = 'initial';

    sheet.append(snap90, snap55, snap25, content);
    mountParent.append(sheet);

    return { host: sheet, content, mode: /** @type {const} */ ('native') };
  }

  document.documentElement.classList.add('sheet-fallback');

  const host = document.createElement('div');
  host.className = 'config-sheet config-sheet--fallback';
  host.setAttribute('role', 'region');
  host.setAttribute('aria-label', 'Configuration');

  const scroller = document.createElement('div');
  scroller.className = 'config-sheet__scroller';

  const spacer = document.createElement('div');
  spacer.className = 'config-sheet__snap config-sheet__snap--peek';
  spacer.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('div');
  panel.className = 'config-sheet__panel';

  const grabber = document.createElement('div');
  grabber.className = 'config-sheet__handle';
  grabber.innerHTML = '<span class="config-sheet__grabber" aria-hidden="true"></span>';

  panel.append(grabber, content);
  scroller.append(spacer, panel);
  host.append(scroller);
  mountParent.append(host);

  requestAnimationFrame(() => {
    scroller.scrollTop = spacer.offsetHeight;
  });

  return { host, content, mode: /** @type {const} */ ('fallback') };
}
