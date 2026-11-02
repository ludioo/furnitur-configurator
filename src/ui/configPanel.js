import { applyDom, t } from '../core/i18n.js';
import { mountBottomSheet } from './bottomSheet.js';
import { initSwatches } from './swatches.js';
import { initOptionChips } from './optionChips.js';
import { initPriceBar } from './priceBar.js';

/**
 * @param {HTMLElement} mountParent
 */
export async function initConfigPanel(mountParent) {
  const { host, content, mode } = await mountBottomSheet(mountParent);
  host.setAttribute('aria-label', t('config.panelAria'));

  const section = document.createElement('section');
  section.className = 'config-panel';
  section.innerHTML = `
    <div class="config-panel__options">
      <h2 id="config-color-heading" class="config-panel__heading" data-i18n="config.color"></h2>
      <div class="config-panel__swatches" data-swatches></div>
      <h2 id="config-finish-heading" class="config-panel__heading" data-i18n="config.finish"></h2>
      <div class="config-panel__chips" data-finish-chips></div>
      <h2 id="config-size-heading" class="config-panel__heading" data-i18n="config.size"></h2>
      <div class="config-panel__chips" data-size-chips></div>
    </div>
    <div class="config-panel__footer" data-price-bar></div>
  `;
  content.append(section);
  applyDom(section);

  const swatchMount = section.querySelector('[data-swatches]');
  const finishMount = section.querySelector('[data-finish-chips]');
  const sizeMount = section.querySelector('[data-size-chips]');
  const priceMount = section.querySelector('[data-price-bar]');
  const swatches = initSwatches(/** @type {HTMLElement} */ (swatchMount));
  const finishChips = initOptionChips(/** @type {HTMLElement} */ (finishMount), {
    optionKey: 'finish',
    headingId: 'config-finish-heading',
  });
  const sizeChips = initOptionChips(/** @type {HTMLElement} */ (sizeMount), {
    optionKey: 'size',
    headingId: 'config-size-heading',
  });
  const priceBar = initPriceBar(/** @type {HTMLElement} */ (priceMount));

  return {
    host,
    mode,
    swatches,
    destroy() {
      swatches.destroy();
      finishChips.destroy();
      sizeChips.destroy();
      priceBar.destroy();
      host.remove();
    },
  };
}
