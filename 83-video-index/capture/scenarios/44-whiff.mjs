export const meta = {
    slug: '44-whiff',
    title: 'Whiff',
    path: '44-whiff/canvas-app',
    warmupMs: 1200,
    disabled: true,
};

export async function play(page) {
    // the CLI feeds this over a websocket that is not running here
    await page.waitForTimeout(2600);
}
