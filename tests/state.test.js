import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSnapshot,
  getState,
  resetState,
  setOption,
  subscribe,
} from '../src/core/state.js';

afterEach(() => {
  resetState();
});

describe('state', () => {
  it('starts with armchair / sand / fabric / standard', () => {
    expect(getState()).toEqual({
      productId: 'armchair',
      fabricColor: 'sand',
      finish: 'fabric',
      size: 'standard',
    });
  });

  it('setOption updates fabricColor and notifies subscribers', () => {
    const spy = vi.fn();
    const unsub = subscribe(spy);
    setOption('fabricColor', 'navy');
    expect(getState().fabricColor).toBe('navy');
    expect(getSnapshot()).toEqual({
      productId: 'armchair',
      fabricColor: 'navy',
      finish: 'fabric',
      size: 'standard',
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0].fabricColor).toBe('navy');
    unsub();
    setOption('fabricColor', 'forest');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ignores no-op setOption', () => {
    const spy = vi.fn();
    const unsub = subscribe(spy);
    setOption('fabricColor', 'sand');
    expect(spy).not.toHaveBeenCalled();
    unsub();
  });
});
