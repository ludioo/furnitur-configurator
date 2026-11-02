import { runUiMotion } from './motion.js';

const DURATION_MS = 2500;
const ENTER_S = 0.18;
const EXIT_S = 0.16;

/** @type {HTMLElement | null} */
let host = null;
/** @type {ReturnType<typeof setTimeout> | null} */
let hideTimer = null;
/** @type {number} */
let toastGen = 0;

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
 * @param {HTMLElement} el
 */
async function exitAndRemove(el) {
  try {
    await runUiMotion(
      el,
      {
        opacity: [1, 0],
        transform: ['translateY(0px)', 'translateY(6px)'],
      },
      { duration: EXIT_S },
    );
  } finally {
    el.remove();
  }
}

/**
 * Toast with light enter/exit via motion/mini (skips when reduced-motion).
 * @param {string} message
 */
export function showToast(message) {
  if (!message) return;
  const root = ensureHost();
  const gen = ++toastGen;
  root.replaceChildren();

  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  root.append(el);

  void runUiMotion(
    el,
    {
      opacity: [0, 1],
      transform: ['translateY(8px)', 'translateY(0px)'],
    },
    { duration: ENTER_S },
  );

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    hideTimer = null;
    if (gen !== toastGen) return;
    void exitAndRemove(el).then(() => {
      if (gen === toastGen) {
        /* host may stay empty */
      }
    });
  }, DURATION_MS);
}
