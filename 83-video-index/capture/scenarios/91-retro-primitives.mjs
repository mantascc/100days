export const meta = {
    slug: '91-retro-primitives',
    title: 'Retro Primitives',
    warmupMs: 1000,
};

export async function play(page) {
    // walk the palette-swap family: phosphor -> cryo -> signal
    await page.waitForTimeout(1200);
    await page.click('a[href="cryo.html"]').catch(() => {});
    await page.waitForTimeout(1400);
    await page.click('a[href="signal.html"]').catch(() => {});
    await page.waitForTimeout(1400);
}
