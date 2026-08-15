export const meta = {
    slug: '82-z-axis',
    title: 'Z-Axis',
    warmupMs: 900,
};

export async function play(page) {
    // step through the pattern library
    for (let i = 0; i < 3; i++) {
        await page.mouse.move(360, 360, { steps: 12 });
        await page.waitForTimeout(700);
        await page.click('#next');
    }
    await page.waitForTimeout(900);
}
