import { test } from '@playwright/test';

test.describe('Design System Viewer', () => {
  test('captures full-page layout snapshot', async ({ page }) => {
    page.on('console', message => {
      console.log(`[browser console] ${message.type()}: ${message.text()}`);
    });
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: 'playwright-report/design-system-full.png',
      fullPage: true,
    });
  });
});
