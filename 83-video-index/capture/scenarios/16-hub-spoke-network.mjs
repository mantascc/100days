export const meta = {
    slug: '16-hub-spoke-network',
    title: 'Hub Spoke Network',
    warmupMs: 1200,
};

export async function play(page) {
    await page.waitForTimeout(1400);
    await page.mouse.move(360, 360);
    await page.mouse.down();
    for (let i = 1; i <= 20; i++) {
        await page.mouse.move(360 + i * 6, 360 - i * 5);
        await page.waitForTimeout(40);
    }
    await page.waitForTimeout(400);
    await page.mouse.up();
    await page.waitForTimeout(900);
}
