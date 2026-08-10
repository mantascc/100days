export const meta = {
    slug: 'sketch-geo',
    title: 'Geo',
    path: 'daily-sketch/sketch-geo',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(360, 360, { steps: 30 });
    await page.waitForTimeout(3000);
}
