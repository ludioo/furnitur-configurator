import { applyDom, subscribe, t } from '../core/i18n.js';
import { iconHtml, icons } from './icons.js';
import { attachTooltip } from './tooltip.js';

/**
 * AR CTA stub (always disabled until T2.1 capability detect).
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

  const tip = attachTooltip(btn, () => t('ar.unsupported'));

  btn.addEventListener('click', (e) => {
    e.preventDefault();
  });

  const unsub = subscribe(() => {
    applyDom(btn);
    tip.updateText();
  });

  return {
    root: btn,
    destroy() {
      unsub();
      tip.destroy();
      btn.remove();
    },
  };
}
