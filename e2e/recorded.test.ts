import { test, expect } from '@playwright/test';

test('recorded test', async ({ page }) => {
    await page.goto('https://playwright.dev/docs/puppeteer');
    await page.getByRole('link', { name: 'Setting up CI' }).click();
    await page.getByRole('link', { name: 'How to set up GitHub Actions' }).click();
    await expect(page.locator('#setting-up-github-actions')).toContainText('Setting up GitHub Actions');
});
