export const meta = {
    slug: 'sketch-torus-sheet',
    title: 'Torus Sheet',
    path: 'daily-sketch/sketch-torus-sheet',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(200, 240, { steps: 12 });
    await page.waitForTimeout(1200);
    await page.mouse.move(520, 460, { steps: 45 });
    await page.waitForTimeout(1700);
}
