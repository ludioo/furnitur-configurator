import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join('docs', '_mobile-baselines', 'm6');
const OPEN_SAFARI = 'Open this page in Safari to view in AR';
const IPHONE_CHROME =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1';

test.describe('mobile AR CTA states', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });
    await expect(page.locator('#app canvas')).toBeVisible();
  });

  test('screenshots disabled, ready, and busy (emulated)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');

    await mkdir(OUT_DIR, { recursive: true });

    const ar = page.locator('button.ar-cta');
    await expect(ar).toBeVisible();
    await expect(ar).toHaveAttribute('aria-disabled', 'true');

    await page.screenshot({
      path: path.join(OUT_DIR, 'cta-disabled.png'),
      fullPage: false,
    });

    await ar.evaluate((el) => {
      el.removeAttribute('aria-disabled');
    });
    await expect(ar).not.toHaveAttribute('aria-disabled', 'true');
    await page.screenshot({
      path: path.join(OUT_DIR, 'cta-ready.png'),
      fullPage: false,
    });

    await ar.evaluate((el) => {
      el.setAttribute('aria-busy', 'true');
    });
    await expect(ar).toHaveAttribute('aria-busy', 'true');
    await page.screenshot({
      path: path.join(OUT_DIR, 'cta-busy.png'),
      fullPage: false,
    });
  });
});

test('iOS Chrome UA tap shows open-in-Safari toast', async ({ browser, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile project only');

  const context = await browser.newContext({
    baseURL,
    locale: 'en-US',
    viewport: { width: 390, height: 844 },
    userAgent: IPHONE_CHROME,
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();

  try {
    await page.goto('/');
    await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });

    const ua = await page.evaluate(() => navigator.userAgent);
    expect(ua).toContain('CriOS');

    const ar = page.locator('button.ar-cta');
    await expect(ar).toBeVisible();
    await expect(ar).toHaveAttribute('aria-disabled', 'true');

    await ar.click({ force: true });
    await expect(page.locator('.toast').filter({ hasText: OPEN_SAFARI })).toBeVisible();
  } finally {
    await context.close();
  }
});
