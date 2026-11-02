import { expect, test } from '@playwright/test';

test('desktop AR CTA is disabled with unsupported message', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop Chromium only');

  await page.goto('/');

  await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });

  const ar = page.locator('button.ar-cta');
  await expect(ar).toBeVisible();
  await expect(ar).toHaveAttribute('aria-disabled', 'true');

  await ar.hover();
  await expect(
    page.locator('.tooltip').filter({
      hasText: 'AR needs Chrome on Android or Safari on iPhone',
    }),
  ).toBeVisible();
});
