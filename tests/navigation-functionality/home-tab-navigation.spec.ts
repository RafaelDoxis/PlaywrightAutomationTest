// spec: specs/navbar-feature-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', () => {
  test('Home Tab Navigation', async ({ page }) => {
    // 1. Navigate to the application homepage
    await page.goto('http://localhost:5173');

    const homeTab = page.getByRole('tab', { name: 'Home' });
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    const profileTab = page.getByRole('tab', { name: 'Profile' });

    // Check initial state - Home tab should be selected by default
    await expect(page).toHaveTitle('Vite App');
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');

    // 2. Click on the Home tab (even though it's already selected)
    await homeTab.click();

    // Verify the Home tab remains selected
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    
    // Verify other tabs are not selected by clicking them and then returning to Home
    await dashboardTab.click();
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');

    // 3. Verify Home page content is properly loaded (default Vue content)
    // Since this is the default Vue app, we verify standard Vue content is visible
    await expect(page.getByText('You did it!')).toBeVisible();
    await expect(page.getByText('Vue 3')).toBeVisible();
  });
});