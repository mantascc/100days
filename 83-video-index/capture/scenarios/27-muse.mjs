export const meta = {
    slug: '27-muse',
    title: 'Muse',
    warmupMs: 300,
    zoom: 1,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.evaluate(() => {
        document.getElementById('mobile-warning').style.display = 'none';
        document.getElementById('playground').style.display = 'block';
        window.dispatchEvent(new Event('resize'));
    });
    await page.locator('#playground').click();
    const tap = async (key, ms) => {
        await page.keyboard.down(key);
        await page.waitForTimeout(ms);
        await page.keyboard.up(key);
    };
    await tap('w', 350);
    await tap('d', 250);
    await tap('w', 200);
    await tap('a', 300);
    await tap('w', 180);
    await tap('d', 400);
    await page.waitForTimeout(900);
    await tap('w', 220);
    await tap('a', 250);
    await page.waitForTimeout(600);
}
