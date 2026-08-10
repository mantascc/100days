export const meta = {
    slug: 'sketch-idle-crt',
    title: 'Idle Crt',
    path: 'daily-sketch/sketch-idle-crt',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.waitForTimeout(3800);
}
