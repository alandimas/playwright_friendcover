const { test, expect } = require('@playwright/test');

test('Friendcover PRD', async ({ page }) => {
    await page.goto('https://friendcover.my/');
    await expect(page).toHaveTitle('GEGM FriendCover');

    const acceptAllBtn = page.getByRole('button', { name: 'Accept All' });
    await acceptAllBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await acceptAllBtn.isVisible().catch(() => false)) {
        await acceptAllBtn.click();
        await acceptAllBtn.waitFor({ state: 'hidden' });
    }

    await page.locator("//button[@aria-haspopup='menu' and normalize-space()='Products']").click();

    const shieldActiveBtn = page.locator("//a[contains(@href,'great-shield-active')]//button");
    await shieldActiveBtn.waitFor({ state: 'attached' });
    await shieldActiveBtn.evaluate((el) => el.click());

    // Sesuaikan dengan pola URL PRD: /plan/great-shield-active
    await expect(page).toHaveURL(/\/plan\/great-shield-active/);

    await page.goBack();

    await acceptAllBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await acceptAllBtn.isVisible().catch(() => false)) {
        await acceptAllBtn.click();
        await acceptAllBtn.waitFor({ state: 'hidden' });
    }

    await page.locator("//button[@aria-haspopup='menu' and normalize-space()='Products']").click();

    const homeBtn = page.locator("//a[contains(@href,'great-home-360')]//button");
    await homeBtn.waitFor({ state: 'attached' });
    await homeBtn.evaluate((el) => el.click());

    // Sesuaikan juga untuk Home 360
    await expect(page).toHaveURL(/\/plan\/great-home-360/);
});