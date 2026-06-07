export const meta = {
    slug: '10-audio-reactive-agents',
    title: 'Audio-reactive Agents',
    warmupMs: 1500,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
