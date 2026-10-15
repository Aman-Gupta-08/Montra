import { test, expect } from '@playwright/test';

test('Montra homepage loads successfully', async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  const response = await page.goto('https://montra08.vercel.app/');

  expect(response).not.toBeNull();
  expect(response!.status()).toBeLessThan(400);

  await expect(page.locator('body')).toBeVisible();

  await page.waitForLoadState('networkidle').catch(() => {});

  expect(
    consoleErrors,
    `Browser errors: ${consoleErrors.join('\n')}`
  ).toEqual([]);
});
