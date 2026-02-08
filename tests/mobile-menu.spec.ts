import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');
    await expect(menuButton).toBeVisible();
  });

  test('menu is hidden by default', async ({ page }) => {
    const nav = page.locator('#navigation-menu');
    await expect(nav).toBeHidden();
  });

  test('clicking hamburger opens the menu', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');
    const header = page.locator('#main-header');

    await menuButton.click();

    // Check aria-expanded is true
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Check menu-open class is added to header
    await expect(header).toHaveClass(/menu-open/);

    // Check nav is now visible
    const nav = page.locator('#navigation-menu');
    await expect(nav).toBeVisible();
  });

  test('clicking hamburger again closes the menu', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');
    const header = page.locator('#main-header');

    // Open menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Close menu
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(header).not.toHaveClass(/menu-open/);
  });

  test('all navigation links are visible when menu is open', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');
    await menuButton.click();

    const expectedLinks = ['Home', 'About', 'Blog', 'Recipes', 'Playlists', 'Projects', 'Bookmarks'];

    for (const linkText of expectedLinks) {
      const link = page.locator('#navigation-menu').getByRole('link', { name: linkText });
      await expect(link).toBeVisible();
    }
  });

  test('clicking a nav link closes the menu', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');

    // Open menu (force to bypass any dev overlays)
    await menuButton.click({ force: true });
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    // Click a nav link (force to bypass any dev overlays)
    const aboutLink = page.locator('#navigation-menu').getByRole('link', { name: 'About' });
    await aboutLink.click({ force: true });

    // Wait for Astro view transition to complete
    await expect(page).toHaveURL(/\/about/);

    // After navigation, menu should be closed (default state)
    const newMenuButton = page.locator('#toggle-navigation-menu');
    const newHeader = page.locator('#main-header');
    await expect(newMenuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(newHeader).not.toHaveClass(/menu-open/);
  });

  test('menu persists correctly across page navigation via Astro view transitions', async ({ page }) => {
    // Navigate to about page
    await page.goto('/about');

    const menuButton = page.locator('#toggle-navigation-menu');

    // Menu button should still work after navigation
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');

    const nav = page.locator('#navigation-menu');
    await expect(nav).toBeVisible();
  });

  test('hamburger icon toggles to X when menu is open', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');

    // Get the hamburger icon (3 lines) and close icon (X)
    const hamburgerIcon = menuButton.locator('svg').first();
    const closeIcon = menuButton.locator('svg').last();

    // Initially hamburger visible, close hidden
    await expect(hamburgerIcon).toBeVisible();
    await expect(closeIcon).toHaveCSS('opacity', '0');

    // Open menu
    await menuButton.click();

    // After opening, close icon should be visible, hamburger hidden
    await expect(hamburgerIcon).toHaveCSS('opacity', '0');
    await expect(closeIcon).toBeVisible();
  });

  test('menu has proper ARIA attributes for accessibility', async ({ page }) => {
    const menuButton = page.locator('#toggle-navigation-menu');
    const nav = page.locator('#navigation-menu');

    // Check button has proper ARIA attributes
    await expect(menuButton).toHaveAttribute('aria-label', 'Open main menu');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    await expect(menuButton).toHaveAttribute('aria-haspopup', 'menu');

    // Check nav has aria-label
    await expect(nav).toHaveAttribute('aria-label', 'Main menu');
  });
});
