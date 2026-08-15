export const meta = {
    slug: '84-id-card',
    title: 'ID Card',
    warmupMs: 900,
};

export async function play(page) {
    // the tilt follows the cursor, so trace a slow arc across the card
    await page.mouse.move(200, 200, { steps: 10 });
    await page.waitForTimeout(500);
    await page.mouse.move(540, 300, { steps: 40 });
    await page.waitForTimeout(400);
    await page.mouse.move(300, 520, { steps: 40 });
    await page.waitForTimeout(500);
    await page.click('#trigger').catch(() => {});
    await page.waitForTimeout(1200);
}
