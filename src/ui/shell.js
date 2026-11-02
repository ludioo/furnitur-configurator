import { applyDom, getLang, setLang, subscribe } from '../core/i18n.js';
import { createAboutModal } from './aboutModal.js';
import { iconHtml, icons } from './icons.js';

/**
 * @param {HTMLElement} mountParent
 */
export function initShell(mountParent) {
  const bar = document.createElement('header');
  bar.className = 'top-bar';
  bar.innerHTML = `
    <div class="top-bar__brand">
      <span class="top-bar__logo" data-i18n="app.logo"></span>
    </div>
    <div class="top-bar__tabs" role="tablist" aria-label="Product">
      <button type="button" class="top-bar__tab is-active" role="tab" aria-selected="true" data-i18n="tab.chair" disabled></button>
      <button type="button" class="top-bar__tab" role="tab" aria-selected="false" data-i18n="tab.sofa" disabled></button>
    </div>
    <div class="top-bar__actions">
      <div class="top-bar__lang" role="group" aria-label="Language">
        <button type="button" class="top-bar__lang-btn" data-lang="en" data-i18n="lang.en"></button>
        <span class="top-bar__lang-sep" aria-hidden="true">|</span>
        <button type="button" class="top-bar__lang-btn" data-lang="id" data-i18n="lang.id"></button>
      </div>
      <button type="button" class="top-bar__about" data-i18n-aria="nav.aboutAria">
        ${iconHtml(icons.info)}
        <span data-i18n="nav.about"></span>
      </button>
    </div>
  `;

  const about = createAboutModal({
    onClose() {
      if (routeFromHash() === 'about') setHash('configure');
    },
  });

  mountParent.append(bar, about.root);
  applyDom(document);
  syncLangButtons();

  bar.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-lang');
      if (next === 'en' || next === 'id') setLang(next);
    });
  });

  bar.querySelector('.top-bar__about')?.addEventListener('click', () => {
    setHash('about');
    about.open();
  });

  subscribe(() => {
    syncLangButtons();
  });

  window.addEventListener('hashchange', syncRoute);
  syncRoute();

  function syncLangButtons() {
    const current = getLang();
    bar.querySelectorAll('[data-lang]').forEach((btn) => {
      const active = btn.getAttribute('data-lang') === current;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function syncRoute() {
    const route = routeFromHash();
    if (route === 'about') {
      about.open();
      return;
    }
    if (about.isOpen()) about.close();
    if (!location.hash || location.hash === '#') {
      setHash('configure', true);
    }
  }

  return { about };
}

/**
 * @returns {'configure' | 'about' | 'saved' | string}
 */
function routeFromHash() {
  const raw = (location.hash || '#configure').replace(/^#/, '');
  return raw || 'configure';
}

/**
 * @param {string} name
 * @param {boolean} [replace]
 */
function setHash(name, replace = false) {
  const next = `#${name}`;
  if (location.hash === next) return;
  if (replace) history.replaceState(null, '', next);
  else location.hash = next;
}
