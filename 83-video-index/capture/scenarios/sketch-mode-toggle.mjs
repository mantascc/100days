export const meta = {
    slug: 'sketch-mode-toggle',
    title: 'Mode Toggle',
    path: 'daily-sketch/sketch-mode-toggle',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(360, 300, { steps: 20 });
    await page.waitForTimeout(3200);
}
