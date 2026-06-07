export const meta = {
    slug: '07-apophenia',
    title: 'Apophenia',
    warmupMs: 1200,
    zoom: 1,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.waitForSelector('#stage canvas');
    await page.waitForTimeout(3500);
}
