// spec: specs/navbar-feature-test-plan.md  
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', () => {
  test('Dashboard Tab Navigation', async ({ page }) => {
    // 1. Navigate to the application homepage  
    await page.goto('http://localhost:5173');

    const homeTab = page.getByRole('tab', { name: 'Home' });
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    const profileTab = page.getByRole('tab', { name: 'Profile' });

    // Verify initial state
    await expect(page).toHaveTitle('Vite App');
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');

    // 2. Click on the Dashboard tab
    await dashboardTab.click();

    // Verify the Dashboard tab becomes selected
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    await expect(profileTab).toHaveAttribute('aria-selected', 'false');

    // 3. Verify Dashboard functionality (tab remains selected)
    // Since this is a Vue app with tabs, we verify the tab states
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');

    // 4. Navigate back to Home and then to Dashboard again
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');

    // Navigate to Dashboard again
    await dashboardTab.click();
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');

    // Verify Dashboard tab activates correctly on second visit
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
  });
});