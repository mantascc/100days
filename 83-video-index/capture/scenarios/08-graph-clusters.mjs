export const meta = {
    slug: '08-graph-clusters',
    title: 'Graph Clusters',
    warmupMs: 800,
    zoom: 1,
    crop: '420:620:150:50',
};

export async function play(page) {
    await page.waitForTimeout(1800);
    await page.keyboard.press('r');
    await page.waitForTimeout(1800);
}
