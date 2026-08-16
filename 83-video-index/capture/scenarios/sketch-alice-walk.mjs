export const meta = {
    slug: 'sketch-alice-walk',
    title: 'Alice Walk',
    path: 'daily-sketch/sketch-alice-walk',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.waitForTimeout(3600);
}
