export const meta = {
    slug: '20-schelling-model',
    title: 'Schelling Model',
    warmupMs: 600,
    zoom: 1,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.locator('#play').click();
    await page.waitForTimeout(3600);
}
