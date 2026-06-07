export const meta = {
    slug: '17-audio-reactive-network',
    title: 'Audio-reactive Network',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
