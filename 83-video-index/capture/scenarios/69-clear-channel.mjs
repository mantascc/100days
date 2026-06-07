export const meta = {
    slug: '69-clear-channel',
    title: 'Clear Channel',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
