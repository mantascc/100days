export const meta = {
    slug: '31-cli-material-palette',
    title: 'CLI Material Palette',
    warmupMs: 300,
    zoom: 0.95,
};

export async function play(page) {
    await page.locator('nav a[href="#temporal"]').click();
    await page.waitForTimeout(250);
    await page.locator('button.execute-btn[data-example="tasks"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.locator('button.execute-btn[data-example="tasks"]').click();
    await page.waitForTimeout(1700);
    await page.locator('button.execute-btn[data-example="progress"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.locator('button.execute-btn[data-example="progress"]').click();
    await page.waitForTimeout(1400);
}
