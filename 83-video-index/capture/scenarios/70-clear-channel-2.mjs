export const meta = {
    slug: '70-clear-channel-2',
    title: 'Clear Channel 2',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
