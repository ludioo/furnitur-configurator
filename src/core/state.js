/** @typedef {{ productId: string, fabricColor: string, finish: string, size: string }} ConfigState */

/** @type {ConfigState} */
const DEFAULT_STATE = {
  productId: 'armchair',
  fabricColor: 'sand',
  finish: 'fabric',
  size: 'standard',
};

/** @type {ConfigState} */
let state = { ...DEFAULT_STATE };

/** @type {Set<(next: ConfigState) => void>} */
const listeners = new Set();

/** @returns {Readonly<ConfigState>} */
export function getState() {
  return state;
}

/** @returns {ConfigState} */
export function getSnapshot() {
  return { ...state };
}

/**
 * @param {keyof ConfigState} key
 * @param {string} value
 */
export function setOption(key, value) {
  if (!(key in DEFAULT_STATE)) return;
  if (state[key] === value) return;
  state = { ...state, [key]: value };
  for (const fn of listeners) fn(state);
}

/**
 * @param {Partial<ConfigState>} patch
 */
export function setState(patch) {
  let changed = false;
  const next = { ...state };
  for (const key of Object.keys(DEFAULT_STATE)) {
    if (key in patch && patch[key] != null && next[key] !== patch[key]) {
      next[key] = patch[key];
      changed = true;
    }
  }
  if (!changed) return;
  state = next;
  for (const fn of listeners) fn(state);
}

/**
 * @param {(next: ConfigState) => void} fn
 * @returns {() => void}
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Reset to defaults — tests only. */
export function resetState() {
  state = { ...DEFAULT_STATE };
  for (const fn of listeners) fn(state);
}
