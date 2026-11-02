import { detectArCapability } from '../ar/capability.js';
import { applyDom, subscribe, t } from '../core/i18n.js';
import { iconHtml, icons } from './icons.js';
import { attachTooltip } from './tooltip.js';

/**
 * AR CTA with capability states (WebXR / Quick Look / unsupported).
 * Does not start a session or export USDZ (T2.2 / T2.3).
 * @param {HTMLElement} mountParent
 * @returns {{ root: HTMLButtonElement, destroy: () => void }}
 */
export function initArButton(mountParent) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ar-cta';
  btn.setAttribute('aria-disabled', 'true');
  btn.innerHTML = `
    ${iconHtml(icons.cube, 'icon icon--sm')}
    <span data-i18n="cta.ar"></span>
  `;
  mountParent.append(btn);
  applyDom(btn);

  /** @type {'webxr' | 'quicklook' | 'unsupported'} */
  let mode = 'unsupported';
  let alive = true;

  const tip = attachTooltip(btn, () => (mode === 'unsupported' ? t('ar.unsupported') : ''));

  function applyMode(next) {
    mode = next;
    if (mode === 'unsupported') {
      btn.setAttribute('aria-disabled', 'true');
    } else {
      btn.removeAttribute('aria-disabled');
    }
    tip.updateText();
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();
  });

  const unsub = subscribe(() => {
    applyDom(btn);
    tip.updateText();
  });

  void detectArCapability().then((next) => {
    if (!alive) return;
    applyMode(next);
  });

  return {
    root: btn,
    destroy() {
      alive = false;
      unsub();
      tip.destroy();
      btn.remove();
    },
  };
}
