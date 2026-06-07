export const meta = {
    slug: '02-vicsek-model',
    title: 'Vicsek Model',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(1500);
    await page.locator('#radius').evaluate((el) => {
        el.value = '40';
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(1500);
    await page.locator('#noise').evaluate((el) => {
        el.value = '3';
        el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(1200);
}
