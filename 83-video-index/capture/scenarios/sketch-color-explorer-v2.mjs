export const meta = {
    slug: 'sketch-color-explorer-v2',
    title: 'Color Explorer V2',
    path: 'daily-sketch/sketch-color-explorer-v2',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    // most daily sketches are ambient or mouse-reactive; trace a slow arc
    await page.mouse.move(200, 240, { steps: 12 });
    await page.waitForTimeout(1200);
    await page.mouse.move(520, 460, { steps: 45 });
    await page.waitForTimeout(1700);
}
