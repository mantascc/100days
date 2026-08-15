export const meta = {
    slug: 'sketch-character-field',
    title: 'Character Field',
    path: 'daily-sketch/sketch-character-field',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(300, 300, { steps: 25 });
    await page.waitForTimeout(3000);
}
