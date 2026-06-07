// Copy this file to scenarios/<sketch-slug>.mjs.
//
// The viewport is 720x720; coordinates below assume that frame.
// Total clip = warmupMs (trimmed off the front) + however long play() runs.
// Aim for the post-trim portion to be ~3-4 seconds.

export const meta = {
    slug: 'NN-sketch-slug',
    title: 'Display title',
    warmupMs: 600,
};

export async function play(page) {
    // example: idle observation (no interaction)
    await page.waitForTimeout(3500);
}
