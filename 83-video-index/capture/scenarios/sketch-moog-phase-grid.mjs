export const meta = {
    slug: 'sketch-moog-phase-grid',
    title: 'Moog Phase Grid',
    path: 'daily-sketch/sketch-moog-phase-grid',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    await page.waitForTimeout(3600);
}
