export const meta = {
    slug: 'sketch-agent-stream-markov-map',
    title: 'Agent Stream Markov Map',
    path: 'daily-sketch/sketch-agent-stream-markov-map',
    tier: 'daily',
    warmupMs: 1000,
};

export async function play(page) {
    // most daily sketches are ambient or mouse-reactive; trace a slow arc
    await page.mouse.move(200, 240, { steps: 12 });
    await page.waitForTimeout(1200);
    await page.mouse.move(520, 460, { steps: 45 });
    await page.waitForTimeout(1700);
}
