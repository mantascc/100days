export const meta = {
    slug: 'sketch-field-notes',
    title: 'Field Notes',
    path: 'daily-sketch/sketch-field-notes',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(1600);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(1400);
}
