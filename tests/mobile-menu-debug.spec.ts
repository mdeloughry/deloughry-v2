import { test, expect } from '@playwright/test';

test.describe('Mobile Menu Debug', () => {
  test('debug nav link click', async ({ page }) => {
    await page.goto('/');

    // Take screenshot of initial state
    await page.screenshot({ path: 'test-results/1-initial.png' });

    const menuButton = page.locator('#toggle-navigation-menu');

    // Open menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Take screenshot after menu open
    await page.screenshot({ path: 'test-results/2-menu-open.png' });

    // Check the About link exists and is visible
    const aboutLink = page.locator('#navigation-menu').getByRole('link', { name: 'About' });
    await expect(aboutLink).toBeVisible();

    // Get the link's href
    const href = await aboutLink.getAttribute('href');
    console.log('About link href:', href);

    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/3-before-click.png' });

    // Log all links in the nav
    const allLinks = page.locator('#navigation-menu a');
    const count = await allLinks.count();
    console.log('Number of links in nav:', count);

    for (let i = 0; i < count; i++) {
      const link = allLinks.nth(i);
      const text = await link.textContent();
      const linkHref = await link.getAttribute('href');
      const isVisible = await link.isVisible();
      console.log(`Link ${i}: "${text}" -> ${linkHref} (visible: ${isVisible})`);
    }

    // Try clicking with force to bypass any visibility issues
    await aboutLink.click({ force: true });

    // Wait a bit for navigation
    await page.waitForTimeout(2000);

    // Take screenshot after clicking
    await page.screenshot({ path: 'test-results/4-after-click.png' });

    // Log final URL
    console.log('Final URL:', page.url());
  });
});
