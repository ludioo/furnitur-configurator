import { expect, test } from '@playwright/test';

const UNSUPPORTED =
  'AR needs Chrome on Android or Safari on iPhone';

test('desktop AR CTA disabled: tooltip on hover and toast on click', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'desktop Chromium only');

  await page.goto('/');

  await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });

  const ar = page.locator('button.ar-cta');
  await expect(ar).toBeVisible();
  await expect(ar).toHaveAttribute('aria-disabled', 'true');

  await ar.hover();
  await expect(
    page.locator('.tooltip').filter({ hasText: UNSUPPORTED }),
  ).toBeVisible();

  await ar.click({ force: true });
  await expect(page.locator('.toast').filter({ hasText: UNSUPPORTED })).toBeVisible();
});

test('mobile AR CTA tap shows unsupported toast', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile project only');

  await page.goto('/');

  await expect(page.locator('#splash')).toBeHidden({ timeout: 60_000 });

  const ar = page.locator('button.ar-cta');
  await expect(ar).toBeVisible();
  await expect(ar).toHaveAttribute('aria-disabled', 'true');

  await ar.click({ force: true });
  await expect(page.locator('.toast').filter({ hasText: UNSUPPORTED })).toBeVisible();
});
