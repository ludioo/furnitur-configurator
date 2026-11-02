import { applyDom, t } from '../core/i18n.js';
import { mountBottomSheet } from './bottomSheet.js';
import { initSwatches } from './swatches.js';

/**
 * @param {HTMLElement} mountParent
 */
export async function initConfigPanel(mountParent) {
  const { host, content, mode } = await mountBottomSheet(mountParent);
  host.setAttribute('aria-label', t('config.panelAria'));

  const section = document.createElement('section');
  section.className = 'config-panel';
  section.innerHTML = `
    <h2 id="config-color-heading" class="config-panel__heading" data-i18n="config.color"></h2>
    <div class="config-panel__swatches" data-swatches></div>
  `;
  content.append(section);
  applyDom(section);

  const swatchMount = section.querySelector('[data-swatches]');
  const swatches = initSwatches(/** @type {HTMLElement} */ (swatchMount));

  return {
    host,
    mode,
    swatches,
    destroy() {
      swatches.destroy();
      host.remove();
    },
  };
}
