const { test, expect } = require('@playwright/test');

test('Friendcover STG', async ({ page }) => {
    await page.goto('https://microsite-v2.stg.friendsure.io/?channel=gegm-friendcover');
    await expect(page).toHaveTitle('GEGM Friendcover');

    // Tunggu banner cookie muncul dulu (bukan cek sesaat), baru klik Accept All
    const acceptAllBtn = page.getByRole('button', { name: 'Accept All' });

    await acceptAllBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('Cookie banner tidak muncul, lanjut tanpa dismiss');
    });

    if (await acceptAllBtn.isVisible().catch(() => false)) {
        await acceptAllBtn.click();
        await acceptAllBtn.waitFor({ state: 'hidden' });
    }

    // Klik menu Products (dropdown)
    await page.locator("//button[@aria-haspopup='menu' and normalize-space()='Products']").click();

    // === Klik View Plan - GREAT Shield Active ===
    const shieldActiveBtn = page.locator("//a[contains(@href,'great-shield-active')]//button");
    await shieldActiveBtn.waitFor({ state: 'attached' });
    await shieldActiveBtn.evaluate((el) => el.click());

    await expect(page).toHaveURL(/product=friendcover-great-shield-active/);

    await page.goBack();

    // Cek ulang banner setelah goBack (kadang muncul lagi)
    await acceptAllBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await acceptAllBtn.isVisible().catch(() => false)) {
        await acceptAllBtn.click();
        await acceptAllBtn.waitFor({ state: 'hidden' });
    }

    await page.locator("//button[@aria-haspopup='menu' and normalize-space()='Products']").click();

    // === Klik View Plan - GREAT Home 360 ===
    const homeBtn = page.locator("//a[contains(@href,'great-home-360')]//button");
    await homeBtn.waitFor({ state: 'attached' });
    await homeBtn.evaluate((el) => el.click());

    await expect(page).toHaveURL(/product=friendcover-great-home-360/);
});