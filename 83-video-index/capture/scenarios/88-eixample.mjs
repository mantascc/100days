export const meta = {
    slug: '88-eixample',
    title: 'Eixample',
    warmupMs: 900,
};

export async function play(page) {
    await page.waitForTimeout(700);
    await page.click('[data-m="shuffle"]').catch(() => {});
    await page.waitForTimeout(900);
    await page.click('#next').catch(() => {});
    await page.waitForTimeout(700);
    await page.click('[data-m="sample"]').catch(() => {});
    await page.waitForTimeout(1100);
}
