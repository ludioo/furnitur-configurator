const DURATION_MS = 2500;

/** @type {HTMLElement | null} */
let host = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let hideTimer = null;

function ensureHost() {
  if (host) return host;
  host = document.createElement('div');
  host.className = 'toast-host';
  host.setAttribute('aria-live', 'polite');
  host.setAttribute('aria-relevant', 'additions');
  document.body.append(host);
  return host;
}

/**
 * Minimal toast (motion polish in T1.7).
 * @param {string} message
 */
export function showToast(message) {
  if (!message) return;
  const root = ensureHost();
  root.replaceChildren();

  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  root.append(el);

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    el.remove();
    hideTimer = null;
  }, DURATION_MS);
}
