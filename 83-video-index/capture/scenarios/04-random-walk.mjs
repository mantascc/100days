export const meta = {
    slug: '04-random-walk',
    title: 'Random Walk',
    warmupMs: 800,
    zoom: 1.25,
};

export async function play(page) {
    await page.locator('#c').waitFor();
    await page.waitForTimeout(3500);
}
