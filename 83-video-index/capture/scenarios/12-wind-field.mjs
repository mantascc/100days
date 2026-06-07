export const meta = {
    slug: '12-wind-field',
    title: 'Wind Field',
    warmupMs: 500,
};

export async function play(page) {
    await page.evaluate(() => {
        const el = document.getElementById('wind');
        el.value = 4;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(900);
    for (let i = 0; i <= 12; i++) {
        const v = 4 + i * 0.5;
        await page.evaluate((val) => {
            const el = document.getElementById('wind');
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }, v);
        await page.waitForTimeout(160);
    }
    await page.waitForTimeout(600);
}
