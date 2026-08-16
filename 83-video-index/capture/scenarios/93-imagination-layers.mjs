export const meta = {
    slug: '93-imagination-layers',
    title: 'Imagination Layers',
    warmupMs: 1400,
};

export async function play(page) {
    // orbit the stack by hand, then isolate a plane and flatten it
    await page.mouse.move(360, 340);
    await page.mouse.down();
    await page.mouse.move(250, 300, { steps: 40 });
    await page.mouse.up();
    await page.waitForTimeout(500);
    await page.mouse.click(60, 194);          // rail: threads
    await page.waitForTimeout(1300);
    await page.keyboard.press('f');           // flatten the focused plane
    await page.waitForTimeout(1600);
}
