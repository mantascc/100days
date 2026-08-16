export const meta = {
    slug: 'sketch-character-sandbox',
    title: 'Character Sandbox',
    path: 'daily-sketch/sketch-character-sandbox',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(300, 300, { steps: 25 });
    await page.waitForTimeout(1400);
    await page.mouse.move(480, 420, { steps: 40 });
    await page.waitForTimeout(1400);
}
