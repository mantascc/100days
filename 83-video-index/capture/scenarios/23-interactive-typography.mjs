export const meta = {
    slug: '23-interactive-typography',
    title: 'Interactive Typography',
    warmupMs: 400,
    zoom: 0.85,
};

export async function play(page) {
    const letters = page.locator('.letter:not(.space)');
    const count = await letters.count();
    for (let i = 0; i < count; i++) {
        await letters.nth(i).hover();
        await page.waitForTimeout(110);
    }
    await page.mouse.move(360, 600);
    await page.waitForTimeout(180);
    await page.mouse.click(360, 600);
    await page.waitForTimeout(380);
    await page.mouse.click(360, 600);
    await page.waitForTimeout(380);
    for (let i = count - 1; i >= 0; i -= 2) {
        await letters.nth(i).hover();
        await page.waitForTimeout(90);
    }
    await page.waitForTimeout(200);
}
