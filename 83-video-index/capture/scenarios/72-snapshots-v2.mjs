export const meta = {
    slug: '72-snapshots-v2',
    title: 'Snapshots V2',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
