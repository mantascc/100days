export const meta = {
    slug: 'sketch-sticky-banner',
    title: 'Sticky Banner',
    path: 'daily-sketch/sketch-sticky-banner',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1400);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(1400);
}
