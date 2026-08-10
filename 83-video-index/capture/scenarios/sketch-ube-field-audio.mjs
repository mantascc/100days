export const meta = {
    slug: 'sketch-ube-field-audio',
    title: 'Ube Field Audio',
    path: 'daily-sketch/sketch-ube-field-audio',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.waitForTimeout(3600);
}
