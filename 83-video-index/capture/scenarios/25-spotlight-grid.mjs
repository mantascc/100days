export const meta = {
    slug: '25-spotlight-grid',
    title: 'Spotlight Grid',
    warmupMs: 400,
};

export async function play(page) {
    await page.mouse.move(120, 140, { steps: 1 });
    await page.waitForTimeout(150);
    const path = [
        [600, 200], [520, 360], [220, 320], [180, 520], [500, 540],
    ];
    for (const [x, y] of path) {
        await page.mouse.move(x, y, { steps: 24 });
        await page.waitForTimeout(120);
    }
    await page.locator('#hue').fill('200');
    await page.waitForTimeout(120);
    await page.mouse.move(360, 360, { steps: 28 });
    await page.locator('#hue').fill('90');
    await page.waitForTimeout(120);
    await page.mouse.move(560, 240, { steps: 24 });
    await page.waitForTimeout(200);
}
