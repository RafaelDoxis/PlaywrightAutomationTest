// spec: specs/navbar-feature-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navbar Structure and Visibility', () => {
  test('Navbar Accessibility Features', async ({ page }) => {
    // 1. Navigate to the application homepage
    await page.goto('http://localhost:5173');

    // Verify the application loads successfully
    await expect(page).toHaveTitle('Vite App'); 

    // 2. Check navbar has proper semantic HTML structure
    // Verify navbar uses appropriate HTML5 semantic elements
    const navbar = page.getByRole('navigation').first();
    await expect(navbar).toBeVisible();

    // Verify navigation uses proper tablist structure
    const tablist = page.getByRole('tablist', { name: 'Primary navigation' });
    await expect(tablist).toBeVisible();

    // Check for proper tab roles
    const homeTab = page.getByRole('tab', { name: 'Home' });
    const dashboardTab = page.getByRole('tab', { name: 'Dashboard' });  
    const profileTab = page.getByRole('tab', { name: 'Profile' });

    await expect(homeTab).toBeVisible();
    await expect(dashboardTab).toBeVisible();
    await expect(profileTab).toBeVisible();

    // 3. Test keyboard navigation through navbar tabs
    // Focus on the first navigation tab
    await homeTab.focus();
    
    // Verify focus indicators are clearly visible (element should be focused)
    await expect(homeTab).toBeFocused();

    // Navigate to next item with Tab
    await page.keyboard.press('Tab');
    await expect(dashboardTab).toBeFocused();

    // Navigate to next item with Tab
    await page.keyboard.press('Tab');
    await expect(profileTab).toBeFocused();

    // Test Enter key activation on focused tab
    await page.keyboard.press('Enter');
    await expect(profileTab).toHaveAttribute('aria-selected', 'true');

    // Navigate back to Dashboard using keyboard
    await dashboardTab.focus();
    await page.keyboard.press('Space');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');

    // 4. Verify screen reader compatibility
    // Check navigation elements have appropriate role attributes
    await expect(page.getByRole('navigation').first()).toBeVisible();
    await expect(page.getByRole('tablist')).toBeVisible();
    await expect(page.getByRole('tab')).toHaveCount(3);

    // Verify tabs have meaningful text content
    await expect(homeTab).toContainText('Home');
    await expect(dashboardTab).toContainText('Dashboard');
    await expect(profileTab).toContainText('Profile');

    // Verify current tab is properly indicated for screen readers
    // After navigating to Dashboard, it should have aria-selected="true"
    await dashboardTab.click();
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'true');

    // Other tabs should have aria-selected="false"
    await expect(homeTab).toHaveAttribute('aria-selected', 'false');
    await expect(profileTab).toHaveAttribute('aria-selected', 'false');

    // Test navigation state updates correctly
    await homeTab.click();
    await expect(homeTab).toHaveAttribute('aria-selected', 'true');
    await expect(dashboardTab).toHaveAttribute('aria-selected', 'false');
  });
});