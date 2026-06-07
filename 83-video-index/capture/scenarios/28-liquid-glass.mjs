export const meta = {
    slug: '28-liquid-glass',
    title: 'Liquid Glass',
    warmupMs: 400,
};

export async function play(page) {
    await page.mouse.move(220, 360);
    await page.waitForTimeout(200);
    await page.mouse.down();
    await page.mouse.move(140, 260, { steps: 30 });
    await page.waitForTimeout(100);
    await page.mouse.move(300, 220, { steps: 35 });
    await page.waitForTimeout(100);
    await page.mouse.move(340, 460, { steps: 40 });
    await page.waitForTimeout(100);
    await page.mouse.move(160, 420, { steps: 35 });
    await page.waitForTimeout(100);
    await page.mouse.move(220, 360, { steps: 30 });
    await page.mouse.up();
    await page.waitForTimeout(300);
}
