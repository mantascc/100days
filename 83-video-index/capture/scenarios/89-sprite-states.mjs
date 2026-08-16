export const meta = {
    slug: '89-sprite-states',
    title: 'Sprite States',
    warmupMs: 900,
};

export async function play(page) {
    // the four-state atlas cycles on its own
    await page.mouse.move(360, 300, { steps: 20 });
    await page.waitForTimeout(3400);
}
