export const meta = {
    slug: '03-chaos-agent',
    title: 'Chaos Agent',
    warmupMs: 600,
};

export async function play(page) {
    await page.waitForTimeout(2000);
    await page.locator('#stage').click();
    await page.waitForTimeout(1800);
}
