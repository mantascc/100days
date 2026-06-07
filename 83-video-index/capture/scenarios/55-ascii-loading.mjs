export const meta = {
    slug: '55-ascii-loading',
    title: 'Ascii Loading',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
