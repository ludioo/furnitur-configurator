import { applyDom, getLang, subscribe as subscribeLang, t } from '../core/i18n.js';
import { deleteConfig, listConfigs } from '../core/storage.js';
import { setState } from '../core/state.js';
import { showToast } from './toast.js';
import { iconHtml, icons } from './icons.js';

/**
 * @param {HTMLElement} mountParent
 * @param {{ onClose?: () => void }} [options]
 */
export function initSavedList(mountParent, options = {}) {
  const root = document.createElement('div');
  root.className = 'saved-panel';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.innerHTML = `
    <div class="saved-panel__dialog">
      <header class="saved-panel__header">
        <h2 class="saved-panel__title" id="saved-title" data-i18n="saved.title"></h2>
        <button type="button" class="saved-panel__close" data-close data-i18n-aria="saved.close">
          ${iconHtml(icons.x)}
        </button>
      </header>
      <p class="saved-panel__empty" data-empty data-i18n="saved.empty"></p>
      <ul class="saved-panel__list" data-list hidden></ul>
    </div>
  `;
  root.setAttribute('aria-labelledby', 'saved-title');
  mountParent.append(root);
  applyDom(root);

  const emptyEl = /** @type {HTMLElement} */ (root.querySelector('[data-empty]'));
  const listEl = /** @type {HTMLElement} */ (root.querySelector('[data-list]'));
  const closeBtn = root.querySelector('[data-close]');

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat(getLang() === 'id' ? 'id-ID' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  function render() {
    const configs = listConfigs();
    listEl.replaceChildren();
    const empty = configs.length === 0;
    emptyEl.hidden = !empty;
    listEl.hidden = empty;
    if (empty) return;

    for (const cfg of configs.slice().reverse()) {
      const li = document.createElement('li');
      li.className = 'saved-item';
      li.dataset.id = cfg.id;
      li.innerHTML = `
        <div class="saved-item__meta">
          <span class="saved-item__name"></span>
          <span class="saved-item__date"></span>
        </div>
        <div class="saved-item__actions">
          <button type="button" class="saved-item__btn" data-load></button>
          <button type="button" class="saved-item__btn saved-item__btn--danger" data-delete>
            ${iconHtml(icons.trash, 'icon icon--sm')}
          </button>
        </div>
      `;
      li.querySelector('.saved-item__name').textContent = cfg.name;
      li.querySelector('.saved-item__date').textContent = formatDate(cfg.createdAt);
      const loadBtn = /** @type {HTMLButtonElement} */ (li.querySelector('[data-load]'));
      loadBtn.textContent = t('saved.load');
      const delBtn = /** @type {HTMLButtonElement} */ (li.querySelector('[data-delete]'));
      delBtn.setAttribute('aria-label', t('saved.delete'));

      loadBtn.addEventListener('click', () => {
        setState({
          productId: cfg.productId,
          fabricColor: cfg.fabricColor,
          finish: cfg.finish,
          size: cfg.size,
        });
        close();
      });

      delBtn.addEventListener('click', () => {
        const result = deleteConfig(cfg.id);
        if (!result.ok) {
          showToast(t('toast.storageFail'));
          return;
        }
        render();
      });

      listEl.append(li);
    }
  }

  function open() {
    render();
    root.hidden = false;
    closeBtn instanceof HTMLElement && closeBtn.focus();
  }

  function close() {
    if (root.hidden) return;
    root.hidden = true;
    options.onClose?.();
  }

  function isOpen() {
    return !root.hidden;
  }

  closeBtn?.addEventListener('click', () => close());
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });

  /** @param {KeyboardEvent} e */
  function onKey(e) {
    if (e.key === 'Escape' && isOpen()) close();
  }
  document.addEventListener('keydown', onKey);

  const unsubLang = subscribeLang(() => {
    applyDom(root);
    if (isOpen()) render();
  });

  return {
    root,
    render,
    open,
    close,
    isOpen,
    destroy() {
      document.removeEventListener('keydown', onKey);
      unsubLang();
      root.remove();
    },
  };
}
