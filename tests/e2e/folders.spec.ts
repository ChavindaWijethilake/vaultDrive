import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Folder Management', () => {
    const testEmail = `test-folders-${Date.now()}@example.com`;
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

    test('should create and navigate into a folder', async ({ page }) => {
        const folderName = 'Work Documents';

        // Handle prompt for folder creation
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Folder name:');
            await dialog.accept(folderName);
        });

        await page.click('button:has-text("Folder+")');

        // Verify folder appeared
        await expect(page.locator(`text=${folderName}`)).toBeVisible();

        // Navigate inside
        await page.click(`text=${folderName}`);

        // Verify breadcrumb and empty state
        await expect(page.locator('button.text-slate-200', { hasText: folderName })).toBeVisible();
        await expect(page.locator('text=This folder is empty')).toBeVisible();
    });

    test('should delete a folder recursively', async ({ page }) => {
        const folderName = 'Delete Me';

        // Create folder
        page.on('dialog', async dialog => {
            await dialog.accept(folderName);
        });
        await page.click('button:has-text("Folder+")');
        await expect(page.locator(`text=${folderName}`)).toBeVisible();

        // Enter folder
        await page.click(`text=${folderName}`);

        // Upload a file inside
        const filePath = path.join(process.cwd(), 'test-file.txt');
        await page.setInputFiles('input[type="file"]', filePath);
        await expect(page.locator('text=test-file.txt')).toBeVisible();

        // Go back to root
        await page.click('button:has-text("Root")');

        // Delete folder
        await page.hover(`.glass-card:has-text("${folderName}")`);

        const deletePromise = page.waitForResponse(resp => resp.url().includes('/api/folders') && resp.request().method() === 'DELETE');
        await page.click('button:has-text("×")');

        const response = await deletePromise;
        expect(response.status()).toBe(200);

        // Verify folder is gone
        await expect(page.locator(`text=${folderName}`)).not.toBeVisible();
    });
});
