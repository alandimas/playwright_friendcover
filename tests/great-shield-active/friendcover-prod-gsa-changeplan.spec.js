const { test, expect } = require('@playwright/test');

test('Great Shield Active Change Plan', async ({ page }) => {
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

    // select plan 1
    await page.getByRole('button', { name: 'RM160.98 Yearly Premium' }).click();

    // input contact detail
    await page.locator("//input[@name='fullName']").fill('Automate GSA Change Plan');
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

    // Edit plan
    const editProductIcon2 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon2.click();

    // select plan 2
    await page.getByRole('button', { name: 'RM272.87 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton.click();

    // tunggu sampai overlay benar-benar hilang
    const processing2 = page.getByText('Processing...', { exact: true });
    await expect(processing2).toBeHidden({
        timeout: 30000
    });

    // Validate Total Payable Amount after selecting Plan 2
    const totalPayableSection = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection).toContainText('RM272.87', {
        timeout: 30000
    });

    // Edit plan
    const editProductIcon3 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon3.click();

    // select plan 3
    await page.getByRole('button', { name: 'RM395.13 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton3 = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton3.click();

    // tunggu sampai overlay benar-benar hilang
    const processing3 = page.getByText('Processing...', { exact: true });
    await expect(processing3).toBeHidden({
        timeout: 30000
    });

    // Validate Total Payable Amount after selecting Plan 3 
    const totalPayableSection3 = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection3).toContainText('RM395.13', {
        timeout: 30000
    });

    // Edit plan
    const editProductIcon4 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon4.click();

    // select plan 4
    await page.getByRole('button', { name: 'RM517.39 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton4 = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton4.click();

    // tunggu sampai overlay benar-benar hilang
    const processing4 = page.getByText('Processing...', { exact: true });
    await expect(processing4).toBeHidden({
        timeout: 30000
    });

    // Validate Total Payable Amount after selecting Plan 4
    const totalPayableSection4 = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection4).toContainText('RM517.39');

    // Edit plan
    const editProductIcon5 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon5.click();

    // select plan 5
    await page.getByRole('button', { name: 'RM823.06 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton5 = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton5.click();

    // tunggu sampai overlay benar-benar hilang
    await expect(
        page.locator(
            'div.absolute.inset-0.z-50.flex.items-center.justify-center.bg-white\\/70'
        )
    ).toBeHidden({ timeout: 15000 });

    // Validate Total Payable Amount after selecting Plan 5
    const totalPayableSection5 = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection5).toContainText('RM823.06');

    // Edit plan
    const editProductIcon6 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon6.click();

    // select plan 6
    await page.getByRole('button', { name: 'RM986.07 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton6 = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton6.click();

    // tunggu sampai overlay benar-benar hilang
    await expect(
        page.locator(
            'div.absolute.inset-0.z-50.flex.items-center.justify-center.bg-white\\/70'
        )
    ).toBeHidden({ timeout: 15000 });

    // Validate Total Payable Amount after selecting Plan 6
    const totalPayableSection6 = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection6).toContainText('RM986.07');

    // Edit plan
    const editProductIcon7 = page.locator('div.rounded-lg:has(h1:has-text("GREAT Shield Active")) svg.cursor-pointer');
    await editProductIcon7.click();

    // select plan 7
    await page.getByRole('button', { name: 'RM1,515.89 Yearly Premium' }).click();

    // Gunakan ini - paling stabil dan semantic
    const confirmButton7 = page.getByRole('button', { name: 'Confirm', exact: true });
    await confirmButton7.click();

    // tunggu sampai overlay benar-benar hilang
    await expect(
        page.locator(
            'div.absolute.inset-0.z-50.flex.items-center.justify-center.bg-white\\/70'
        )
    ).toBeHidden({ timeout: 15000 });

    // Validate Total Payable Amount after selecting Plan 7
    const totalPayableSection7 = page
        .getByText('Total Payable Amount', { exact: true })
        .locator('..');
    await expect(totalPayableSection7).toContainText('RM1,515.89');

});