const { test, expect } = require('@playwright/test');

test('Great Shield Active Plan 7', async ({ page }) => {
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

    // Click checkbox
    const pdpCheckbox = page.locator("//button[@id='pdp-checkbox']");
    await pdpCheckbox.click();
    await expect(pdpCheckbox).toHaveAttribute('aria-checked', 'true');

    // Click select occupation — tunggu sampai benar-benar enabled dulu
    const occupationBtn = page.getByRole('button', { name: 'Select occupation' });
    await expect(occupationBtn).toBeEnabled({ timeout: 10000 });
    // Ambil jeda micro-seconds agar React Hydration / State selesai memproses checkbox
    await page.waitForTimeout(500); 
    // Gunakan click standard Playwright agar actionability terjaga
    await occupationBtn.click();

    const modal = page.locator('div.fixed.inset-0.z-50').last();

    const occupation = modal.getByRole('button', {
        name: 'ACCOUNT MANAGER',
        exact: true
    });

    await expect(occupation).toBeVisible();
    await occupation.scrollIntoViewIfNeeded();
    await occupation.click();

    // scroll
    await page.mouse.wheel(0, 350);

    // select plan 7
    await page.getByRole('button', { name: 'RM1,515.89 Yearly Premium' }).click();

    // input contact detail
    await page.locator("//input[@name='fullName']").fill('Automate GSA Plan Seven');
    await page.locator("//input[@name='phone']").fill('89745452323');
    await page.locator("//input[@name='email']").fill('automatest@yopmail.com');

    // click checkbox
    await page.locator("//button[@id='accept-eula']").click();

    // click next button
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // select salutation
    await page.getByPlaceholder('Choose Salutation').click();
    await page.waitForTimeout(500); 
    // Cari elemen dengan role opsi murni bernama "Mr"
    await page.getByText('Mr', { exact: true }).click();

    // input NRIC
    await page.getByPlaceholder('Insert identification number').fill('911111111111');

    // select gender
    await page.getByPlaceholder('Choose Gender').click();
    await page.waitForTimeout(500); 
    // Cari elemen dengan role opsi murni bernama "Male"
    await page.getByText('Male', { exact: true }).click();

    // select race
    await page.getByPlaceholder('Choose Race').click();
    await page.waitForTimeout(500); 
    // Cari elemen dengan role opsi murni bernama "Malay"
    await page.getByText('Malay', { exact: true }).click();

    // select marital status
    await page.getByPlaceholder('Choose marital status').click();
    await page.waitForTimeout(500); 
    // Cari elemen dengan role opsi murni bernama "Married"
    await page.getByText('Married', { exact: true }).click();

    await page.mouse.wheel(0, 250);
    // === RESIDENTIAL ADDRESS ===
    await page.locator("//input[@name='residentialAddressLine1']").fill('Jalan Jalal Maklimah');
    await page.locator("//input[@name='residentialAddressLine2']").fill('Bi Adab No 09');

    // Address Line 3 bersifat optional (tidak ada tanda *) — cek name attribute-nya via inspect
    // Asumsi pola penamaan konsisten:
    await page.locator("//input[@name='residentialAddressLine3']").fill('Kuala Lumpur').catch(() => {
        console.log('Address Line 3 residential tidak ditemukan atau field berbeda');
    });

    // Postcode — scoped ke residential (cek dulu apakah placeholder-nya juga duplikat)
    await page.getByPlaceholder('Choose Postcode').first().click();
    await page.waitForTimeout(500);
    await page.getByText('1000', { exact: true }).click();

    // Click checkbox mailing same as residential
    const mailingCheckbox = page.locator("//button[@id='mailing-same-as-residential']");
    await mailingCheckbox.click();
    await expect(mailingCheckbox).toHaveAttribute('aria-checked', 'true');

    // click next button
    await page.getByRole('button', { name: 'Next', exact: true }).click();

    // tunggu tampilan halaman summary
    await page.waitForTimeout(1000); 

    //checkbox1 summary
    const premiumCheckbox = page.locator('#premium-summary-id-1');
    await premiumCheckbox.click();
    // checkbox2 summary
    const underwritingCheckbox = page.locator('#premium-summary-id-2');
    await underwritingCheckbox.scrollIntoViewIfNeeded();
    await underwritingCheckbox.click();
    await expect(underwritingCheckbox).toHaveAttribute(
        'aria-checked',
        'true'
    );

    // Pay button
    await page.getByRole('button', {
        name: 'Pay',
        exact: true
    }).click();

    // final validation
    await expect(page).toHaveURL(/payment|checkout/i);
    const paymentAmount = page.getByText('MYR 1515.89', {
        exact: true
    });

});