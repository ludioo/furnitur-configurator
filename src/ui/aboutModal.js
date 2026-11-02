import { applyDom } from '../core/i18n.js';
import { iconHtml, icons } from './icons.js';

/**
 * @param {{ onClose?: () => void }} [opts]
 */
export function createAboutModal(opts = {}) {
  const root = document.createElement('div');
  root.className = 'about-modal';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-labelledby', 'about-title');

  root.innerHTML = `
    <div class="about-modal__backdrop" data-about-close></div>
    <div class="about-modal__panel">
      <header class="about-modal__header">
        <h2 id="about-title" data-i18n="about.title"></h2>
        <button type="button" class="about-modal__close" data-about-close data-i18n-aria="about.close">
          ${iconHtml(icons.x, 'icon icon--sm')}
        </button>
      </header>
      <p data-i18n="about.disclaimer"></p>
      <p class="about-modal__muted" data-i18n="about.icons"></p>
      <button type="button" class="about-modal__done" data-about-close data-i18n="about.close"></button>
    </div>
  `;

  applyDom(root);

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    opts.onClose?.();
  }

  function open() {
    applyDom(root);
    root.hidden = false;
    root.querySelector('.about-modal__close')?.focus();
  }

  root.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    if (target.closest('[data-about-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !root.hidden) close();
  });

  return { root, open, close, isOpen: () => !root.hidden };
}
