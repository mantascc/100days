export const meta = {
    slug: '87-attention-distribution',
    title: 'Attention Distribution',
    warmupMs: 1200,
};

export async function play(page) {
    // nine small multiples of one running simulation — just let it run
    await page.waitForTimeout(3600);
}
