export const meta = {
    slug: '09-planar-graph',
    title: 'Planar Graph',
    warmupMs: 1000,
    zoom: 1.7,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.waitForSelector('#stage canvas');
    const stage = page.locator('#stage');
    await page.waitForTimeout(600);
    await stage.dispatchEvent('pointerdown', { position: { x: 210, y: 210 } });
    for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const x = 210 + Math.cos(t * Math.PI * 2) * 60;
        const y = 210 + Math.sin(t * Math.PI * 2) * 60;
        await stage.dispatchEvent('pointermove', { position: { x, y } });
        await page.waitForTimeout(90);
    }
    await page.dispatchEvent('body', 'pointerup');
    await page.waitForTimeout(800);
}
