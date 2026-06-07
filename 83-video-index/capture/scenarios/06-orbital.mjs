export const meta = {
    slug: '06-orbital',
    title: 'Orbital',
    warmupMs: 600,
};

export async function play(page) {
    await page.waitForTimeout(1600);
    await page.click('#resetBtn');
    await page.waitForTimeout(1800);
}
