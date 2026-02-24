// spec: specs/navbar-feature-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navbar Structure and Visibility', () => {
  test('Navbar Component Renders Correctly', async ({ page }) => {
    // 1. Navigate to the application homepage
    await page.goto('http://localhost:5173');

    // Verify the page loads successfully
    await expect(page).toHaveTitle('Vite App');

    // 2. Verify navbar container is visible
    await expect(page.getByRole('tablist', { name: 'Primary navigation' })).toBeVisible();

    // 3. Check navbar contains all required navigation tabs
    await expect(page.getByRole('tab', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Profile' })).toBeVisible();

    // 4. Verify navbar tabs are properly styled and functional
    // Verify initial state: Home tab should be selected by default
    const homeTab = page.getByRole('tab', { name: 'Home' });
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    const profileTab = page.getByRole('tab', { name: 'Profile' });
    
    // Verify Home tab is selected initially
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    
    // Test navigation functionality by clicking each tab
    await dashboardTab.click();
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    
    await profileTab.click();
    await expect(profileTab).toHaveAttribute('aria-selected', 'true');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');
    
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    await expect(profileTab).toHaveAttribute('aria-selected', 'false');
  });
});