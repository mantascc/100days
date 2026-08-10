export const meta = {
    slug: '92-tube-tolerance',
    title: 'Tube Tolerance',
    warmupMs: 1200,
};

export async function play(page) {
    // sweep one pipeline axis end to end
    await page.mouse.move(360, 300, { steps: 15 });
    await page.waitForTimeout(1000);
    const sliders = await page.$$('input[type="range"]');
    if (sliders[0]) {
        const b = await sliders[0].boundingBox();
        if (b) {
            await page.mouse.move(b.x + 4, b.y + b.height / 2);
            await page.mouse.down();
            await page.mouse.move(b.x + b.width - 4, b.y + b.height / 2, { steps: 50 });
            await page.mouse.up();
        }
    }
    await page.waitForTimeout(1600);
}
