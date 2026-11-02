/**
 * Safe no-op until Umami is wired (T3.2).
 * @param {string} _name
 * @param {Record<string, unknown>} [_data]
 */
export function track(_name, _data) {
  try {
    window.umami?.track?.(_name, _data);
  } catch {
    /* ignore */
  }
}
