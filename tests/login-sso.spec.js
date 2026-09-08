const { test, expect } = require('@playwright/test');

test('Friendcover STG', async ({ page }) => {
    await page.goto('https://gegm-friendcover.stg.friendsure.io/');

    // Isi Phone Number (WhatsApp)
    const phoneInput = page.getByLabel('Enter Phone Number');
    await phoneInput.fill('82219082025');

    // Isi Email
    const emailInput = page.getByLabel('Email');
    await emailInput.fill('teman19agustus@yopmail.com');

    // Klik tombol Send OTP, tunggu response API-nya
    const sendOtpBtn = page.getByRole('button', { name: 'Send OTP' });
    const [otpResponse] = await Promise.all([
        page.waitForResponse(
            (res) => res.url().includes('/otp/send') && res.request().method() === 'POST'
        ),
        sendOtpBtn.click(),
    ]);
    expect(otpResponse.status()).toBe(201);

    // Tunggu elemen OTP muncul setelah API selesai
    const otpInputs = page.locator('//form//div[contains(@class,"otp-container")]//input[contains(@class,"otp-input")]');
    await expect(otpInputs).toHaveCount(6, { timeout: 10000 });

    // Input OTP
    const otp = '111111';
    for (let i = 0; i < otp.length; i++) {
        await otpInputs.nth(i).fill(otp[i]);
    }
});