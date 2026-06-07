export const meta = {
    slug: '34-particle-text-morph',
    title: 'Particle Text Morph',
    warmupMs: 1800,
};

export async function play(page) {
    await page.addInitScript(() => {
        Object.defineProperty(window, 'innerWidth', { get: () => 769, configurable: true });
    });
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(400);
    await page.evaluate(() => {
        document.getElementById('canvas').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await page.waitForTimeout(3400);
}
