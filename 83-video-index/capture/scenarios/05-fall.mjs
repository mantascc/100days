export const meta = {
    slug: '05-fall',
    title: 'Fall',
    warmupMs: 800,
    zoom: 1.25,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.locator('#c').waitFor();
    await page.waitForTimeout(3600);
}
