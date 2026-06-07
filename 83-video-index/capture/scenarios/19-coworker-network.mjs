export const meta = {
    slug: '19-coworker-network',
    title: 'Coworker Network',
    warmupMs: 1500,
    zoom: 0.85,
    disabled: true,
};

export async function play(page) {
    await page.waitForTimeout(3500);
}
