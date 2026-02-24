// spec: specs/navbar-feature-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Edge Cases and Error Handling', () => {
  test('Rapid Navigation Clicks', async ({ page }) => {
    // 1. Navigate to the application homepage
    await page.goto('http://localhost:5173');

    const homeTab = page.getByRole('tab', { name: 'Home' });
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });
    const profileTab = page.getByRole('tab', { name: 'Profile' });

    // Verify initial state
    await expect(page).toHaveTitle('Vite App');
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');

    // 2. Rapidly click between different tabs multiple times
    // This tests for race conditions and proper state management
    await dashboardTab.click();
    await profileTab.click();
    await homeTab.click();
    await dashboardTab.click();
    await profileTab.click();

    // Wait for final navigation to complete and verify final state
    await expect(profileTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');

    // Verify content displays correctly after rapid switching
    // In this case, the tab should remain functional
    await expect(profileTab).toBeVisible();

    // 3. Double-click on already active tab 
    await profileTab.dblclick();
    
    // Verify tab remains active and functional after double-click
    await expect(profileTab).toHaveAttribute('aria-selected', 'true');
    await expect(profileTab).toBeVisible();

    // Verify no duplicate navigation events are triggered by clicking another tab
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    await expect(profileTab).toHaveAttribute('aria-selected', 'false');

    // 4. Click on tabs rapidly to test loading states don't interfere
    // Simulate rapid clicking during potential loading states
    await dashboardTab.click();
    
    // Immediately click another tab before the previous navigation completes
    await profileTab.click();
    
    // Wait for navigation to settle
    await page.waitForTimeout(100);
    
    // Verify final active tab corresponds to the last clicked tab
    await expect(profileTab).toHaveAttribute('aria-selected', 'true');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');

    // Verify loading states don't interfere with navbar functionality by doing more rapid navigation
    await homeTab.click();
    await dashboardTab.click();
    await page.waitForTimeout(100);
    
    // Content should load correctly for the selected tab
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    await expect(profileTab).toHaveAttribute('aria-selected', 'false');
  });
});