import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  isDesktopLayout,
  isShortLandscape,
  subscribeLayoutMode,
  syncSheetPeekHeight,
} = await import('../src/ui/bottomSheet.js');

function stubDocumentElement() {
  const style = new Map();
  const dataset = {};
  globalThis.document = {
    documentElement: {
      style: {
        setProperty(k, v) {
          style.set(k, v);
        },
        getPropertyValue(k) {
          return style.get(k) ?? '';
        },
        removeProperty(k) {
          style.delete(k);
        },
      },
      dataset,
      createElement(tag) {
        return {
          tagName: tag,
          style: {
            props: new Map(),
            setProperty(k, v) {
              this.props.set(k, v);
            },
            getPropertyValue(k) {
              return this.props.get(k) ?? '';
            },
          },
        };
      },
    },
    createElement(tag) {
      return globalThis.document.documentElement.createElement(tag);
    },
  };
}

/**
 * @param {{ wide?: boolean, shortLandscape?: boolean }} flags
 */
function mockMatchMedia({ wide = false, shortLandscape = false } = {}) {
  globalThis.matchMedia = vi.fn().mockImplementation((query) => {
    let matches = false;
    if (query.includes('min-width: 768px')) matches = wide;
    if (query.includes('max-height: 500px')) matches = shortLandscape;
    return {
      matches,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    };
  });
}

describe('layoutMode', () => {
  beforeEach(() => {
    stubDocumentElement();
  });

  it('isShortLandscape reads short landscape media', () => {
    mockMatchMedia({ shortLandscape: true });
    expect(isShortLandscape()).toBe(true);
    mockMatchMedia({ shortLandscape: false });
    expect(isShortLandscape()).toBe(false);
  });

  it('isDesktopLayout is false for wide short-landscape (phone landscape)', () => {
    mockMatchMedia({ wide: true, shortLandscape: true });
    expect(isDesktopLayout()).toBe(false);
  });

  it('isDesktopLayout is true for wide portrait / tall landscape', () => {
    mockMatchMedia({ wide: true, shortLandscape: false });
    expect(isDesktopLayout()).toBe(true);
  });

  it('isDesktopLayout is false below 768', () => {
    mockMatchMedia({ wide: false, shortLandscape: false });
    expect(isDesktopLayout()).toBe(false);
  });

  it('syncSheetPeekHeight sets 18svh for native short landscape', () => {
    mockMatchMedia({ shortLandscape: true });
    const snap = globalThis.document.createElement('div');
    syncSheetPeekHeight('native', snap);
    expect(globalThis.document.documentElement.style.getPropertyValue('--sheet-peek-height')).toBe(
      '18svh',
    );
    expect(snap.style.getPropertyValue('--snap')).toBe('18%');
    expect(globalThis.document.documentElement.dataset.layout).toBe('short-landscape');
  });

  it('syncSheetPeekHeight sets 25dvh for native portrait mobile', () => {
    mockMatchMedia({ shortLandscape: false });
    const snap = globalThis.document.createElement('div');
    syncSheetPeekHeight('native', snap);
    expect(globalThis.document.documentElement.style.getPropertyValue('--sheet-peek-height')).toBe(
      '25dvh',
    );
    expect(snap.style.getPropertyValue('--snap')).toBe('25%');
  });

  it('subscribeLayoutMode fires when desktop flag flips', () => {
    const listeners = new Map();
    let wide = false;
    let short = false;

    globalThis.matchMedia = vi.fn().mockImplementation((query) => {
      const isWide = query.includes('min-width: 768px');
      const isShort = query.includes('max-height: 500px');
      return {
        get matches() {
          return isWide ? wide : isShort ? short : false;
        },
        media: query,
        addEventListener(_type, fn) {
          const key = isWide ? 'wide' : isShort ? 'short' : query;
          listeners.set(key, fn);
        },
        removeEventListener(_type, fn) {
          for (const [k, v] of listeners) {
            if (v === fn) listeners.delete(k);
          }
        },
      };
    });

    const onChange = vi.fn();
    const unsub = subscribeLayoutMode(onChange);
    expect(onChange).not.toHaveBeenCalled();

    wide = true;
    listeners.get('wide')?.();
    expect(onChange).toHaveBeenCalledWith(true);

    short = true;
    listeners.get('short')?.();
    expect(onChange).toHaveBeenCalledWith(false);

    unsub();
  });
});
