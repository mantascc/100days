export const meta = {
    slug: '67-audio-reactive-ascii',
    title: 'Audio Reactive Ascii',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
