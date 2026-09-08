const { test, expect } = require('@playwright/test');

test('Great Home 360 Plan 2', async ({ page }) => {
    await page.goto('https://friendcover.my/');
    await expect(page).toHaveTitle('GEGM FriendCover');

    const acceptAllBtn = page.getByRole('button', { name: 'Accept All' });
    await acceptAllBtn.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    if (await acceptAllBtn.isVisible().catch(() => false)) {
        await acceptAllBtn.click();
        await acceptAllBtn.waitFor({ state: 'hidden' });
    }

    await page.locator("//button[@aria-haspopup='menu' and normalize-space()='Products']").click();

    const shieldActiveBtn = page.locator("//a[contains(@href,'great-home-360')]//button");
    await shieldActiveBtn.waitFor({ state: 'attached' });
    await shieldActiveBtn.evaluate((el) => el.click());

    // Sesuaikan dengan pola URL PRD: /plan/great-shield-active
    await expect(page).toHaveURL(/\/plan\/great-home-360/);

    // Click checkbox
    const pdpCheckbox = page.locator("//button[@id='pdp-checkbox']");
    await pdpCheckbox.click();
    await expect(pdpCheckbox).toHaveAttribute('aria-checked', 'true');

    //select plan
    const premiumBtn = page.getByRole('button', {
        name: 'RM430.55 Yearly Premium (Subject to SST & Stamp Duty)'});
    await premiumBtn.click();

    // input contact detail
    await page.locator("//input[@name='fullName']").fill('Automate Test Home Plan Two');
    await page.locator("//input[@name='phone']").fill('89745452324');
    await page.locator("//input[@name='email']").fill('automatest360@yopmail.com');

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
    await page.getByPlaceholder('Insert identification number').fill('891111111111');

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

    // tunggu tampilan building detail
    await page.waitForTimeout(1000);

    // SELECT CONSTRUCTION CLASSIFICATIONS (dropdown pertama)
    // Cari berdasarkan label "Construction Classifications"
    await page.locator('//label[contains(text(),"Construction Classifications")]/following::input[1]').click();
    const option = page.getByText('1B. Partly Brick/Partly metal sheet wall', { exact: true });
    await expect(option).toBeVisible();
    await option.click();

    // SELECT PROPERTY TYPE (dropdown kedua)
    await page.locator('//label[contains(text(),"Property Type")]/following::input[1]').click();
    const propertyOption = page.getByText('Flats and Apartments', { exact: true });
    await expect(propertyOption).toBeVisible();
    await propertyOption.click();

    // SELECT CONSTRUCTION YEAR (dropdown ketiga) - opsional
    await page.locator('//label[contains(text(),"Construction Year")]/following::input[1]').click();
    // pilih tahun yang sesuai
    const yearOption = page.getByText('1955', { exact: true });
    await expect(yearOption).toBeVisible();
    await yearOption.click();

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

    await page.waitForTimeout(3000);

    // final validation
    // Wait for either URL change or payment content to appear
    await Promise.race([
        page.waitForURL(/payment|checkout|midtrans|xendit/i, { timeout: 10000 }),
        page.waitForSelector('text=MYR 474.99', { timeout: 10000 }),
        page.waitForSelector('[data-testid="total-due"]', { timeout: 10000 })
    ]);
    // Verify payment amount using most reliable selector
    const paymentAmount = page.getByText('MYR 474.99').first();
    await expect(paymentAmount).toBeVisible({ timeout: 10000 });
    await expect(paymentAmount).toHaveText('MYR 474.99');

});