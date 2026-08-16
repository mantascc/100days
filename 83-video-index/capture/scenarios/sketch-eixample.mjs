export const meta = {
    slug: 'sketch-eixample',
    title: 'Eixample',
    path: 'daily-sketch/sketch-eixample',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.waitForTimeout(900);
    await page.click('[data-m="shuffle"]').catch(() => {});
    await page.waitForTimeout(1100);
    await page.click('#next').catch(() => {});
    await page.waitForTimeout(1200);
}
