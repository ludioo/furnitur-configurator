import { describe, expect, it } from 'vitest';
import { pricingReady } from '../src/core/pricing.js';

describe('pricing stub', () => {
  it('exports a placeholder that is ready', () => {
    expect(pricingReady()).toBe(true);
  });
});
