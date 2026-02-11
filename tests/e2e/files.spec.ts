import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('File Operations', () => {
    const testEmail = `test-files-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    test.beforeEach(async ({ page }) => {
        // Register (auto-logins now)
        await page.goto('/');
        await page.click('button:has-text("Sign Up")');
        await page.fill('input[type="email"]', testEmail);
        await page.fill('input[type="password"]', testPassword);
        await page.click('button:has-text("Create Account")');

        await expect(page.locator('h1', { hasText: 'VaultDrive' })).toBeVisible();
    });

    test('should upload a file', async ({ page }) => {
        const filePath = path.join(process.cwd(), 'test-file.txt');

        // Listen for upload response
        const uploadPromise = page.waitForResponse('/api/upload');

        // Set file input
        await page.setInputFiles('input[type="file"]', filePath);

        const response = await uploadPromise;
        expect(response.status()).toBe(200);

        // Verify it appears in the list
        await expect(page.locator('text=test-file.txt')).toBeVisible();
    });

    test('should rename a file', async ({ page }) => {
        // Upload first
        const filePath = path.join(process.cwd(), 'test-file.txt');
        await page.setInputFiles('input[type="file"]', filePath);
        await expect(page.locator('tr:has-text("test-file.txt")')).toBeVisible();

        const row = page.locator('tr', { hasText: 'test-file.txt' });

        // Click rename button
        await row.locator('button[title="Rename"]').click();

        // Fill new name
        const newName = 'renamed-test-file.txt';
        const input = row.locator('input[type="text"]');
        await expect(input).toBeVisible();
        await input.fill(newName);
        await input.press('Enter');

        // Verify name update
        await expect(page.locator(`text=${newName}`)).toBeVisible();
        await expect(page.locator('text=test-file.txt')).not.toBeVisible();
    });

    test('should delete a file', async ({ page }) => {
        // Upload first
        const filePath = path.join(process.cwd(), 'test-file.txt');
        await page.setInputFiles('input[type="file"]', filePath);
        await expect(page.locator('tr:has-text("test-file.txt")')).toBeVisible();

        const row = page.locator('tr', { hasText: 'test-file.txt' });

        // Intercept delete
        const deletePromise = page.waitForResponse(resp => resp.url().includes('/api/files/') && resp.request().method() === 'DELETE');

        // Click delete button
        await row.locator('button[title="Delete"]').click();

        const response = await deletePromise;
        expect(response.status()).toBe(200);

        // Verify it's gone
        await expect(page.locator('text=test-file.txt')).not.toBeVisible();
    });
});
