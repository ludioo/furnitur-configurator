import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join('docs', '_mobile-baselines', 'm2');

test.describe('mobile sheet + AR CTA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });
    await expect(page.locator('#app canvas')).toBeVisible();
  });

  test('peek shows grabber and AR CTA above sheet', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');

    await mkdir(OUT_DIR, { recursive: true });

    const grabber = page.locator('.config-sheet__grabber');
    await expect(grabber).toBeVisible();

    const saveBtn = page.locator('[data-save]');
    await expect(saveBtn).toBeVisible();

    const arCta = page.locator('.ar-cta');
    await expect(arCta).toBeVisible();

    const snap = await page.locator('html').getAttribute('data-sheet-snap');
    expect(snap === 'peek' || snap === null).toBeTruthy();

    await page.screenshot({
      path: path.join(OUT_DIR, 'peek.png'),
      fullPage: false,
    });
  });

  test('expanded sheet hides AR CTA', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');

    await mkdir(OUT_DIR, { recursive: true });

    const expanded = await page.evaluate(async () => {
      const view = document.defaultView;
      const waitFrames = () =>
        new Promise((resolve) => {
          view.requestAnimationFrame(() => view.requestAnimationFrame(resolve));
        });
      const sheet = document.querySelector('bottom-sheet');
      if (sheet && typeof sheet.snapToPoint === 'function') {
        // Lib: 0=collapsed, 1=peek, 2=mid, 3=full (25/55/90)
        sheet.snapToPoint(3, { behavior: 'instant' });
        await waitFrames();
        return { mode: 'native', snap: document.documentElement.dataset.sheetSnap };
      }
      const scroller = document.querySelector('.config-sheet__scroller');
      if (scroller) {
        scroller.scrollTop = 0;
        scroller.dispatchEvent(new view.Event('scroll'));
        await waitFrames();
        return { mode: 'fallback', snap: document.documentElement.dataset.sheetSnap };
      }
      return { mode: 'none', snap: document.documentElement.dataset.sheetSnap };
    });

    expect(expanded.mode).not.toBe('none');
    expect(['mid', 'full']).toContain(expanded.snap);

    const arCta = page.locator('.ar-cta');
    await expect(arCta).toBeHidden();

    await page.screenshot({
      path: path.join(OUT_DIR, 'expanded.png'),
      fullPage: false,
    });
  });
});
