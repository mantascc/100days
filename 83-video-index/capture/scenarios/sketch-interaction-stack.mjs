export const meta = {
    slug: 'sketch-interaction-stack',
    title: 'Interaction Stack',
    path: 'daily-sketch/sketch-interaction-stack',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1600);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(1400);
}
