export const meta = {
    slug: '90-aida001',
    title: 'AIDA001',
    warmupMs: 1000,
};

export async function play(page) {
    // audio drives the swarm, so start playback before recording the drift
    await page.click('#playPause').catch(() => {});
    await page.waitForTimeout(2000);
    await page.click('[data-sample="pattern-2"]').catch(() => {});
    await page.waitForTimeout(1800);
}
