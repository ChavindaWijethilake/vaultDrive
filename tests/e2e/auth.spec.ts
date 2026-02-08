import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    test('should register a new user', async ({ page }) => {
        await page.goto('/');

        // Toggle to registration
        await page.click('button:has-text("Sign Up")');

        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);

        // Intercept API call to confirm success
        const registrationPromise = page.waitForResponse('/api/auth/register');
        await page.click('button:has-text("Create Account")');

        const response = await registrationPromise;
        expect(response.status()).toBe(200);

        // Should automatically sign in and show the dashboard
        await expect(page.locator('h1', { hasText: 'VaultDrive' })).toBeVisible();
        await expect(page.locator('button:has-text("Logout Session")')).toBeVisible();
    });

    test('should login with created credentials', async ({ page }) => {
        await page.goto('/');

        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);

        await page.click('button:has-text("Sign In")');

        // Should see the dashboard
        await expect(page.locator('h1', { hasText: 'VaultDrive' })).toBeVisible();
        await expect(page.locator('button:has-text("Logout Session")')).toBeVisible();
    });

    test('should persist session on reload', async ({ page }) => {
        // Login first
        await page.goto('/');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button:has-text("Sign In")');

        await expect(page.locator('button:has-text("Logout Session")')).toBeVisible();

        // Reload
        await page.reload();

        // Should still be logged in
        await expect(page.locator('button:has-text("Logout Session")')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        // Login first
        await page.goto('/');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button:has-text("Sign In")');

        await page.click('button:has-text("Logout Session")');

        // Should be back at landing
        await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    });
});
