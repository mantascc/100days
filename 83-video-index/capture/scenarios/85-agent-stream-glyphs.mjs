export const meta = {
    slug: '85-agent-stream-glyphs',
    title: 'Agent-Stream Glyphs',
    warmupMs: 1000,
};

export async function play(page) {
    // the thumbnails animate on their own; open one into the feature overlay
    await page.mouse.move(360, 300, { steps: 20 });
    await page.waitForTimeout(1200);
    const cards = await page.$$('.card');
    if (cards[3]) await cards[3].click();
    await page.waitForTimeout(1800);
}
