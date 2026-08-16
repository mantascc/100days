export const meta = {
    slug: 'sketch-tube-driven',
    title: 'Tube Driven',
    path: 'daily-sketch/sketch-tube-driven',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.mouse.move(200, 240, { steps: 12 });
    await page.waitForTimeout(1200);
    await page.mouse.move(520, 460, { steps: 45 });
    await page.waitForTimeout(1700);
}
