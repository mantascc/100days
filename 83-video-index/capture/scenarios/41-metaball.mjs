export const meta = {
    slug: '41-metaball',
    title: 'Metaball',
    warmupMs: 800,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
