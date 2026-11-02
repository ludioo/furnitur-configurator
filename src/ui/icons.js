import infoSvg from './icons/info.svg?raw';
import xSvg from './icons/x.svg?raw';

/**
 * @param {string} svg
 * @param {string} [className]
 * @returns {string}
 */
export function iconHtml(svg, className = 'icon') {
  return svg.replace(
    /<svg\b([^>]*)>/,
    `<svg class="${className}" aria-hidden="true"$1>`,
  );
}

export const icons = {
  info: infoSvg,
  x: xSvg,
};
