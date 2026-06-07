export const meta = {
    slug: '26-widget-dashboard',
    title: 'Widget Dashboard',
    warmupMs: 400,
    zoom: 1.6,
    crop: '720:720:0:0',
};
export async function play(page) {
    await page.waitForTimeout(200);
    await page.locator('#addMetric').click();
    await page.waitForTimeout(450);
    await page.locator('#addChart').click();
    await page.waitForTimeout(500);
    await page.locator('#addMoonPhase').click();
    await page.waitForTimeout(550);
    await page.locator('#addAgent').click();
    await page.waitForTimeout(700);
    await page.mouse.move(360, 360, { steps: 20 });
    await page.waitForTimeout(400);
}
