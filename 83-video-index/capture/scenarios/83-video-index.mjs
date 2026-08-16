export const meta = {
    slug: '83-video-index',
    title: 'Video Index',
    warmupMs: 1200,
};

export async function play(page) {
    // hover tiles so their loops swap in
    const tiles = await page.$$('.tile, .card, a[href]');
    for (const t of tiles.slice(0, 4)) {
        const b = await t.boundingBox();
        if (!b) continue;
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 10 });
        await page.waitForTimeout(750);
    }
    await page.waitForTimeout(600);
}
