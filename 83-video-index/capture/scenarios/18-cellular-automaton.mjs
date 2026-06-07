export const meta = {
    slug: '18-cellular-automaton',
    title: 'Cellular Automaton',
    warmupMs: 400,
    zoom: 1.5,
    crop: '720:720:0:0',
};

export async function play(page) {
    await page.locator('#c').waitFor();
    await page.locator('#c').focus().catch(() => {});
    for (let i = 0; i < 18; i++) {
        await page.keyboard.press('Space');
        await page.waitForTimeout(180);
    }
    await page.waitForTimeout(400);
}
