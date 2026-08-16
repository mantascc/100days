export const meta = {
    slug: '86-agent-stream-scrub',
    title: 'Agent-Stream Scrub',
    warmupMs: 900,
};

export async function play(page) {
    await page.click('#play').catch(() => {});
    await page.waitForTimeout(2200);
    await page.click('[data-speed="2"]').catch(() => {});
    await page.waitForTimeout(1400);
}
