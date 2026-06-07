export const meta = {
    slug: '21-interaction-heatmap',
    title: 'Interaction Heatmap',
    warmupMs: 700,
    crop: '720:300:0:160',
    vf: 'pad=720:720:0:210:black',
};

export async function play(page) {
    const hover = async (x, y) => {
        await page.mouse.move(x, y, { steps: 25 });
        await page.waitForTimeout(550);
    };
    await hover(280, 300);
    await hover(450, 320);
    await hover(360, 340);
    await hover(250, 320);
    await hover(500, 300);
    await hover(380, 320);
}
