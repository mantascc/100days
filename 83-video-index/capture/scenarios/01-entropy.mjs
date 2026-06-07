export const meta = {
    slug: '01-entropy',
    title: 'Entropy',
    warmupMs: 500,
};

export async function play(page) {
    const slider = page.locator('#entropyRange');
    await slider.waitFor();
    const steps = 35;
    const duration = 3400;
    const stepDelay = duration / steps;
    for (let i = 0; i <= steps; i++) {
        const value = Math.round((i / steps) * 100);
        await page.evaluate((v) => {
            const r = document.getElementById('entropyRange');
            r.value = String(v);
            r.dispatchEvent(new Event('input', { bubbles: true }));
        }, value);
        await page.waitForTimeout(stepDelay);
    }
}
