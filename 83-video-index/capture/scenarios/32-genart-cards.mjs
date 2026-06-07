export const meta = {
    slug: '32-genart-cards',
    title: 'Entropy Patterns',
    warmupMs: 600,
};

export async function play(page) {
    await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo({ top: 220, behavior: 'smooth' }));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(500);
    await page.click('.tab-btn[data-tab="scale"]');
    await page.waitForTimeout(700);
    await page.evaluate(() => {
        const el = document.getElementById('scale-content');
        if (el) el.scrollTo({ left: 320, behavior: 'smooth' });
    });
    await page.waitForTimeout(800);
}
