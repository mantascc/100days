export const meta = {
    slug: '30-thinking-states',
    title: 'Thinking States',
    warmupMs: 600,
    zoom: 1,
};

export async function play(page) {
    await page.locator('.loader-cell canvas').first().waitFor();
    await page.waitForTimeout(800);
    const cells = page.locator('.loader-cell');
    const idxs = [3, 12, 24, 7];
    for (const i of idxs) {
        await cells.nth(i).hover();
        await page.waitForTimeout(650);
    }
    await page.waitForTimeout(400);
}
