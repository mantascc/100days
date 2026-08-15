export const meta = {
    slug: 'sketch-idle',
    title: 'Idle',
    path: 'daily-sketch/sketch-idle',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    // the piece recharges the longer it is left alone
    await page.waitForTimeout(3800);
}
