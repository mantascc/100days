export const meta = {
    slug: '22-directed-network',
    title: 'Directed Network',
    warmupMs: 1600,
    zoom: 1,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.waitForTimeout(600);
    await page.mouse.move(360, 360);
    await page.mouse.down();
    for (let i = 1; i <= 24; i++) {
        await page.mouse.move(360 + Math.cos(i * 0.35) * i * 5, 360 + Math.sin(i * 0.35) * i * 5);
        await page.waitForTimeout(35);
    }
    await page.mouse.up();
    await page.waitForTimeout(500);
    await page.mouse.move(200, 480);
    await page.waitForTimeout(300);
    await page.mouse.move(540, 240);
    await page.waitForTimeout(500);
}
