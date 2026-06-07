export const meta = {
    slug: '39-wave-morph',
    title: 'Wave Morph',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
