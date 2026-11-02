const PREFIX = 'furncfg:';

/**
 * @param {string} key short key without prefix (e.g. "lang")
 * @returns {string | null}
 */
export function get(key) {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {string} value
 * @returns {boolean}
 */
export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, value);
    return true;
  } catch {
    return false;
  }
}

/** @returns {'en' | 'id' | null} */
export function getLang() {
  const v = get('lang');
  if (v === 'en' || v === 'id') return v;
  return null;
}

/**
 * @param {'en' | 'id'} lang
 * @returns {boolean}
 */
export function setLang(lang) {
  if (lang !== 'en' && lang !== 'id') return false;
  return set('lang', lang);
}
