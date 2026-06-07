export const meta = {
    slug: '11-brownian-tree',
    title: 'Ambient Clock',
    warmupMs: 2000,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
