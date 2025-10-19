import { test, expect } from '@playwright/test';

test.describe('Design System Viewer', () => {
  test('captures full-page layout snapshot', async ({ page }) => {
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await expect(page.locator('text=Ohouse AI Design System')).toBeVisible();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: 'playwright-report/design-system-full.png',
      fullPage: true,
    });
  });
});
