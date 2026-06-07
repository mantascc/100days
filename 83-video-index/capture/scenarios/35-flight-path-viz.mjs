export const meta = {
    slug: '35-flight-path-viz',
    title: 'Flight Path Viz',
    warmupMs: 900,
    zoom: 0.75,
    crop: '720:540:0:90',
};

export async function play(page) {
    await page.setViewportSize({ width: 960, height: 720 });
    await page.locator('#map').waitFor();
    await page.waitForTimeout(300);
    await page.locator('#playPauseBtn').click();
    await page.waitForTimeout(2400);
    await page.locator('.notification-card[data-waypoint="1"]').click();
    await page.waitForTimeout(700);
}
