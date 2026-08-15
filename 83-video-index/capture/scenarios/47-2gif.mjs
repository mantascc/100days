export const meta = {
    slug: '47-2gif',
    title: '2GIF',
    path: '47-2gif/2gif',
    warmupMs: 1400,
    disabled: true,
};

export async function play(page) {
    // needs a dropped video file, so this is the empty initial state
    await page.waitForTimeout(2600);
}
