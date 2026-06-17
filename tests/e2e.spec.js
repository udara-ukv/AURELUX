const { test, expect } = require('@playwright/test');

test('anchor navigation works: About and Contact', async ({ page }) => {
  await page.goto('https://udara-ukv.github.io/AURELUX/');

  // Click footer About Us
  await page.click('footer a[href="#about"]');
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator('section#about h2')).toBeVisible();

  // Click footer Contact
  await page.click('footer a[href="#contact"]');
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('section#contact h2')).toBeVisible();
});
