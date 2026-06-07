export const meta = {
    slug: '13-image-flow-field',
    title: 'Image Flow Field',
    warmupMs: 1800,
    zoom: 1,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.setViewportSize({ width: 720, height: 720 });
    await page.evaluate(() => {
        const w = document.getElementById('wave');
        if (w) {
            w.value = 5;
            w.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
        const w = document.getElementById('wave');
        if (w) {
            w.value = 9;
            w.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
    await page.waitForTimeout(1800);
}
